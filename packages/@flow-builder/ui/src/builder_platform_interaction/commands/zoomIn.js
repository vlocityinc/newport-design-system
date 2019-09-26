export class ZoomInCommand {
  id = 'zoomin';
  label = 'Zoom In';
  disabled = false;

  /**
   * Command to zoom in the canvas
   */
  constructor(callback) {
    this.callback = callback;
  }

  async execute(event) {
    if (this.callback) {
      this.callback(event);
    }
  }
}