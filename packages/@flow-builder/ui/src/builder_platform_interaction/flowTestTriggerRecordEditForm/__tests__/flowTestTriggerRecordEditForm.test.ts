// @ts-nocheck
import {
    createComponent,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getRecord } from 'lightning/uiRecordApi';
import { registerLdsTestWireAdapter } from 'wire-service-jest-util';

/* eslint-disable */
const mockGetObjectInfo = require('./data/getObjectInfo.json');
const getObjectInfoAdapter = registerLdsTestWireAdapter(getObjectInfo);

const mockGetRecord = require('./data/getRecord.json');
const getRecordAdapter = registerLdsTestWireAdapter(getRecord);
/* eslint-enable */

const DEFAULT_PROPS = {
    objectApiName: 'Account',
    recordData: {},
    isUpdatedRecord: false,
    selectedSampleRecordId: 'sampleRecord'
};

const createComponentUnderTest = async (overriddenProps?) => {
    const component = await createComponent(selectors.FLOW_TEST_TRIGGER_EDIT_FORM, DEFAULT_PROPS, overriddenProps);
    getObjectInfoAdapter.emit(mockGetObjectInfo);
    getRecordAdapter.emit(mockGetRecord);
    return component;
};

const createComponentUnderTestWithoutEmit = async (overriddenProps?) => {
    return createComponent(selectors.FLOW_TEST_TRIGGER_EDIT_FORM, DEFAULT_PROPS, overriddenProps);
};

const selectors = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    RECORD_PICKER: 'builder_platform_interaction-record-picker'
};

describe('FlowTestTriggerEditForm', () => {
    it('creates lightning input fields for mock Account', async () => {
        const flowTestTriggerEditForm = await createComponentUnderTest();
        const rows = flowTestTriggerEditForm.shadowRoot.querySelectorAll(
            LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_INPUT_FIELD
        );
        expect(rows.length).toEqual(3);
    });
    it('does not show record picker as a required field', async () => {
        const flowTestTriggerEditForm = await createComponentUnderTest();
        const recordPicker = flowTestTriggerEditForm.shadowRoot.querySelector(selectors.RECORD_PICKER);
        expect(recordPicker.required).toEqual(false);
    });
    it('does not show spinner when record info and object info has loaded', async () => {
        const flowTestTriggerEditForm = await createComponentUnderTest();
        const spinner = flowTestTriggerEditForm.shadowRoot.querySelector(
            LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_SPINNER
        );
        expect(spinner).toBeNull();
    });
    it('shows spinner when record info and object info has not loaded', async () => {
        const flowTestTriggerEditForm = await createComponentUnderTestWithoutEmit();
        const spinner = flowTestTriggerEditForm.shadowRoot.querySelector(
            LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_SPINNER
        );
        expect(spinner).not.toBeNull();
    });
});
