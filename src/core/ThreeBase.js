import * as THREE from 'three';
import { CameraManager } from './managers/CameraManager';
import { RendererManager } from './managers/RendererManager';
import { ControlManager } from './managers/ControlManager';
import { LightManager } from './managers/LightManager';
import { ModelManager } from './managers/ModelManager';
import { StatsManager } from './managers/StatsManager';
import { EventManager } from './managers/EventManager';
import { AnimationManager } from './managers/AnimationManager';
import { TextureManager } from './managers/TextureManager';
import { HelperManager } from './managers/HelperManager';
import { SceneManager } from './managers/SceneManager';
import { PostProcessingManager } from './managers/PostProcessingManager';
import { BloomOutputPass } from './managers/LightManager/BloomOutputPass';
import { BloomOutlinePass } from './managers/LightManager/BloomOutlinePass';

export class ThreeBase {
  constructor(options) {
    const requiredFields = ['container'];
    const isValidateResult = this.validateFields(options, requiredFields);
    if (!isValidateResult) {
      return console.warn('初始化ThreeBase有误，请检查参数');
    }
    this.options = options;
    this.container = options.container;

    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.options.backgroundColor || '#000000');

    if (this.options.fogColor) {
      this.scene.fog = new THREE.Fog(this.options.fogColor, 10, 1000);
    }

    this.cameraManager = new CameraManager(this.container);
    this.rendererManager = new RendererManager(this.container);
    this.controlManager = new ControlManager(this.cameraManager.camera, this.rendererManager.renderer);
    this.lightManager = new LightManager(this.scene);
    this.modelManager = new ModelManager(this.scene);
    this.animationManager = new AnimationManager();
    this.textureManager = new TextureManager(this.scene);
    this.helperManager = new HelperManager(this.scene);
    this.sceneManager = new SceneManager(this.scene);
    this.postProcessingManager = new PostProcessingManager(this.scene, this.cameraManager.camera, this.rendererManager.renderer);

    if (this.options.enableStats) {
      this.statsManager = new StatsManager(this.container);
    }
    this.eventManager = new EventManager(this.cameraManager, this.rendererManager, this.container);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // this.bloomOutputPass = new BloomOutputPass(this.scene, this.cameraManager.camera, this.rendererManager.renderer);
    // this.bloomOutlinePass = new BloomOutlinePass(this.scene, this.cameraManager.camera, this.rendererManager.renderer);

    this.rendererManager.renderer.setAnimationLoop(this.animationLoop.bind(this));
    this.container.addEventListener('click', this.onClick.bind(this), false);
  }

  animationLoop() {
    const deltaTime = this.clock.getDelta();
    if (this.statsManager) this.statsManager.begin();
    this.controlManager.updateControls();
    this.animationManager.update(deltaTime);
    this.cameraManager.update(deltaTime);
    this.render();
    // this.bloomOutputPass.composer.render();
    // this.bloomOutlinePass.composer.render();
    if (this.statsManager) this.statsManager.end();
  }

  render() {
    this.postProcessingManager.render();
  }

  validateFields(options, fields) {
    return fields.every(field => options.hasOwnProperty(field));
  }

  loadModelCenter({ path, onLoad, onProgress, onError }) {
    this.modelManager.loadModel({
      path,
      onLoad: (model) => {
        this.cameraManager.adjustCameraPosition(model.scene || model);
        if (onLoad) onLoad(model);
      },
      onProgress,
      onError
    });
  }

  loadModel({ path, onLoad, onProgress, onError }) {
    this.modelManager.loadModel({
      path,
      onLoad: (model) => {
        if (onLoad) onLoad(model);
      },
      onProgress,
      onError
    });
  }

  loadEnvironmentMap(urls, onLoad, onError) {
    this.textureManager.loadEnvironmentMap(urls, onLoad, onError);
  }

  loadTextureMap(url, onLoad, onError) {
    this.textureManager.loadTextureMap(url, onLoad, onError);
  }

  loadNormalMap(url, onLoad, onError) {
    this.textureManager.loadNormalMap(url, onLoad, onError);
  }

  loadMetalnessMap(url, onLoad, onError) {
    this.textureManager.loadMetalnessMap(url, onLoad, onError);
  }

  loadRoughnessMap(url, onLoad, onError) {
    this.textureManager.loadRoughnessMap(url, onLoad, onError);
  }

  addLight(light) {
    this.lightManager.addLight(light);
  }

  removeLight(light) {
    this.lightManager.removeLight(light);
  }

  addAnimation(animation) {
    this.animationManager.addAnimation(animation);
  }

  removeAnimation(animation) {
    this.animationManager.removeAnimation(animation);
  }

  getScene() {
    return this.scene;
  }

  exportSceneAsImage() {
    const imgData = this.rendererManager.renderer.domElement.toDataURL("image/png");
    const a = document.createElement('a');
    a.href = imgData;
    a.download = 'scene.png';
    a.click();
  }

  exportModel(object, format = 'glb') {
    // Add export logic here (e.g., using GLTFExporter)
  }

  addAxesHelper(size = 5) {
    return this.helperManager.addAxesHelper(size);
  }

  removeAxesHelper() {
    this.helperManager.removeAxesHelper();
  }

  addGridHelper(size = 10, divisions = 10) {
    return this.helperManager.addGridHelper(size, divisions);
  }

  removeGridHelper() {
    this.helperManager.removeGridHelper();
  }

  addLightHelper(light) {
    return this.helperManager.addLightHelper(light);
  }

  removeLightHelper() {
    this.helperManager.removeLightHelper();
  }

  getAllLights() {
    return this.lightManager.getAllLights();
  }

  alongPath(object, curve, duration) {
    return this.animationManager.alongPath(object, curve, duration);
  }

  playAnimation(model, animationName) {
    this.animationManager.playAnimation(model, animationName);
  }

  addModelAnimations(model, animations) {
    this.animationManager.addModelAnimations(model, animations);
  }

  onClick(event) {
    event.preventDefault();

    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.cameraManager.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;
      console.log('Selected object:', selectedObject);
      // 可以在此处添加代码，以选中对象或进行其他处理

      console.log('this.bloomOutlinePass', this.bloomOutlinePass);
      console.log('selectedObject', selectedObject);

      this.cameraManager.moveCameraToMesh(selectedObject);

      // this.bloomOutlinePass.outlinePass.selectedObjects = [selectedObject];
    }
  }
}
