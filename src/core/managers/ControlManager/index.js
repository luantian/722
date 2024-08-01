import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class ControlManager {
  constructor(camera, renderer) {
    // 创建轨道控制器
    this.controls = new OrbitControls(camera, renderer.domElement);
  }

  /**
   * 更新控制器
   */
  updateControls() {
    this.controls.update();
  }
}
