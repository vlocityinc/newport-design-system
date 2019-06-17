import { createElement } from 'lwc';
import RecordUseAdvancedOptionsCheckbox from '../recordUseAdvancedOptionsCheckbox';
import { LABELS } from '../recordUseAdvancedOptionsCheckboxLabels';
import { invokeModal } from 'builder_platform_interaction/builderUtils';

function createComponentForTest(isAdvancedMode) {
    const el = createElement(
        'builder_platform_interaction-record-use-advanced-options-checkbox',
        { is: RecordUseAdvancedOptionsCheckbox }
    );
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

const getAdvancedOptionCheckbox = recordUseAdvancedOptionsCheckboxElement => {
    return recordUseAdvancedOptionsCheckboxElement.shadowRoot.querySelector(
        selectors.lightningInput
    );
};

describe('Record-use-advanced-options-checkbox', () => {
    let recordUseAdvancedOptionsCheckboxElement;
    describe('On uncheck', () => {
        beforeEach(() => {
            recordUseAdvancedOptionsCheckboxElement = createComponentForTest(
                true
            );
        });
        it('should display an alert', () => {
            const advancedOptionCheckbox = getAdvancedOptionCheckbox(
                recordUseAdvancedOptionsCheckboxElement
            );
            advancedOptionCheckbox.dispatchEvent(new ToggleOffChangeEvent());
            return Promise.resolve().then(() => {
                expect(
                    invokeModal.mock.calls[0][0].headerData.headerTitle
                ).toBe(LABELS.areYouSure);
                expect(invokeModal.mock.calls[0][0].bodyData.bodyTextOne).toBe(
                    LABELS.clearVariableConfirmation
                );
                expect(invokeModal.mock.calls[0][0].footerData).toMatchObject({
                    buttonOne: { buttonLabel: LABELS.cancelButton },
                    buttonTwo: {
                        buttonLabel: LABELS.confirm,
                        buttonVariant: LABELS.confirm
                    }
                });
            });
        });
    });
    describe('On check', () => {
        beforeEach(() => {
            recordUseAdvancedOptionsCheckboxElement = createComponentForTest(
                false
            );
        });
        it('should not display an alert', () => {
            const advancedOptionCheckbox = getAdvancedOptionCheckbox(
                recordUseAdvancedOptionsCheckboxElement
            );
            advancedOptionCheckbox.dispatchEvent(new ToggleOnChangeEvent());
            return Promise.resolve().then(() => {
                expect(invokeModal).not.toHaveBeenCalled();
            });
        });
    });
});
