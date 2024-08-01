import * as THREE from 'three';

export class RendererManager {
  constructor(container) {
    const { width, height } = container.getBoundingClientRect();
    // 创建 WebGL 渲染器
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 可选：THREE.BasicShadowMap, THREE.PCFShadowMap, THREE.PCFSoftShadowMap
    container.appendChild(this.renderer.domElement);
  }

  /**
   * 调整渲染器大小
   * @param {number} width - 新宽度
   * @param {number} height - 新高度
   */
  resizeRenderer(width, height) {
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }
}
