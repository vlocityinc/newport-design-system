import { createElement } from 'lwc';
import UseAdvancedOptionsCheckbox from '../useAdvancedOptionsCheckbox';
import { LABELS } from '../useAdvancedOptionsCheckboxLabels';
import { invokeModal } from 'builder_platform_interaction/builderUtils';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

function createComponentForTest(isAdvancedMode) {
    const el = createElement('builder_platform_interaction-use-advanced-options-checkbox', {
        is: UseAdvancedOptionsCheckbox
    });
    Object.assign(el, { isAdvancedMode });
    document.body.appendChild(el);
    return el;
}

jest.mock('builder_platform_interaction/builderUtils', () => {
    return {
        invokeModal: jest.fn()
    };
});

class ToggleOffChangeEvent extends CustomEvent {
    constructor() {
        super('change', { detail: { checked: false } });
    }
}

class ToggleOnChangeEvent extends CustomEvent {
    constructor() {
        super('change', { detail: { checked: true } });
    }
}

const selectors = {
    lightningInput: 'lightning-input'
};

const getAdvancedOptionCheckbox = useAdvancedOptionsCheckboxElement => {
    return useAdvancedOptionsCheckboxElement.shadowRoot.querySelector(selectors.lightningInput);
};

describe('Use-advanced-options-checkbox', () => {
    let useAdvancedOptionsCheckboxElement;
    describe('On uncheck', () => {
        beforeEach(() => {
            useAdvancedOptionsCheckboxElement = createComponentForTest(true);
        });
        it('should display an alert', async () => {
            const advancedOptionCheckbox = getAdvancedOptionCheckbox(useAdvancedOptionsCheckboxElement);
            advancedOptionCheckbox.dispatchEvent(new ToggleOffChangeEvent());
            await ticks(1);
            expect(invokeModal.mock.calls[0][0].headerData.headerTitle).toBe(LABELS.areYouSure);
            expect(invokeModal.mock.calls[0][0].bodyData.bodyTextOne).toBe(LABELS.clearVariableConfirmation);
            expect(invokeModal.mock.calls[0][0].footerData).toMatchObject({
                buttonOne: { buttonLabel: LABELS.cancelButton },
                buttonTwo: {
                    buttonLabel: LABELS.confirm,
                    buttonVariant: LABELS.confirm
                }
            });
        });
    });
    describe('On check', () => {
        beforeEach(() => {
            useAdvancedOptionsCheckboxElement = createComponentForTest(false);
        });
        it('should not display an alert', async () => {
            const advancedOptionCheckbox = getAdvancedOptionCheckbox(useAdvancedOptionsCheckboxElement);
            advancedOptionCheckbox.dispatchEvent(new ToggleOnChangeEvent());
            await ticks(1);
            expect(invokeModal).not.toHaveBeenCalled();
        });
    });
});
