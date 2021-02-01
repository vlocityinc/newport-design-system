import { createElement } from 'lwc';
import TransactionControlPicker from '../transactionControlPicker';
import { FLOW_TRANSACTION_MODEL } from 'builder_platform_interaction/flowMetadata';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';

const selectors = {
    transactionControlPicker: 'builder_platform_interaction-transaction-control-picker',
    input: 'input',
    inputChecked: '.slds-form-element__control input:checked',
    inputNewTransaction: '[name="NewTransaction"]'
};

function createComponentForTest(flowTransactionModel) {
    const el = createElement(selectors.transactionControlPicker, {
        is: TransactionControlPicker
    });
    Object.assign(el, { flowTransactionModel });
    setDocumentBodyChildren(el);
    return el;
}

// @ts-ignore
class ToggleOnChangeEvent extends CustomEvent {
    constructor() {
        super('change', { detail: { checked: true } });
    }
}

const getInputElements = (transactionControlPicker) =>
    transactionControlPicker.shadowRoot.querySelectorAll(selectors.input);
const getCheckedInputElement = (transactionControlPicker) =>
    transactionControlPicker.shadowRoot.querySelector(selectors.inputChecked);

describe('transaction-control-picker', () => {
    describe('Using default flow transaction model', () => {
        let transactionControlPicker;
        beforeEach(() => {
            transactionControlPicker = createComponentForTest(FLOW_TRANSACTION_MODEL.AUTOMATIC);
        });
        it('should contain 3 input components', () => {
            const inputs = getInputElements(transactionControlPicker);
            expect(inputs).toHaveLength(3);
        });
        it('automatic transaction input component should be checked', () => {
            const checkedInput = getCheckedInputElement(transactionControlPicker);
            expect(checkedInput.value).toBe(FLOW_TRANSACTION_MODEL.AUTOMATIC);
        });
    });
    describe('when input selection is checked', () => {
        let transactionControlPicker;
        let inputSelectionCheckbox;
        beforeEach(() => {
            transactionControlPicker = createComponentForTest(FLOW_TRANSACTION_MODEL.AUTOMATIC);
        });
        it('fires propertyChanged event if changed', async () => {
            await ticks(1);
            inputSelectionCheckbox = transactionControlPicker.shadowRoot.querySelector(selectors.inputNewTransaction);
            inputSelectionCheckbox.checked = true;

            const eventCallback = jest.fn();
            transactionControlPicker.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);
            inputSelectionCheckbox.dispatchEvent(new ToggleOnChangeEvent());
            expect(eventCallback).toHaveBeenLastCalledWith(eventCallback.mock.calls[0][0]);
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    propertyName: 'flowTransactionModel',
                    value: FLOW_TRANSACTION_MODEL.NEW_TRANSACTION
                }
            });
        });
    });
});
