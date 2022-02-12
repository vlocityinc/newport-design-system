import { ConfigurationEditorChangeEvent } from 'builder_platform_interaction/events';
import { RECOMMENDATION_STRATEGY } from 'builder_platform_interaction/flowMetadata';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './limitRepetitionsLabels';
import { ELEMENT_PROPS, LimitRepetitionsInput } from './limitRepetitionsLib';

export default class LimitRepetitions extends LightningElement {
    supportedObjectType = RECOMMENDATION_STRATEGY.OBJECT_NAME;

    @track
    showReactionSettings = false;

    @api builderContext = {};

    /**
     * array of object containing name-value of a input parameter.
     * e.g:
     * [{name: 'trackingID', value: '', valueDataType: ''},
     *  {name: 'inputOffers', value: '', valueDataType: ''},
     *  {name: 'lookBackDays', value: '', valueDataType: ''},
     *  {name: 'maxReaction', value: '', valueDataType: ''},
     *  {name: 'reactionType', value: '', valueDataType: ''}]
     */
    @api inputVariables: LimitRepetitionsInput[] = [];

    get labels() {
        return LABELS;
    }

    handlePropertyChangedEvent(propName: string, event: CustomEvent) {
        event.stopPropagation();
        const { value, error } = event.detail;
        const inputDataType = ELEMENT_PROPS[propName]?.dataType;

        this.dispatchEvent(new ConfigurationEditorChangeEvent(propName, value, inputDataType));
    }

    handleInputResourceChange(event: CustomEvent) {
        event.stopPropagation();
        const { value } = event.detail;
        this.showReactionSettings = !!value;

        if (!this.showReactionSettings) {
            return;
        }

        this.handlePropertyChangedEvent(ELEMENT_PROPS.inputOffers.name, event);
    }
}
