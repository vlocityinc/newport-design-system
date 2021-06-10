import { LightningElement, api, track } from 'lwc';
import { Store } from 'builder_platform_interaction/storeLib';
import { getVariableOrField } from 'builder_platform_interaction/referenceToVariableUtil';
import { format } from 'builder_platform_interaction/commonUtils';
import { MapElement } from 'builder_platform_interaction/mapEditorLib';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { mapReducer } from './mapReducer';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { LABELS } from './mapEditorLabels';
import { UpdateCollectionProcessorEvent } from 'builder_platform_interaction/events';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';

export default class MapEditor extends LightningElement {
    labels = LABELS;
    @track mapElement: MapElement = {
        collectionReference: { value: null, error: null },
        assignmentItems: []
    };

    @track
    inputObjectType;

    // in 234, the output object type is always 'Recommendation'
    @track
    outputObjectType = 'Recommendation';

    @track
    helpText;

    @track
    outputHelpText = this.labels.selectCollection;

    @api
    get elementInfo() {
        return this.mapElement;
    }

    set elementInfo(value) {
        if (value) {
            this.mapElement = value;
        }
        if (this.mapElement.collectionReference && this.mapElement.collectionReference.value) {
            const collectionVariable = getVariableOrField(
                this.mapElement.collectionReference.value,
                Store.getStore().getCurrentState().elements
            );
            if (collectionVariable && collectionVariable.dataType === FLOW_DATA_TYPE.SOBJECT.value) {
                this.inputObjectType = collectionVariable.subtype;
                this.updateHelpText();
            }
        }
    }

    /**
     * Validate the map editor. This method will be called in the upper editor
     *
     * @returns {Object[]} List of errors
     */
    @api
    validate() {
        const event = {
            type: VALIDATE_ALL
        };
        this.mapElement = mapReducer(this.mapElement, event);
        return getErrorsFromHydratedElement(this.mapElement);
    }

    /**
     * Update help text when input object type changed
     *
     */
    updateHelpText() {
        if (this.inputObjectType) {
            if (this.inputObjectType === this.outputObjectType) {
                this.helpText = format(this.labels.updateCollection, this.outputObjectType);
                this.outputHelpText = this.labels.addFields;
            } else {
                this.helpText = format(this.labels.newCollection, this.outputObjectType);
                this.outputHelpText = this.labels.selectCollection;
            }
        }
    }

    /**
     * Update input object type
     *
     * @param collectionValue  the selected input collection
     */
    updateInputObjectType(collectionValue: string | null) {
        if (collectionValue) {
            const collectionVariable = getVariableOrField(collectionValue, Store.getStore().getCurrentState().elements);
            if (collectionVariable) {
                const newInputObjectType = collectionVariable.subtype;
                if (this.inputObjectType !== newInputObjectType) {
                    this.inputObjectType = newInputObjectType;
                    this.updateHelpText();
                }
            }
        }
    }

    /**
     * Handle input collection changed event
     *
     * @param event  changed event
     */
    handleCollectionVariablePropertyChanged(event: CustomEvent) {
        event.stopPropagation();
        this.mapElement = mapReducer(this.mapElement, event);
        if (this.mapElement.collectionReference.value && !this.mapElement.collectionReference.error) {
            this.updateInputObjectType(this.mapElement.collectionReference.value);
        }
        // dispatch event to the parent editor
        this.dispatchEvent(new UpdateCollectionProcessorEvent(this.mapElement));
    }
}
