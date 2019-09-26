export class ZoomToFitCommand {
  id = 'zoomtofit';
  label = 'Zoom To Fit';
  disabled = false;

  /**
   * Command to zoom-to-fit the canvas
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