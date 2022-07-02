// @ts-nocheck
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { filterFieldsForChosenElement } from 'builder_platform_interaction/expressionUtils';
import { isLookupTraversalSupported } from 'builder_platform_interaction/processTypeLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { createElement } from 'lwc';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import FieldPicker from '../fieldPicker';

jest.mock('builder_platform_interaction/expressionUtils', () => {
    const actualExpressionUtils = jest.requireActual('builder_platform_interaction/expressionUtils');

    return {
        filterFieldsForChosenElement: jest.fn().mockImplementation((chosenElement, fields, filters) => {
            return actualExpressionUtils.filterFieldsForChosenElement(chosenElement, fields, filters);
        })
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

const menuItems = filterFieldsForChosenElement(null, mockAccountFields, {
    showAsFieldReference: false,
    showSubText: true,
    allowSObjectFieldsTraversal: true
});

const findMenuItem = (itemOrDisplayText, menuItems) => {
    return menuItems.find((item) => item.value === itemOrDisplayText);
};

describe('field-picker', () => {
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    it('defaults requiredness to false', () => {
        const fieldPicker = setupComponentUnderTest();
        const baseResourcePicker = fieldPicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        expect(baseResourcePicker.comboboxConfig.required).toBe(false);
    });
    it('sets requiredness to true', () => {
        const fieldPicker = setupComponentUnderTest({
            required: true
        });
        const baseResourcePicker = fieldPicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        expect(baseResourcePicker.comboboxConfig.required).toBe(true);
    });
    it('sets label', () => {
        const label = 'label';
        const fieldPicker = setupComponentUnderTest({
            label
        });
        const baseResourcePicker = fieldPicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        expect(baseResourcePicker.comboboxConfig.label).toBe(label);
    });
    it('sets placeholder', () => {
        const placeholder = 'placeholder';
        const fieldPicker = setupComponentUnderTest({
            placeholder
        });
        const baseResourcePicker = fieldPicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        expect(baseResourcePicker.comboboxConfig.placeholder).toBe(placeholder);
    });
    it('defaults isPillSupported to false', () => {
        const placeholder = 'isPillSupported';
        const fieldPicker = setupComponentUnderTest();
        const baseResourcePicker = fieldPicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        expect(baseResourcePicker.isPillSupported).toBe(false);
    });
    it('sets error message', () => {
        const errorMessage = 'bah humbug';
        const fieldPicker = setupComponentUnderTest({
            errorMessage
        });
        const baseResourcePicker = fieldPicker.shadowRoot.querySelector(BaseResourcePicker.SELECTOR);
        expect(baseResourcePicker.errorMessage).toBe(errorMessage);
    });
    it('populates menuData with passed in fields', () => {
        const fields = ['field'];
        isLookupTraversalSupported.mockImplementation(() => true);
        setupComponentUnderTest({
            fields
        });
        expect(filterFieldsForChosenElement).toHaveBeenCalledWith(null, fields, {
            showAsFieldReference: false,
            showSubText: true,
            allowSObjectFieldsTraversal: true
        });
    });
    it('populates menuData with passed in fields no traversal support', () => {
        const fields = ['field'];
        isLookupTraversalSupported.mockImplementation(() => false);
        setupComponentUnderTest({
            fields
        });
        expect(filterFieldsForChosenElement).toHaveBeenCalledWith(null, fields, {
            showAsFieldReference: false,
            showSubText: true,
            allowSObjectFieldsTraversal: false
        });
    });

    it('populates menuData with columns from an Sobject and sets the value to a string that represents a menu option successfully', () => {
        const fieldPicker = setupComponentUnderTest();
        fieldPicker.fields = mockAccountFields;
        fieldPicker.value = 'AccountNumber';

        expect(fieldPicker.value).toStrictEqual(findMenuItem('AccountNumber', menuItems));
    });

    it('populates menuData with columns from an Sobject and sets the value to an account MenuItem successfully', () => {
        const fieldPicker = setupComponentUnderTest();
        fieldPicker.fields = mockAccountFields;
        fieldPicker.value = mockAccountFields.BillingAddress;

        expect(fieldPicker.value).toStrictEqual(mockAccountFields.BillingAddress);
    });

    it('populates menuData with columns from an Sobject and sets the value to a value not in the menu without erroring', () => {
        const fieldPicker = setupComponentUnderTest();
        fieldPicker.fields = mockAccountFields;
        fieldPicker.value = 'random';

        expect(fieldPicker.value).toStrictEqual('random');
    });

    it('does not attempt to process menu data if no fields are passed', () => {
        setupComponentUnderTest();
        expect(filterFieldsForChosenElement).not.toHaveBeenCalled();
    });
});
