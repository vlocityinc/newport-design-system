// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS } from './debugEditorPopoverFooterLabels';

export default class DebugEditorPopoverFooter extends LightningElement {
    @api
    handleRunDebug;

    labels = LABELS;

    handleRunDebug = () => {
        // TODO: send out request.
    };
}
