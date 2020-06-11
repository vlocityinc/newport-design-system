// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS } from './debugEditorPopoverFooterLabels';
import { hidePopover } from 'builder_platform_interaction/builderUtils';
export default class DebugEditorPopoverFooter extends LightningElement {
    @api
    handleRunDebug;

    labels = LABELS;

    handleRunDebug = () => {
        // TODO: send out request.
    };

    handleCancel() {
        hidePopover();
    }
}
