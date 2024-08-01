<template>
  <div class="test" ref="ContainerRef"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { ThreeBase } from "@/core/ThreeBase";
import * as THREE from "three";

const ContainerRef = ref(null);

onMounted(() => {
  const container = ContainerRef.value;
  const threeBase = new ThreeBase({
    container,
    // backgroundColor: "#ffffff",
    // fogColor: "#cccccc",
    enableStats: true,
  });

  // 加载模型
  threeBase.loadModelCenter({
    path: "3工厂.glb",
    onLoad: (model) => {
      threeBase.addAxesHelper(800);
      const lights = threeBase.getAllLights();
      console.log("lights", lights);

      model.scene.traverse(function (node) {
        if (node.isMesh) {
          // node.castShadow = true; // 所有网格投射阴影
          // node.receiveShadow = true; // 所有网格接收阴影
        }
      });

      lights.forEach((element) => {
        threeBase.addLightHelper(element);
      });


      // 创建一个立方体, 路径动画
      // const geometry = new THREE.BoxGeometry();
      // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      // const cube = new THREE.Mesh(geometry, material);
      // cube.castShadow = true; // 所有网格投射阴影
      // cube.receiveShadow = true; // 所有网格接收阴影
      // threeBase.getScene().add(cube);
      // const curve = new THREE.CatmullRomCurve3([
      //   new THREE.Vector3(-10, 0, 10),
      //   new THREE.Vector3(-5, 5, 5),
      //   new THREE.Vector3(0, 0, 0),
      //   new THREE.Vector3(5, -5, 5),
      //   new THREE.Vector3(10, 0, 10),
      //   new THREE.Vector3(-10, 0, 10),
      // ]);

      // threeBase.alongPath(cube, curve, 5);
    },
  });
  threeBase.loadModel({
    path: "RobotExpressive.glb",
    onLoad: (model) => {
      console.log("model", model);
      const gltf = model.scene;
      const animations = model.animations;
      console.log("animations", animations);
      // 添加模型和动画到 AnimationManager
      threeBase.addModelAnimations(gltf, animations);
      gltf.position.set(150, -13.6, 0);

      // 播放特定动画
      threeBase.playAnimation(gltf, "Walking");
      // threeBase.playAnimation(gltf, animations[0].name)

      // 设置动画速度
      // animationManager.setAnimationSpeed(model, "AnimationName", 2);
    },
  });
});
</script>

<style scoped>
.test {
  width: 100vw;
  height: 100vh;
}
</style>
