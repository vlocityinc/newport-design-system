import { BaseCommand } from './baseCommand';
import zoomInCommandLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.zoomInCommandLabel';
export class ZoomInCommand extends BaseCommand {
  /**
   * Command to zoom in the canvas
   */
  constructor(callback) {
    super(callback,
      'zoomin',
      zoomInCommandLabel,
      false);
  }
}