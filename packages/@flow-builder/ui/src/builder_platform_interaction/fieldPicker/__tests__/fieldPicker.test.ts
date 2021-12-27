// @ts-nocheck
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { filterFieldsForChosenElement } from 'builder_platform_interaction/expressionUtils';
import { isLookupTraversalSupported } from 'builder_platform_interaction/processTypeLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { createElement } from 'lwc';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import FieldPicker from '../fieldPicker';

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        filterFieldsForChosenElement: jest.fn()
    };
});

jest.mock('builder_platform_interaction/storeLib', () => {
    function createSelector() {
        const actual = jest.requireActual('builder_platform_interaction/storeLib');
        return actual.createSelector;
    }
    const storeMockLib = require('builder_platform_interaction_mocks/storeLib');
    storeMockLib.createSelector = createSelector;
    return storeMockLib;
});

jest.mock('builder_platform_interaction/processTypeLib');

const setupComponentUnderTest = (props) => {
    const element = createElement('builder_platform_interaction-field-picker', {
        is: FieldPicker
    });
    Object.assign(element, props);
    setDocumentBodyChildren(element);
    return element;
};

describe('field-picker', () => {
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    it('defaults requiredness to false', async () => {
        const fieldPicker = setupComponentUnderTest();
        await ticks(1);
        const baseResourcePicker = fieldPicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        expect(baseResourcePicker.comboboxConfig.required).toBe(false);
    });
    it('sets requiredness to true', async () => {
        const fieldPicker = setupComponentUnderTest({
            required: true
        });
        await ticks(1);
        const baseResourcePicker = fieldPicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        expect(baseResourcePicker.comboboxConfig.required).toBe(true);
    });
    it('sets label', async () => {
        const label = 'label';
        const fieldPicker = setupComponentUnderTest({
            label
        });
        await ticks(1);
        const baseResourcePicker = fieldPicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        expect(baseResourcePicker.comboboxConfig.label).toBe(label);
    });
    it('sets placeholder', async () => {
        const placeholder = 'placeholder';
        const fieldPicker = setupComponentUnderTest({
            placeholder
        });
        await ticks(1);
        const baseResourcePicker = fieldPicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        expect(baseResourcePicker.comboboxConfig.placeholder).toBe(placeholder);
    });
    it('sets error message', async () => {
        const errorMessage = 'bah humbug';
        const fieldPicker = setupComponentUnderTest({
            errorMessage
        });
        await ticks(1);
        const baseResourcePicker = fieldPicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        expect(baseResourcePicker.errorMessage).toBe(errorMessage);
    });
    it('populates menuData with passed in fields', async () => {
        const fields = ['field'];
        isLookupTraversalSupported.mockImplementation(() => true);
        setupComponentUnderTest({
            fields
        });
        await ticks(1);
        expect(filterFieldsForChosenElement).toHaveBeenCalledWith(null, fields, {
            showAsFieldReference: false,
            showSubText: true,
            allowSObjectFieldsTraversal: true
        });
    });
    it('populates menuData with passed in fields no traversal support', async () => {
        const fields = ['field'];
        isLookupTraversalSupported.mockImplementation(() => false);
        setupComponentUnderTest({
            fields
        });
        await ticks(1);
        expect(filterFieldsForChosenElement).toHaveBeenCalledWith(null, fields, {
            showAsFieldReference: false,
            showSubText: true,
            allowSObjectFieldsTraversal: false
        });
    });
    it('does not attempt to process menu data if no fields are passed', async () => {
        setupComponentUnderTest();
        await ticks(1);
        expect(filterFieldsForChosenElement).not.toHaveBeenCalled();
    });
});
