import * as THREE from 'three';


import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export class BloomOutputPass {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.composer = null;
    this.init();
  }

  init() {
    const renderScene = new RenderPass(this.scene, this.camera);
    const params = {
      threshold: 0.3,
      strength: 1,
      radius: 0,
      exposure: 1
    };

    /**
     * threshold (阈值):
      作用: 这个参数控制哪些亮度的像素会产生泛光效果。只有亮度超过这个阈值的像素才会被认为是亮点，并且会产生泛光效果。
      范围: 通常在 0.0 到 1.0 之间。
      示例: 值为 0.0 表示所有像素都会产生泛光效果；值为 1.0 表示只有最亮的像素才会产生泛光效果。

      strength (强度):
      作用: 控制泛光效果的强度。这个参数决定了泛光的亮度或影响力。
      范围: 可以是任意正数。较高的值会使泛光效果更强烈。
      示例: 值为 1.0 表示标准强度；值为 2.0 表示效果更强烈，泛光更明显。

      radius (半径):
      作用: 控制泛光效果的扩散范围。这个参数决定了泛光的模糊程度或范围。
      范围: 可以是任意正数。较高的值会使泛光效果更柔和和扩散得更广。
      示例: 值为 0.0 表示没有扩散效果；值为 1.0 表示标准扩散范围。

      exposure (曝光度):
      作用: 控制整个场景的亮度。这个参数调整场景的整体曝光度，使其更亮或更暗。
      范围: 可以是任意正数。较高的值会增加整个场景的亮度。
      示例: 值为 1.0 表示标准曝光度；值为 2.0 表示曝光度增加一倍，使场景变得更亮。
     */
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.strength;
    bloomPass.radius = params.radius;

    const outputPass = new OutputPass();

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);
    this.composer.addPass(outputPass);
  }

}
