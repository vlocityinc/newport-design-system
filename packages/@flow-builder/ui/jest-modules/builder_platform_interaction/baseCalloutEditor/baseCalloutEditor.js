import { LightningElement, api } from 'lwc';

export default class BaseCalloutEditor extends LightningElement {
    @api labelDescriptionConfig;
    @api subtitle;
    @api parameterListConfig;
    @api elementType;
    @api displaySpinner;
}