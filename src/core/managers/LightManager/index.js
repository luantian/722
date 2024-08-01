import * as THREE from 'three';

export class LightManager {
  constructor(scene) {
    this.scene = scene;
    this.initLights();
  }

  /**
   * 初始化场景光源
   */
  initLights() {
    const light = new THREE.AmbientLight(0xffffff, 0.3);
    this.addLight(light);
    const directionalLight = this.createDirectionalLight();
    this.addLight(directionalLight);
    const spotLight = this.createSpotLight();
    this.addLight(spotLight);
  }

  createDirectionalLight() {
    const light = new THREE.DirectionalLight(0xffddaa, 1);
    light.position.set(0, 500, 500)
    // light.castShadow = true; // 启用光源的阴影

    // 设置光源的阴影属性
    // light.shadow.mapSize.width = 2048;
    // light.shadow.mapSize.height = 2048;

    // light.shadow.camera.near = 0.1;
    // light.shadow.camera.far = 1000;

    // light.shadow.camera.left = -200;
    // light.shadow.camera.right = 200;
    // light.shadow.camera.top = 200;
    // light.shadow.camera.bottom = -200;

    // 动态调整阴影摄像机的视锥体范围
    // const boundingBox = new THREE.Box3().setFromObject(this.scene); // 获取场景的边界盒
    // const size = boundingBox.getSize(new THREE.Vector3());
    // const center = boundingBox.getCenter(new THREE.Vector3());

    // console.log('center.x - size.x / 2', center.x - size.x / 2);

    // light.shadow.camera.left = center.x - size.x / 2;
    // light.shadow.camera.right = center.x + size.x / 2;
    // light.shadow.camera.top = center.y + size.y / 2;
    // light.shadow.camera.bottom = center.y - size.y / 2;
    return light;
  }

  createSpotLight() {
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 500, 0);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.1; // 设置聚光灯边缘的柔和度。较高的值使光锥边缘更加柔和和渐变
    spotLight.decay = 0; // 值越大，光源强度衰减越快
    spotLight.distance = 800; // 设置光源的最大照射距离。在这个距离之外，光源强度为零。
    // spotLight.castShadow = true;
    return spotLight;
  }

  /**
   * 添加光源
   * @param {THREE.Light} light - 需要添加的光源
   */
  addLight(light) {
    this.scene.add(light);
  }

  /**
   * 移除光源
   * @param {THREE.Light} light - 需要移除的光源
   */
  removeLight(light) {
    this.scene.remove(light);
  }

  getAllLights() {
    const lights = [];
    this.scene.traverse((object) => {
      if (object.isLight) {
        lights.push(object);
      }
    });
    return lights;
  }

}
