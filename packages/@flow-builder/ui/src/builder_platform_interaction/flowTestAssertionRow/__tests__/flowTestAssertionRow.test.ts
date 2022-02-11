// @ts-nocheck
import {
    createComponent,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import { createListRowItem } from 'builder_platform_interaction/elementFactory';
import { UpdateTestAssertionEvent } from 'builder_platform_interaction/events';

jest.mock('builder_platform_interaction/ferToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/ferToFerovExpressionBuilder')
);
const DEFAULT_PROPS = {
    assertion: {
        expression: createListRowItem()
    },
    index: 0
};

const createComponentUnderTest = async (overriddenProps) => {
    return createComponent(selectors.FLOW_TEST_ASSERTION_ROW, DEFAULT_PROPS, overriddenProps);
};
const selectors = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    addMessageButton: '.test-editor-add-assertion-message',
    messageInput: '.test-editor-assertion-message-input',
    inputField: '.slds-input',
    removeMessageButton: '.test-editor-assertion-message-remove'
};

describe('FlowTestAssertionRow', () => {
    it('displays the Add Custom Error Message button when message is undefined', async () => {
        const flowTestAssertionRowComponent = await createComponentUnderTest();
        const button = flowTestAssertionRowComponent.shadowRoot.querySelector(selectors.addMessageButton);
        expect(button).not.toBeNull();
    });

    it('dispatches the UpdateTestAssertionEvent when the Add Custom Error Message button is clicked', async () => {
        const flowTestAssertionRowComponent = await createComponentUnderTest();
        const button = flowTestAssertionRowComponent.shadowRoot.querySelector(selectors.addMessageButton);
        const handleAddAssertion = jest.fn();
        flowTestAssertionRowComponent.addEventListener(UpdateTestAssertionEvent.EVENT_NAME, handleAddAssertion);
        button.click();
        expect(handleAddAssertion).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: {
                    index: 0,
                    isMessageChanged: true,
                    message: '',
                    isExpressionChanged: false,
                    expression: undefined
                }
            })
        );
    });

    it('displays the Custom Error Message input when message is defined', async () => {
        const flowTestAssertionRowComponent = await createComponentUnderTest({
            assertion: {
                expression: createListRowItem(),
                message: ''
            },
            index: 0
        });
        const button = flowTestAssertionRowComponent.shadowRoot.querySelector(selectors.addMessageButton);
        expect(button).toBeNull();
        const input = flowTestAssertionRowComponent.shadowRoot.querySelector(selectors.messageInput);
        expect(input).not.toBeNull();
    });

    it('dispatches the UpdateTestAssertionEvent after clicking the remove Custom Error Message button', async () => {
        const flowTestAssertionRowComponent = await createComponentUnderTest({
            assertion: {
                expression: createListRowItem(),
                message: ''
            },
            index: 0
        });
        const handleUpdateAssertion = jest.fn();
        flowTestAssertionRowComponent.addEventListener(UpdateTestAssertionEvent.EVENT_NAME, handleUpdateAssertion);
        const button = flowTestAssertionRowComponent.shadowRoot.querySelector(selectors.removeMessageButton);
        button.click();
        expect(handleUpdateAssertion).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: {
                    index: 0,
                    isMessageChanged: true,
                    message: undefined,
                    isExpressionChanged: false,
                    expression: undefined
                }
            })
        );
    });
});
