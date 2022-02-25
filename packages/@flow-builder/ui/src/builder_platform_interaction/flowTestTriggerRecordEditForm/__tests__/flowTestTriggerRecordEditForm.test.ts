// @ts-nocheck
import {
    createComponent,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { registerLdsTestWireAdapter } from 'wire-service-jest-util';

const mockGetObjectInfo = require('./data/getObjectInfo.json');
// eslint-disable-next-line
const getObjectInfoAdapter = registerLdsTestWireAdapter(getObjectInfo);

const DEFAULT_PROPS = {
    objectApiName: 'Account',
    recordData: {}
};

const createComponentUnderTest = async (overriddenProps) => {
    const component = createComponent(selectors.FLOW_TEST_TRIGGER_EDIT_FORM, DEFAULT_PROPS, overriddenProps);
    getObjectInfoAdapter.emit(mockGetObjectInfo);
    return component;
};
const selectors = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS
};

describe('FlowTestTriggerEditForm', () => {
    it('creates lightning input fields for mock Account', async () => {
        const flowTestTriggerEditForm = await createComponentUnderTest();
        const rows = flowTestTriggerEditForm.shadowRoot.querySelectorAll(
            LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_INPUT_FIELD
        );
        expect(rows.length).toEqual(2);
    });
});
