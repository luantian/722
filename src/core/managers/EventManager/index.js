export class EventManager {
  constructor(cameraManager, rendererManager, container) {
    this.cameraManager = cameraManager;
    this.rendererManager = rendererManager;
    this.container = container;
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  // 绑定 窗口 resize 事件
  onWindowResize() {
    const { width, height } = this.container.getBoundingClientRect();
    const newWidth = width || window.innerWidth;
    const newHeight = height || window.innerHeight;

    this.cameraManager.updateAspectRatio(newWidth / newHeight);
    this.rendererManager.resizeRenderer(newWidth, newHeight);

  }

  // 移除 窗口 resize 事件
  removeEventListeners() {
    window.removeEventListener('resize', this.onWindowResize.bind(this), false);
  }
}
