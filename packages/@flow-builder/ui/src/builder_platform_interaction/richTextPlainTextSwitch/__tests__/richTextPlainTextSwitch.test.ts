// @ts-nocheck
import { createElement } from 'lwc';
import RichTextPlainTextSwitch, { TEXT_MODES } from '../richTextPlainTextSwitch';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-rich-text-plain-text-switch', {
        is: RichTextPlainTextSwitch
    });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
}

const changeModeEvent = (value) =>
    new CustomEvent('change', {
        detail: { value }
    });

const SELECTORS = {
    lightningCombobox: 'lightning-combobox'
};

const getLightningCombobox = (richTextPlainTextSwitchComponent) =>
    richTextPlainTextSwitchComponent.shadowRoot.querySelector(SELECTORS.lightningCombobox);

describe('rich-text-plain-text-switch', () => {
    let richTextPlainTextSwitchComponent;
    beforeEach(() => {
        richTextPlainTextSwitchComponent = createComponentForTest();
    });
    describe('By default "RichText" mode selected', () => {
        test('check "selectedMode"', () => {
            expect(richTextPlainTextSwitchComponent.selectedMode).toEqual(TEXT_MODES.richText);
        });
    });
    describe('Select "PlainText" mode', () => {
        it('select "plain text" mode via UI', async () => {
            const lightningCombobox = getLightningCombobox(richTextPlainTextSwitchComponent);
            lightningCombobox.dispatchEvent(changeModeEvent(TEXT_MODES.plainText));
            await ticks(1);
            expect(richTextPlainTextSwitchComponent.selectedMode).toEqual(TEXT_MODES.plainText);
        });
    });
    describe('Select "RichText" mode', () => {
        it('select "rich text" mode via UI', async () => {
            const lightningCombobox = getLightningCombobox(richTextPlainTextSwitchComponent);
            lightningCombobox.dispatchEvent(changeModeEvent(TEXT_MODES.richText));
            await ticks(1);
            expect(richTextPlainTextSwitchComponent.selectedMode).toEqual(TEXT_MODES.richText);
        });
    });
});
