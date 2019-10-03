import { BaseCommand } from './baseCommand';
import zoomOutCommandLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.zoomOutCommandLabel';
export class ZoomOutCommand extends BaseCommand {
  /**
   * Command to zoom out the canvas
   */
  constructor(callback) {
    super(callback,
      'zoomout',
      zoomOutCommandLabel,
      false);
  }
}