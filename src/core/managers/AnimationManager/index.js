import * as THREE from 'three';
import gsap from 'gsap';

export class AnimationManager {
  constructor() {
    this.animations = [];
    this.mixers = new Map(); // 用于存储模型的 AnimationMixer
  }

  /**
   * 添加动画
   * @param {Function} animation - 动画更新函数
   */
  addAnimation(animation) {
    this.animations.push(animation);
  }

  /**
   * 移除动画
   * @param {Function} animation - 动画更新函数
   */
  removeAnimation(animation) {
    this.animations = this.animations.filter(anim => anim !== animation);
  }

  /**
   * 更新所有动画
   * @param {number} deltaTime - 自上次更新以来的时间间隔
   */
  update(deltaTime) {
    this.animations.forEach(animation => animation(deltaTime));
    this.mixers.forEach(({ mixer }) => mixer.update(deltaTime));
  }

  /**
   * 路径动画
   * @param {THREE.Object3D} object3D - 要运动的物体
   * @param {THREE.Curve} curve - 路径曲线
   * @param {number} duration - 动画运行时长
   */
  alongPath(object3D, curve, duration) {
    const path = { t: 0 };
    gsap.to(path, {
      t: 1,
      duration: duration,
      repeat: -1,
      ease: "none",
      onUpdate: () => {
        const position = curve.getPointAt(path.t);
        object3D.position.copy(position);
      }
    });
  }

  /**
   * 添加模型动画
   * @param {THREE.Object3D} model - 含有动画的3D模型
   * @param {Array<THREE.AnimationClip>} animations - 模型中的动画剪辑
   */
  addModelAnimations(model, animations) {
    if (!model || !animations || animations.length === 0) {
      console.error('Invalid model or animations');
      return;
    }

    const mixer = new THREE.AnimationMixer(model);
    this.mixers.set(model, { mixer, animations });

    console.log('Animations added:', animations.map(a => a.name));
  }

  /**
   * 播放模型动画
   * @param {THREE.Object3D} model - 含有动画的3D模型
   * @param {string} animationName - 动画剪辑的名称
   */
  playAnimation(model, animationName) {
    const data = this.mixers.get(model);
    if (data) {
      const { mixer, animations } = data;
      const clip = animations.find(clip => clip.name === animationName);
      if (clip) {
        const action = mixer.clipAction(clip);
        action.reset().play();
        console.log(`Playing animation: ${animationName}`);
      } else {
        console.error(`Animation clip '${animationName}' not found`);
      }
    } else {
      console.error('Mixer not found for the model');
    }
  }

  /**
   * 暂停模型动画
   * @param {THREE.Object3D} model - 含有动画的3D模型
   * @param {string} animationName - 动画剪辑的名称
   */
  pauseAnimation(model, animationName) {
    const data = this.mixers.get(model);
    if (data) {
      const { mixer, animations } = data;
      const clip = animations.find(clip => clip.name === animationName);
      if (clip) {
        const action = mixer.clipAction(clip);
        action.paused = true;
      } else {
        console.error(`Animation clip '${animationName}' not found`);
      }
    } else {
      console.error('Mixer not found for the model');
    }
  }

  /**
   * 停止模型动画
   * @param {THREE.Object3D} model - 含有动画的3D模型
   * @param {string} animationName - 动画剪辑的名称
   */
  stopAnimation(model, animationName) {
    const data = this.mixers.get(model);
    if (data) {
      const { mixer, animations } = data;
      const clip = animations.find(clip => clip.name === animationName);
      if (clip) {
        const action = mixer.clipAction(clip);
        action.stop();
      } else {
        console.error(`Animation clip '${animationName}' not found`);
      }
    } else {
      console.error('Mixer not found for the model');
    }
  }

  /**
   * 设置动画速度
   * @param {THREE.Object3D} model - 含有动画的3D模型
   * @param {string} animationName - 动画剪辑的名称
   * @param {number} speed - 动画速度
   */
  setAnimationSpeed(model, animationName, speed) {
    const data = this.mixers.get(model);
    if (data) {
      const { mixer, animations } = data;
      const clip = animations.find(clip => clip.name === animationName);
      if (clip) {
        const action = mixer.clipAction(clip);
        action.timeScale = speed;
      } else {
        console.error(`Animation clip '${animationName}' not found`);
      }
    } else {
      console.error('Mixer not found for the model');
    }
  }

  /**
   * 移除模型动画
   * @param {THREE.Object3D} model - 含有动画的3D模型
   */
  removeModelAnimations(model) {
    const data = this.mixers.get(model);
    if (data) {
      const { mixer } = data;
      mixer.stopAllAction();
      this.mixers.delete(model);
    } else {
      console.error('Mixer not found for the model');
    }
  }

  

}
