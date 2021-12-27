// @ts-nocheck
import { getValueFromHydratedItem, hydrateIfNecessary } from 'builder_platform_interaction/dataMutationLib';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { FOOTER_LABEL_TYPE, PAUSE_MESSAGE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { api, LightningElement } from 'lwc';
const EXPANDED_SECTION_NAMES = [];

/*
 * Screen element property editor
 */
export default class ScreenPropertiesEditor extends LightningElement {
    @api
    screen;
    labels = LABELS;
    @api
    mode;

    @api
    editorParams;

    nextOrFinishLabelTypeOptions = [
        {
            label: this.labels.labelOptionStandard,
            value: FOOTER_LABEL_TYPE.STANDARD
        },
        {
            label: this.labels.labelOptionCustom,
            value: FOOTER_LABEL_TYPE.CUSTOM
        },
        {
            label: this.labels.labelOptionHideNextOrFinish,
            value: FOOTER_LABEL_TYPE.HIDE
        }
    ];

    previousLabelTypeOptions = [
        {
            label: this.labels.labelOptionStandard,
            value: FOOTER_LABEL_TYPE.STANDARD
        },
        {
            label: this.labels.labelOptionCustom,
            value: FOOTER_LABEL_TYPE.CUSTOM
        },
        {
            label: this.labels.labelOptionHidePrevious,
            value: FOOTER_LABEL_TYPE.HIDE
        }
    ];

    pauseLabelTypeOptions = [
        {
            label: this.labels.labelOptionStandard,
            value: FOOTER_LABEL_TYPE.STANDARD
        },
        {
            label: this.labels.labelOptionCustom,
            value: FOOTER_LABEL_TYPE.CUSTOM
        },
        {
            label: this.labels.labelOptionHidePause,
            value: FOOTER_LABEL_TYPE.HIDE
        }
    ];

    pauseMessageTypeOptions = [
        {
            label: this.labels.pauseMessageOptionStandard,
            value: PAUSE_MESSAGE_TYPE.STANDARD
        },
        {
            label: this.labels.pauseMessageOptionCustom,
            value: PAUSE_MESSAGE_TYPE.CUSTOM
        }
    ];

    get expandedSectionNames() {
        return EXPANDED_SECTION_NAMES;
    }

    get nextOrFinishButtonType() {
        if (getValueFromHydratedItem(this.screen.nextOrFinishLabelType) === FOOTER_LABEL_TYPE.STANDARD) {
            return FOOTER_LABEL_TYPE.STANDARD;
        } else if (getValueFromHydratedItem(this.screen.nextOrFinishLabelType) === FOOTER_LABEL_TYPE.CUSTOM) {
            return FOOTER_LABEL_TYPE.CUSTOM;
        }
        return FOOTER_LABEL_TYPE.HIDE;
    }

    get previousButtonType() {
        if (getValueFromHydratedItem(this.screen.backLabelType) === FOOTER_LABEL_TYPE.STANDARD) {
            return FOOTER_LABEL_TYPE.STANDARD;
        } else if (getValueFromHydratedItem(this.screen.backLabelType) === FOOTER_LABEL_TYPE.CUSTOM) {
            return FOOTER_LABEL_TYPE.CUSTOM;
        }
        return FOOTER_LABEL_TYPE.HIDE;
    }

    get pauseButtonType() {
        if (getValueFromHydratedItem(this.screen.pauseLabelType) === FOOTER_LABEL_TYPE.STANDARD) {
            return FOOTER_LABEL_TYPE.STANDARD;
        } else if (getValueFromHydratedItem(this.screen.pauseLabelType) === FOOTER_LABEL_TYPE.CUSTOM) {
            return FOOTER_LABEL_TYPE.CUSTOM;
        }
        return FOOTER_LABEL_TYPE.HIDE;
    }

    get pauseMessageType() {
        if (getValueFromHydratedItem(this.screen.pauseMessageType) === PAUSE_MESSAGE_TYPE.CUSTOM) {
            return PAUSE_MESSAGE_TYPE.CUSTOM;
        }
        return PAUSE_MESSAGE_TYPE.STANDARD;
    }

    get isNextOrFinishButtonCustom() {
        return this.nextOrFinishButtonType === FOOTER_LABEL_TYPE.CUSTOM;
    }

    get isPreviousButtonCustom() {
        return this.previousButtonType === FOOTER_LABEL_TYPE.CUSTOM;
    }

    get isPauseButtonCustom() {
        return this.pauseButtonType === FOOTER_LABEL_TYPE.CUSTOM;
    }

    get isPauseButtonAllowed() {
        return this.pauseButtonType !== FOOTER_LABEL_TYPE.HIDE;
    }

    get showPauseConfirmationMessageEditor() {
        return this.isPauseButtonAllowed && this.pauseMessageType === PAUSE_MESSAGE_TYPE.CUSTOM;
    }

    // This function handles changes from label-description component by re-firing the event including the old value and handles the radio groups for config custom footer labels, not the rest of the properties
    handlePropertyChanged = (event) => {
        event.stopPropagation();
        const newValue = hydrateIfNecessary(event.detail.value);
        const property = event.detail.propertyName ? event.detail.propertyName : event.currentTarget?.name;
        const error = event.detail.error ? event.detail.error : null;
        const currentValue = hydrateIfNecessary(this.screen[property]);
        this.dispatchEvent(new PropertyChangedEvent(property, newValue, error, null, currentValue));
    };
}
