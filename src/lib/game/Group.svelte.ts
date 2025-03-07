import { uniqueId } from "lui-g";

export default class GroupSvelte {

  readonly group: number;
  ttl: number = $state(0);
  private interval: NodeJS.Timer | number = 0;

  constructor(
    readonly centerX: number,
    readonly centerY: number,
    readonly weight: number,
    ttl = 4
  ) {
    this.group = parseInt(uniqueId(''));
    this.ttl = ttl;
  }

  /**
   * Not very efficient as we display only whole seconds over 5 seconds. However there won't be soooo many groups.
   * Using a common timer source would be efficient but then all timers would jump at the same time on the screen
   * Using a second based timer and switching it to decimal seconds at 5sec would ease the excess timers
   * ALSO it might or might not be the best idea to put this here to always run automatically, might refactor later
   */
  startTimer() {
    this.interval = setInterval(() => {
      this.ttl -= 0.1;
      if (this.ttl <= 0) {
        this.ttl = 0;
        clearInterval(this.interval as unknown as number);
      }
    }, 100);
  }

  stopTimer() {
    clearInterval(this.interval as unknown as number);
  }

}
