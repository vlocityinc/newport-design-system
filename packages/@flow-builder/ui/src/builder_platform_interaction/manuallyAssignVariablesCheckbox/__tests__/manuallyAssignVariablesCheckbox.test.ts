import { createElement } from 'lwc';
import ManuallyAssignVariablesCheckbox from '../manuallyAssignVariablesCheckbox';
import { LABELS } from '../manuallyAssignVariablesCheckboxLabels';
import { invokeModal } from 'builder_platform_interaction/sharedUtils';
import {
    ticks,
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren
} from 'builder_platform_interaction/builderTestUtils';

function createComponentForTest(isAdvancedMode) {
    const el = createElement('builder_platform_interaction-use-advanced-options-checkbox', {
        is: ManuallyAssignVariablesCheckbox
    }) as ManuallyAssignVariablesCheckbox & HTMLElement;
    Object.assign(el, { isAdvancedMode });
    setDocumentBodyChildren(el);
    return el;
}

jest.mock('builder_platform_interaction/sharedUtils', () => {
    return {
        invokeModal: jest.fn()
    };
});

class ToggleOffChangeEvent extends CustomEvent<any> {
    constructor() {
        super('change', { detail: { checked: false } });
    }
}

class ToggleOnChangeEvent extends CustomEvent<any> {
    constructor() {
        super('change', { detail: { checked: true } });
    }
}

const getManuallyAssignVariablesCheckboxInputElement = (manuallyAssignVariablesComponent) => {
    return manuallyAssignVariablesComponent.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_INPUT);
};

describe('manually-assign-variables-checkbox', () => {
    let manuallyAssignVariablesComponent: ManuallyAssignVariablesCheckbox;
    describe('On uncheck', () => {
        beforeEach(() => {
            manuallyAssignVariablesComponent = createComponentForTest(true);
        });
        it('should display an alert', async () => {
            const checkbox = getManuallyAssignVariablesCheckboxInputElement(manuallyAssignVariablesComponent);
            checkbox.dispatchEvent(new ToggleOffChangeEvent());
            await ticks(1);
            const invokeModalMock = invokeModal as jest.Mock;
            expect(invokeModalMock.mock.calls[0][0].headerData.headerTitle).toBe(LABELS.areYouSure);
            expect(invokeModalMock.mock.calls[0][0].bodyData.bodyTextOne).toBe(LABELS.clearVariableConfirmation);
            expect(invokeModalMock.mock.calls[0][0].footerData).toMatchObject({
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
            manuallyAssignVariablesComponent = createComponentForTest(false);
        });
        it('should not display an alert', async () => {
            const checkbox = getManuallyAssignVariablesCheckboxInputElement(manuallyAssignVariablesComponent);
            checkbox.dispatchEvent(new ToggleOnChangeEvent());
            await ticks(1);
            expect(invokeModal).not.toHaveBeenCalled();
        });
    });
});
