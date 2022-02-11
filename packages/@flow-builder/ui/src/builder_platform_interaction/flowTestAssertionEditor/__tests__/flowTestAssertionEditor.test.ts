// @ts-nocheck
import {
    createComponent,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import { createListRowItem } from 'builder_platform_interaction/elementFactory';

jest.mock('builder_platform_interaction/ferToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/ferToFerovExpressionBuilder')
);

const selectors = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    ...LIGHTNING_COMPONENTS_SELECTORS
};

const DEFAULT_PROPS = {
    assertionsList: [
        {
            expression: createListRowItem()
        }
    ]
};
const createComponentUnderTest = async (overriddenProps) => {
    return createComponent(selectors.FLOW_TEST_ASSERTION_EDITOR, DEFAULT_PROPS, overriddenProps);
};

const getDeleteAssertionButton = (parent) => {
    const assertionRow = parent.shadowRoot.querySelector(selectors.FLOW_TEST_ASSERTION_ROW);
    const row = assertionRow.shadowRoot.querySelector(selectors.ROW);
    return row.shadowRoot.querySelector(selectors.LIGHTNING_BUTTON_ICON);
};

describe('FlowTestAssertionEditor', () => {
    it('disables the delete row button when there is only 1 assertion', async () => {
        const flowTestAssertionEditorComponent = await createComponentUnderTest();
        const button = getDeleteAssertionButton(flowTestAssertionEditorComponent);
        expect(button.disabled).toEqual(true);
    });
    it('enables the delete row button when there are multiple assertion', async () => {
        const flowTestAssertionEditorComponent = await createComponentUnderTest({
            assertionsList: [
                {
                    expression: createListRowItem()
                },
                {
                    expression: createListRowItem()
                }
            ]
        });
        const button = getDeleteAssertionButton(flowTestAssertionEditorComponent);
        expect(button.disabled).toEqual(false);
    });
});
