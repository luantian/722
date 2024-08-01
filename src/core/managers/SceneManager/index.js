import * as THREE from 'three';

export class SceneManager {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * 导出场景为 JSON 格式
   * @returns {Object} 场景的 JSON 数据
   */
  exportSceneAsJSON() {
    return this.scene.toJSON();
  }

  /**
   * 从 JSON 数据加载场景
   * @param {Object} json - 场景的 JSON 数据
   * @param {Function} [onLoad] - 加载完成回调
   */
  loadSceneFromJSON(json, onLoad) {
    const loader = new THREE.ObjectLoader();
    const scene = loader.parse(json);
    this.scene.copy(scene, true);
    if (onLoad) onLoad(scene);
  }
}
