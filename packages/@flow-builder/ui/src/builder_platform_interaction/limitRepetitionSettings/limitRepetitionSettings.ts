import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { ELEMENT_PROPS, ReactionType } from 'builder_platform_interaction/limitRepetitionsLib';
import { api, LightningElement } from 'lwc';
import { LABELS } from './limitRepetitionSettingsLabels';

export default class LimitRepetitions extends LightningElement {
    reactionTypes = [
        { label: LABELS.acceptedOrRejected, value: ReactionType.All },
        { label: LABELS.accepted, value: ReactionType.Accepted },
        { label: LABELS.rejected, value: ReactionType.Rejected }
    ];

    @api
    maxReaction;

    @api
    lookBackDays;

    @api
    reactionType;

    @api
    recordId;

    get labels() {
        return LABELS;
    }

    handleReactionTypeChange(event) {
        event.stopPropagation();
        const { value } = event.target;

        if (this.reactionType !== value) {
            const event = new PropertyChangedEvent(ELEMENT_PROPS.reactionType.name, value);
            this.dispatchEvent(event);
        }
    }

    handleMaxReactionsFocusOut(event) {
        event.stopPropagation();
        const { value } = event.target;
        // avoid setting value other than integer
        if (isNaN(parseInt(value, 10))) {
            return;
        }
        if (this.maxReaction !== value) {
            const event = new PropertyChangedEvent(ELEMENT_PROPS.maxReaction.name, value);
            this.dispatchEvent(event);
        }
    }

    handleLookbackDaysFocusOut(event) {
        event.stopPropagation();
        const { value } = event.target;

        // avoid setting value other than integer
        if (isNaN(parseInt(value, 10))) {
            return;
        }

        if (this.lookBackDays !== value) {
            const event = new PropertyChangedEvent(ELEMENT_PROPS.lookBackDays.name, value);
            this.dispatchEvent(event);
        }
    }
}
