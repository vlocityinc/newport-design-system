export class DeleteNodesCommand {
  id = 'deletenodes';
  label = 'Delete Nodes';
  disabled = false;

  /**
   * Command to delete nodes in the canvas
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