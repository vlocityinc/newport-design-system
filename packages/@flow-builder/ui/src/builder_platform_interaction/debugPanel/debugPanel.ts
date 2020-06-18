import { LightningElement, api } from 'lwc';

export default class DebugPanel extends LightningElement {
    @api debugTraces;

    headerTitle = 'Debug Inspector';
}
