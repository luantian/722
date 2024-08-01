import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';

export class BloomOutlinePass {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.composer = null;
    this.outlinePass = null;
    this.init();
  }

  init() {
    // 初始化效果合成器和 passes
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    this.outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera);
    this.composer.addPass(this.outlinePass);

    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    this.composer.addPass(effectFXAA);

    // 设置 OutlinePass 参数
    this.outlinePass.edgeStrength = 5.0; // 边缘强度
    this.outlinePass.edgeGlow = 0.2; // 边缘光晕效果
    this.outlinePass.edgeThickness = 0.5; // 边缘的宽度
    this.outlinePass.pulsePeriod = 0; // 边缘脉冲动效duration
    this.outlinePass.visibleEdgeColor.set('#ffff00');
    this.outlinePass.hiddenEdgeColor.set('#ffff00');

  }

}
