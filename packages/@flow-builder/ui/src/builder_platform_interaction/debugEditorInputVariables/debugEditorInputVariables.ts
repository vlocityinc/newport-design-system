import { LightningElement, api } from 'lwc';
import { getDataTypeIcons } from 'builder_platform_interaction/dataTypeLib';

export default class debugEditorInputVariables extends LightningElement {
    @api variable;

    @api inputValue;

    icon;
    isBoolean;

    inputEvent(event) {
        if (event.target.value) {
            this.inputValue = event.target.value;
        } else if (event.detail.checked != null) {
            this.inputValue = event.detail.checked;
        }
        const temp = {
            name: this.variable.name,
            value: this.inputValue,
            type: this.variable.dataType
        };
        const evt = new CustomEvent('inputevent', {
            detail: temp
        });
        this.dispatchEvent(evt);
    }

    connectedCallback() {
        if (this.variable.dataType === 'Boolean') {
            this.isBoolean = true;
        }
        this.icon = getDataTypeIcons(this.variable.dataType, 'utility');
    }
}
