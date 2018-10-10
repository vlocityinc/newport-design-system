import { api, LightningElement } from 'lwc';

export default class FieldPicker extends LightningElement {
@api label;

@api placeholder;

@api value;

@api errorMessage;

@api fields;

@api required;

@api disabled;
}
