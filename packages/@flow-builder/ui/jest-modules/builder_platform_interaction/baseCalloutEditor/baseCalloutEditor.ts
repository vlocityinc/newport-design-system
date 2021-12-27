// @ts-nocheck
import { api, LightningElement } from 'lwc';

export default class BaseCalloutEditor extends LightningElement {
    @api labelDescriptionConfig;
    @api subtitle;
    @api
    editorParams;
    @api parameterListConfig;
    @api elementType;
    @api displaySpinner;
    @api runinmode;
    @api displayOutputParams;
}
