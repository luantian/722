import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export class ModelManager {
  constructor(scene, dracoDecoderPath = '/libs/draco/') {
    this.scene = scene;
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath(dracoDecoderPath);

    // 初始化各种模型加载器
    this.loaders = {
      gltf: new GLTFLoader(),
      glb: new GLTFLoader(),
      obj: new OBJLoader(),
      fbx: new FBXLoader(),
    };
    this.loaders.gltf.setDRACOLoader(this.dracoLoader);
    this.loaders.glb.setDRACOLoader(this.dracoLoader);
  }

  /**
   * 获取文件类型
   * @param {string} path - 文件路径
   * @returns {string} 文件类型
   */
  getFileType(path) {
    return path.split('.').pop().toLowerCase();
  }

  /**
   * 加载模型
   * @param {Object} params - 参数对象
   * @param {string} params.path - 模型文件路径
   * @param {Function} params.onLoad - 模型加载成功回调
   * @param {Function} [params.onProgress] - 模型加载进度回调
   * @param {Function} [params.onError] - 模型加载失败回调
   */
  loadModel({ path, onLoad, onProgress, onError }) {
    const type = this.getFileType(path);
    const loader = this.loaders[type];

    if (!loader) {
      const errorMsg = `暂不支持${type}类型，请联系管理员扩展`;
      console.error(errorMsg);
      if (onError) onError(new Error(errorMsg));
      return;
    }

    loader.load(
      path,
      (model) => {
        console.log(`模型加载成功: ${path}`);
        if (type === 'glb' || type === 'gltf') {
          this.calcMeshCenter(model.scene);
        }
        this.scene.add(model.scene || model);
        if (onLoad) onLoad(model);
      },
      onProgress || ((xhr) => {
        // console.log(`${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`);
      }),
      (error) => {
        const errorMsg = `模型加载错误: ${path}`;
        console.error(errorMsg, error);
        if (onError) onError(error);
      }
    );
  }

  /**
   * 计算并设置模型中心
   * @param {THREE.Group} group - 模型组
   */
  calcMeshCenter(group) {
    const box3 = new THREE.Box3();
    box3.expandByObject(group);
    const center = new THREE.Vector3(0, 0, 0);
    box3.getCenter(center);
    group.position.set(-center.x, -center.y, -center.z);
  }

  /**
   * 释放DRACO加载器资源
   */
  dispose() {
    this.dracoLoader.dispose();
  }

}

export default ModelManager;
