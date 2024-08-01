import * as THREE from 'three';
import { gsap } from 'gsap';

export class CameraManager {
  constructor(container) {
    const { width, height } = container.getBoundingClientRect();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    this.camera.position.z = 5;
    this.targetPosition = new THREE.Vector3();
    this.isAnimating = false;

    // 保存相机初始状态
    this.initialPosition = this.camera.position.clone();
    this.initialLookAt = new THREE.Vector3(0, 0, 0);
  }

  /**
   * 调整相机位置以适应对象
   * @param {THREE.Object3D} object - 需要适应的对象
   * @param {Function} [onComplete] - 调整完成后的回调函数
   */
  adjustCameraPosition(object, onComplete) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = size.length();
    const fov = this.camera.fov * (Math.PI / 180);
    let cameraZ = maxDim / (2 * Math.tan(fov / 2));

    const paddingFactor = 1.2;
    cameraZ *= paddingFactor;

    const flatnessThreshold = 0.1;
    if (size.y < Math.min(size.x, size.z) * flatnessThreshold) {
      this.targetPosition.set(center.x, center.y + cameraZ * 0.5, cameraZ);
    } else {
      this.targetPosition.set(center.x, center.y, cameraZ);
    }

    gsap.to(this.camera.position, {
      x: this.targetPosition.x,
      y: this.targetPosition.y,
      z: this.targetPosition.z,
      duration: 2,
      onUpdate: () => {
        this.camera.lookAt(center);
      },
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });
  }

  /**
   * 更新相机位置动画
   * @param {number} deltaTime - 自上次更新以来的时间间隔
   */
  update(deltaTime) {
    if (this.isAnimating) {
      this.camera.position.lerp(this.targetPosition, deltaTime * 2);
      if (this.camera.position.distanceTo(this.targetPosition) < 0.01) {
        this.camera.position.copy(this.targetPosition);
        this.isAnimating = false;
      }
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
  }

  /**
   * 更新相机的宽高比
   * @param {number} aspectRatio - 宽高比
   */
  updateAspectRatio(aspectRatio) {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  }

  moveCameraToMesh(mesh) {
    // 计算目标位置和方向
    const boundingBox = new THREE.Box3().setFromObject(mesh);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());
    const distance = Math.max(size.x, size.y, size.z) * 1.2; // 可调整这个系数来控制距离

    const offset = new THREE.Vector3(0, distance, distance);
    const targetPosition = center.clone().add(offset);
    const targetLookAt = center.clone();

    // 使用 GSAP 来平滑移动摄像机
    gsap.to(this.camera.position, {
        duration: 2, // 2秒移动时间
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        onUpdate: () => {
          this.camera.lookAt(targetLookAt);
        },
        ease: "power2.out"
    });
  }

  /**
   * 设置相机路径动画
   * @param {Array} path - 路径点数组，每个点包含 position 和 lookAt 属性
   * @param {number} duration - 动画持续时间
   * @param {Function} [onComplete] - 动画完成回调
   */
  animateAlongPath(path, duration, onComplete) {
    // 保存初始状态
    const initialPosition = this.camera.position.clone();
    const initialLookAt = new THREE.Vector3();
    this.camera.getWorldDirection(initialLookAt);

    const timeline = gsap.timeline({
      onComplete: () => {
        // 平滑恢复初始状态
        gsap.to(this.camera.position, {
          x: initialPosition.x,
          y: initialPosition.y,
          z: initialPosition.z,
          duration: 2, // 恢复动画的持续时间，可以根据需要调整
          onUpdate: () => {
            this.camera.lookAt(initialLookAt);
          },
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });
      }
    });

    path.forEach((point, index) => {
      const { position, lookAt } = point;
      timeline.to(this.camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: duration / path.length,
        onUpdate: () => {
          this.camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
        },
      });
    });
  }
}
