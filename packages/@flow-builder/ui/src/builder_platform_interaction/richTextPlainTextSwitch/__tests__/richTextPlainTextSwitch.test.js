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

const SelectPlainTextModeEvent = new CustomEvent('select', {
    detail: { value: TEXT_MODES.plainText }
});

const SelectRichTextModeEvent = new CustomEvent('select', {
    detail: { value: TEXT_MODES.richText }
});

const SELECTORS = {
    lightningButtonMenu: 'lightning-button-menu',
    lightningMenuItem: 'lightning-menu-item'
};

const getLightningButtonMenu = richTextPlainTextSwitchComponent => {
    return richTextPlainTextSwitchComponent.shadowRoot.querySelector(SELECTORS.lightningButtonMenu);
};
describe('plain-text-mode-select', () => {
    let richTextPlainTextSwitchComponent;
    beforeEach(() => {
        richTextPlainTextSwitchComponent = createComponentForTest();
    });
    describe('By default "RichText" mode selected', () => {
        test('check UI (snapshot) - menu items details: label, checked status', () => {
            expect(richTextPlainTextSwitchComponent).toMatchSnapshot();
        });
    });
    describe('Select "PlainText" mode', () => {
        it('select "plain text" mode via API', async () => {
            richTextPlainTextSwitchComponent.selectedMode = TEXT_MODES.plainText;
            await ticks(1);
            expect(richTextPlainTextSwitchComponent).toMatchSnapshot();
        });
        it('select "plain text" mode via UI', async () => {
            const lightningButtonMenu = getLightningButtonMenu(richTextPlainTextSwitchComponent);
            lightningButtonMenu.dispatchEvent(SelectPlainTextModeEvent);
            await ticks(1);
            expect(richTextPlainTextSwitchComponent).toMatchSnapshot();
        });
    });
    describe('Select "RichText" mode', () => {
        it('select "rich text" mode via API', async () => {
            richTextPlainTextSwitchComponent.selectedMode = TEXT_MODES.richText;
            await ticks(1);
            expect(richTextPlainTextSwitchComponent).toMatchSnapshot();
        });
        it('select "rich text" mode via UI', async () => {
            const lightningButtonMenu = getLightningButtonMenu(richTextPlainTextSwitchComponent);
            lightningButtonMenu.dispatchEvent(SelectRichTextModeEvent);
            await ticks(1);
            expect(richTextPlainTextSwitchComponent).toMatchSnapshot();
        });
    });
});
