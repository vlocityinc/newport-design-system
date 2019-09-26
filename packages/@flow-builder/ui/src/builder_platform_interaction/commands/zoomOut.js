export class ZoomOutCommand {
  id = 'zoomout';
  label = 'Zoom Out';
  disabled = false;

  /**
   * Command to zoom out the canvas
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