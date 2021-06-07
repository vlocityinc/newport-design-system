// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { CANVAS_SCREEN_GUIDS } from 'builder_platform_interaction/screenEditorUtils';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { createScreenElementDeselectedEvent } from 'builder_platform_interaction/events';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { FOOTER_LABEL_TYPE } from 'builder_platform_interaction/flowMetadata';

/*
 * The screen editor canvas, support for adding, deleting, editing and rearranging fields (incomplete)
 */
export default class ScreenEditorCanvas extends LightningElement {
    @api flowLabel;
    @api screen;
    @api selectedItemGuid;
    labels = LABELS;

    get screenConfigurationHasErrors() {
        for (const property in this.screen) {
            if (this.screen.hasOwnProperty(property)) {
                const val = this.screen[property];
                if (val && !Array.isArray(val) && val.error) {
                    return true;
                }
            }
        }

        return false;
    }

    get screenTitle() {
        return this.flowLabel || `[${LABELS.screenTitlePlaceHolder}]`;
    }

    get hasHelpText() {
        return this.screen.helpText && this.screen.helpText.value;
    }

    get headerSelected() {
        return this.selectedItemGuid === CANVAS_SCREEN_GUIDS.HEADER_GUID;
    }

    get footerSelected() {
        return this.selectedItemGuid === CANVAS_SCREEN_GUIDS.FOOTER_GUID;
    }

    get showNextOrFinish() {
        return (
            getValueFromHydratedItem(this.screen.nextOrFinishLabelType) === FOOTER_LABEL_TYPE.STANDARD ||
            (getValueFromHydratedItem(this.screen.nextOrFinishLabelType) === FOOTER_LABEL_TYPE.CUSTOM &&
                getValueFromHydratedItem(this.screen.nextOrFinishLabel))
        );
    }

    get nextOrFinishButtonText() {
        return (
            (getValueFromHydratedItem(this.screen.nextOrFinishLabelType) !== FOOTER_LABEL_TYPE.CUSTOM &&
                this.labels.finish) ||
            getValueFromHydratedItem(this.screen.nextOrFinishLabel)
        );
    }

    get showBack() {
        return (
            getValueFromHydratedItem(this.screen.backLabelType) === FOOTER_LABEL_TYPE.STANDARD ||
            (getValueFromHydratedItem(this.screen.backLabelType) === FOOTER_LABEL_TYPE.CUSTOM &&
                getValueFromHydratedItem(this.screen.backLabelType))
        );
    }

    get backButtonText() {
        return (
            (getValueFromHydratedItem(this.screen.backLabelType) !== FOOTER_LABEL_TYPE.CUSTOM &&
                this.labels.previous) ||
            getValueFromHydratedItem(this.screen.backLabel)
        );
    }

    get showPause() {
        return (
            getValueFromHydratedItem(this.screen.pauseLabelType) === FOOTER_LABEL_TYPE.STANDARD ||
            (getValueFromHydratedItem(this.screen.pauseLabelType) === FOOTER_LABEL_TYPE.CUSTOM &&
                getValueFromHydratedItem(this.screen.pauseLabel))
        );
    }

    get pauseButtonText() {
        return (
            (getValueFromHydratedItem(this.screen.pauseLabelType) !== FOOTER_LABEL_TYPE.CUSTOM && this.labels.pause) ||
            getValueFromHydratedItem(this.screen.pauseLabel)
        );
    }

    handleOnClick = (event) => {
        const selected = this.getSelectedElement();
        this.dispatchEvent(createScreenElementDeselectedEvent(selected));
        event.stopPropagation();
    };

    handleScroll() {
        this.clearDraggingState();
    }

    clearDraggingState() {
        delete this.ranges; // Force recalculate bounding client rects for the new scroll position
        delete this.top;
    }

    getSelectedElement() {
        for (const highlight of this.template.querySelectorAll(
            'builder_platform_interaction-screen-editor-highlight'
        )) {
            if (highlight.selected) {
                return highlight;
            }
        }

        return null;
    }
}
