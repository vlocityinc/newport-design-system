import { BaseCommand } from './baseCommand';
import zoomToFitCommandLabel from '@salesforce/label/FlowBuilderKeyboardInteractionLabels.zoomToFitCommandLabel';
export class ZoomToFitCommand extends BaseCommand {
  /**
   * Command to zoom-to-fit the canvas
   */
  constructor(callback) {
    super(callback,
      'zoomtofit',
      zoomToFitCommandLabel,
      false);
  }
}