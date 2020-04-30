import { createElement } from 'lwc';
import ScreenTextareaField from 'builder_platform_interaction/screenTextareaField';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { ticks, LIGHTNING_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';

const standardLabelVariant = 'standard';

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-screen-textarea-field', { is: ScreenTextareaField });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
}

describe('Textarea display is required', () => {
    let textWrapperCmp;
    beforeEach(() => {
        textWrapperCmp = createComponentForTest({
            label: 'display1',
            required: true
        });
    });
    it('Value should be undefined', async () => {
        await ticks(1);
        const input = textWrapperCmp.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_TEXTAREA);
        expect(input.value).toBeUndefined();
    });
    it('Required should be true', async () => {
        await ticks(1);
        const input = textWrapperCmp.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_TEXTAREA);
        expect(input.required).toEqual(true);
    });
    it('Label should be standard', async () => {
        await ticks(1);
        const input = textWrapperCmp.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_TEXTAREA);
        expect(input.variant).toEqual(standardLabelVariant);
    });
});

describe('Textarea field not required', () => {
    let textWrapperCmp;
    const defaultValue = 'Default value here';
    beforeEach(() => {
        textWrapperCmp = createComponentForTest({
            label: 'display1',
            required: false,
            value: defaultValue
        });
    });
    it('Value should be as specified', async () => {
        await ticks(1);
        const input = textWrapperCmp.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_TEXTAREA);
        expect(input.value).toEqual(defaultValue);
    });
    it('Required should be false', async () => {
        await ticks(1);
        const input = textWrapperCmp.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_TEXTAREA);
        expect(input.required).toEqual(false);
    });
    it('Label should be standard', async () => {
        await ticks(1);
        const input = textWrapperCmp.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_TEXTAREA);
        expect(input.variant).toEqual(standardLabelVariant);
    });
});

describe('Text area field with no label', () => {
    let textWrapperCmp;
    beforeEach(() => {
        textWrapperCmp = createComponentForTest({
            value: '',
            label: '',
            required: false
        });
    });
    it('Label should be shown even when it is empty', async () => {
        await ticks(1);
        const input = textWrapperCmp.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_TEXTAREA);
        expect(input.variant).toEqual(standardLabelVariant);
    });
    it('Label displayed should be a placeholder', async () => {
        await ticks(1);
        const input = textWrapperCmp.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_TEXTAREA);
        expect(input.label).toEqual('[' + LABELS.fieldTypeLabelLargeTextArea + ']');
    });
});

describe('Text area with help text', () => {
    let textWrapperCmp;
    const helpTextValue = 'Enter your name';
    beforeEach(() => {
        textWrapperCmp = createComponentForTest({
            value: '',
            label: '',
            helpText: { value: helpTextValue, error: null }
        });
    });
    it('Help text should be passed through', async () => {
        await ticks(1);
        const input = textWrapperCmp.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_TEXTAREA);
        expect(input.fieldLevelHelp).toEqual(helpTextValue);
    });
});
