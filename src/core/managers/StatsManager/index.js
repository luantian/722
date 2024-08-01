import Stats from 'stats.js';

export class StatsManager {
  constructor(container) {
    this.stats = new Stats();
    this.stats.showPanel(0);
    container.appendChild(this.stats.dom);
  }

  /**
   * 开始统计
   */
  begin() {
    this.stats.begin();
  }

  /**
   * 结束统计
   */
  end() {
    this.stats.end();
  }
}
