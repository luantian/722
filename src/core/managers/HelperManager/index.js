import * as THREE from 'three';

export class HelperManager {
  constructor(scene) {
    this.scene = scene;
    this.helpers = {};
  }

  /**
   * 添加坐标轴辅助
   * @param {number} [size=5] - 坐标轴的大小
   * @returns {THREE.AxesHelper} 坐标轴辅助
   */
  addAxesHelper(size = 5) {
    const axesHelper = new THREE.AxesHelper(size);
    this.scene.add(axesHelper);
    this.helpers.axesHelper = axesHelper;
    return axesHelper;
  }

  /**
   * 移除坐标轴辅助
   */
  removeAxesHelper() {
    if (this.helpers.axesHelper) {
      this.scene.remove(this.helpers.axesHelper);
      delete this.helpers.axesHelper;
    }
  }

  /**
   * 添加网格辅助
   * @param {number} [size=10] - 网格的大小
   * @param {number} [divisions=10] - 网格的分割数
   * @returns {THREE.GridHelper} 网格辅助
   */
  addGridHelper(size = 10, divisions = 10) {
    const gridHelper = new THREE.GridHelper(size, divisions);
    this.scene.add(gridHelper);
    this.helpers.gridHelper = gridHelper;
    return gridHelper;
  }

  /**
   * 移除网格辅助
   */
  removeGridHelper() {
    if (this.helpers.gridHelper) {
      this.scene.remove(this.helpers.gridHelper);
      delete this.helpers.gridHelper;
    }
  }

  /**
   * 添加光源辅助
   * @param {THREE.Light} light - 需要添加辅助的光源
   * @returns {THREE.CameraHelper} 光源辅助
   */

  addLightHelper(light) {
    let helper;
    if (light.isDirectionalLight) {
      helper = new THREE.DirectionalLightHelper(light, 150);
    } else if (light.isSpotLight) {
      helper = new THREE.SpotLightHelper(light);
    } else if (light.isPointLight) {
      helper = new THREE.PointLightHelper(light, 1);
    } else if (light.isHemisphereLight) {
      helper = new THREE.HemisphereLightHelper(light, 5);
    } else if (light.isRectAreaLight) {
      helper = new RectAreaLightHelper(light);
    }

    if (helper) {
      console.log('helper', helper);
      this.scene.add(helper);
    } else {
      console.warn('不存在相应光源辅助器', light);
    }
  }

  addHelpersForAllLights() {
    const lights = this.getAllLights();
    lights.forEach((light) => this.addLightHelper(light));
  }

  /**
   * 移除光源辅助
   */
  removeLightHelper() {
    if (this.helpers.lightHelper) {
      this.scene.remove(this.helpers.lightHelper);
      delete this.helpers.lightHelper;
    }
  }
}
