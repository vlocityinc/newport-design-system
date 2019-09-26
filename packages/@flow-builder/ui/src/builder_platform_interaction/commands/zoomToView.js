export class ZoomToViewCommand {
  id = 'zoomtoview';
  label = 'Zoom To View';
  disabled = false;

  /**
   * Command to zoom-to-view the canvas
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