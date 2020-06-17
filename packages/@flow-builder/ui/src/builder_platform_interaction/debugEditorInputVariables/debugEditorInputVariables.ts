import { LightningElement, api } from 'lwc';
import { getDataTypeIcons } from 'builder_platform_interaction/dataTypeLib';

export default class debugEditorInputVariables extends LightningElement {
    @api variable;

    @api inputValue;

    icon;

    inputEvent(event) {
        this.inputValue = event.target.value;
        const temp = {
            name: this.variable.name,
            value: event.target.value,
            type: this.variable.dataType
        };
        const evt = new CustomEvent('inputevent', {
            detail: temp
        });
        this.dispatchEvent(evt);
    }

    connectedCallback() {
        this.icon = getDataTypeIcons(this.variable.dataType, 'utility');
    }
}
