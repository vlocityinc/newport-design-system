import { SORTABLE_FILTER } from 'builder_platform_interaction/collectionProcessorLib';
import { LightningElement, api, track } from 'lwc';
import { LABELS } from './filterEditorLabels';

export default class FilterEditor extends LightningElement {
    @track filterElement = {
        collectionReference: { value: null, error: null },
        filterConditions: [],
        filterText: null,
        formulaExpression: null
    };

    @api
    get elementInfo() {
        return this.filterElement;
    }

    set elementInfo(element) {
        if (element) {
            this.filterElement = element;
        }
        // placeholder
        // will update collectionVariable value later
        this._collectionVariable = null;
    }

    get conditions() {
        return this.filterElement.filterConditions;
    }

    get conditionLogic() {
        return this.filterElement.filterText;
    }

    get formulaExpression() {
        return this.filterElement.formulaExpression;
    }

    get labels() {
        return LABELS;
    }

    // input collection filter is the same as in sort editor: sObject, primitive, and apex type
    get collectionProcessorFilter() {
        return SORTABLE_FILTER;
    }

    handleCollectionVariablePropertyChanged(event: CustomEvent) {
        event.stopPropagation();
    }
}
