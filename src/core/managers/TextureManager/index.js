import * as THREE from 'three';

export class TextureManager {
  constructor(scene) {
    this.scene = scene;
    this.textures = {};
  }

  /**
   * 加载和应用环境贴图
   * @param {string[]} urls - 包含环境贴图的六个面的 URL
   * @param {Function} [onLoad] - 加载完成回调
   * @param {Function} [onError] - 加载错误回调
   */
  loadEnvironmentMap(urls, onLoad, onError) {
    const loader = new THREE.CubeTextureLoader();

    loader.load(
      urls,
      (texture) => {
        this.textures.environmentMap = texture;
        this.scene.background = texture;
        this.scene.environment = texture;
        if (onLoad) onLoad(texture);
      },
      undefined,
      (error) => {
        console.error('环境贴图加载错误', error);
        if (onError) onError(error);
      }
    );
  }

  /**
   * 加载纹理贴图
   * @param {string} url - 纹理贴图的 URL
   * @param {Function} [onLoad] - 加载完成回调
   * @param {Function} [onError] - 加载错误回调
   */
  loadTextureMap(url, onLoad, onError) {
    const loader = new THREE.TextureLoader();

    loader.load(
      url,
      (texture) => {
        this.textures.textureMap = texture;
        if (onLoad) onLoad(texture);
      },
      undefined,
      (error) => {
        console.error('纹理贴图加载错误', error);
        if (onError) onError(error);
      }
    );
  }

  /**
   * 加载法线贴图
   * @param {string} url - 法线贴图的 URL
   * @param {Function} [onLoad] - 加载完成回调
   * @param {Function} [onError] - 加载错误回调
   */
  loadNormalMap(url, onLoad, onError) {
    const loader = new THREE.TextureLoader();

    loader.load(
      url,
      (texture) => {
        this.textures.normalMap = texture;
        if (onLoad) onLoad(texture);
      },
      undefined,
      (error) => {
        console.error('法线贴图加载错误', error);
        if (onError) onError(error);
      }
    );
  }

  /**
   * 加载金属度贴图
   * @param {string} url - 金属度贴图的 URL
   * @param {Function} [onLoad] - 加载完成回调
   * @param {Function} [onError] - 加载错误回调
   */
  loadMetalnessMap(url, onLoad, onError) {
    const loader = new THREE.TextureLoader();

    loader.load(
      url,
      (texture) => {
        this.textures.metalnessMap = texture;
        if (onLoad) onLoad(texture);
      },
      undefined,
      (error) => {
        console.error('金属度贴图加载错误', error);
        if (onError) onError(error);
      }
    );
  }

  /**
   * 加载粗糙度贴图
   * @param {string} url - 粗糙度贴图的 URL
   * @param {Function} [onLoad] - 加载完成回调
   * @param {Function} [onError] - 加载错误回回调
   */
  loadRoughnessMap(url, onLoad, onError) {
    const loader = new THREE.TextureLoader();

    loader.load(
      url,
      (texture) => {
        this.textures.roughnessMap = texture;
        if (onLoad) onLoad(texture);
      },
      undefined,
      (error) => {
        console.error('粗糙度贴图加载错误', error);
        if (onError) onError(error);
      }
    );
  }

  /**
   * 获取加载的贴图
   * @param {string} type - 贴图类型（例如 'environmentMap', 'textureMap', 'normalMap', 'metalnessMap', 'roughnessMap'）
   * @returns {THREE.Texture|null} 加载的贴图
   */
  getTexture(type) {
    return this.textures[type] || null;
  }

  /**
   * 移除贴图
   * @param {string} type - 贴图类型
   */
  removeTexture(type) {
    if (this.textures[type]) {
      delete this.textures[type];
    }
  }

  /**
   * 清除所有加载的贴图
   */
  clearAllTextures() {
    this.textures = {};
  }
}
