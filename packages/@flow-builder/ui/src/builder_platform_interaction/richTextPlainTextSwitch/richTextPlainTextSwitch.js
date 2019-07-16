import { LightningElement, api } from 'lwc';
import { LABELS } from './richTextPlainTextSwitchLabels';
import { RichTextPlainTextSwitchChangedEvent } from 'builder_platform_interaction/events';

export const TEXT_MODES = { richText: 'richText', plainText: 'plainText' };

/**
 * Provide selection among rich text or plain text modes
 */
export default class RichTextPlainTextSwitch extends LightningElement {
    labels = LABELS;
    textModes = TEXT_MODES;

    /**
     * Set/Get Selected mode
     */
    @api
    selectedMode = TEXT_MODES.richText;

    /**
     * @returns {boolean} - true if plain text mode selected, false otherwise
     */
    get isPlainTextMode() {
        return this.selectedMode === TEXT_MODES.plainText;
    }

    /**
     * @returns {boolean} - true if rich text mode selected (default mode), false otherwise
     */
    get isRichTextMode() {
        return this.selectedMode === TEXT_MODES.richText;
    }

    /**
     * Handling native selection mode event and re dispatch {@link RichTextPlainTextSwitchChangedEvent}
     * @param {Object} event - "select" (see {@link CustomEvent})
     * @param {string} event.details.value - the selected mode see {@link TEXT_MODES}
     */
    handlePlainTextModeChange(event) {
        event.stopPropagation();
        const { value } = event.detail;
        this.selectedMode = value;
        const isPlainText = value === TEXT_MODES.plainText;
        this.dispatchEvent(
            new RichTextPlainTextSwitchChangedEvent(isPlainText)
        );
    }
}
