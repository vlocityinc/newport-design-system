import { createElement } from 'lwc';
import { getShadowRoot } from 'lwc-test-utils';
import PicklistChoiceSetEditor from '../picklistChoiceSetEditor';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { picklistChoiceSetReducer } from '../picklistChoiceSetReducer';
import { PropertyChangedEvent, ValueChangedEvent } from 'builder_platform_interaction/events';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { hydrateWithErrors } from 'builder_platform_interaction/dataMutationLib';

const SELECTORS = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    ENTITY_RESOURCE_PICKER: 'builder_platform_interaction-entity-resource-picker',
    DATA_TYPE_PICKER: 'builder_platform_interaction-data-type-picker',
    FIELD_PICKER: 'builder_platform_interaction-field-picker'
};

const setupComponentUnderTest = (picklistChoiceObject) => {
    const element = createElement('builder_platform_interaction-picklist-choice-set-editor', {
        is: PicklistChoiceSetEditor,
    });
    element.node = picklistChoiceObject;
    document.body.appendChild(element);
    return element;
};

jest.mock('builder_platform_interaction/actions', () => {
    return {
        createAction: jest.fn().mockImplementation((type, payload) => payload),
        PROPERTY_EDITOR_ACTION: require.requireActual('builder_platform_interaction/actions').PROPERTY_EDITOR_ACTION,
    };
});

// helps remove dependency of the editor tests on the reducer functionality
jest.mock('../picklistChoiceSetReducer', () => {
    return {
        picklistChoiceSetReducer: jest.fn().mockImplementation(((obj) => Object.assign({}, obj))),
    };
});

jest.mock('builder_platform_interaction/sobjectLib', () => {
    const sobjectLib = require.requireActual('builder_platform_interaction/sobjectLib');
    const mockSobjectLib = Object.assign({}, sobjectLib);
    mockSobjectLib.fetchFieldsForEntity = jest.fn().mockResolvedValue();
    return mockSobjectLib;
});

const newPicklistObjectOrField = {item: {value: 'Contact'}, displayText: 'contact', error: null};

function getComboboxStateChangedEvent() {
    return new CustomEvent('comboboxstatechanged', {
        detail: newPicklistObjectOrField,
    });
}

describe('picklist-choice-set-editor', () => {
    const picklistChoiceObject = {
        elementType: 'PICKLIST_CHOICE_SET',
        guid: 'guid_1',
        name: {
            value: 'picklistChoice1',
            error: null
        },
        description: {
            value: 'This is picklist choice',
            error: null
        },
        picklistObject: {
            value: 'Account',
            error: null
        },
        dataType: {
            value: 'Picklist',
            error: null
        },
        picklistField: {
            value: 'AccountSource',
            error: null
        },
        sortOrder: {
            value: 'Asc',
            error: null
        }
    };

    describe('Label description component', () => {
        let picklistChoiceEditor;
        let labelDescription;
        beforeEach(() => {
            picklistChoiceEditor = setupComponentUnderTest(picklistChoiceObject);
            labelDescription = getShadowRoot(picklistChoiceEditor).querySelector(SELECTORS.LABEL_DESCRIPTION);
        });

        it('Label-Description should be defined', () => {
            expect(labelDescription).not.toBeNull();
        });

        it('Devname should be same as the name of the picklistChoiceObject', () => {
            expect(labelDescription.devName).toEqual(picklistChoiceObject.name);
        });

        it('Description should be same as the description of the picklistChoiceObject', () => {
            expect(labelDescription.description).toEqual(picklistChoiceObject.description);
        });

        it('Handles the property changed event and updates the property', () => {
            const event = new PropertyChangedEvent('description', 'new desc', null);
            getShadowRoot(picklistChoiceEditor).querySelector('builder_platform_interaction-label-description').dispatchEvent(event);
            expect(createAction).toHaveBeenCalledWith(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
                propertyName: 'description',
                value: 'new desc',
                error: null,
                doValidateProperty: true
            });
        });
    });

    describe('Entity-Resource-Picker for Picklist Object', () => {
        let picklistChoiceEditor;
        let entityResourcePicker;
        beforeEach(() => {
            picklistChoiceEditor = setupComponentUnderTest(picklistChoiceObject);
            entityResourcePicker = getShadowRoot(picklistChoiceEditor).querySelector(SELECTORS.ENTITY_RESOURCE_PICKER);
        });

        it('entity-resource-picker should be defined', () => {
            expect(entityResourcePicker).not.toBeNull();
        });

        it('Changing value in entity-resource-picker should update picklistObject', () => {
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(createAction.mock.calls[0][1]).toEqual({
                propertyName: 'picklistObject',
                value: 'Contact',
                error: null,
                doValidateProperty: true
            });
        });

        it('Changing value in entity-resource-picker should call getFieldsForEntity', () => {
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(fetchFieldsForEntity).toHaveBeenCalledTimes(2);
        });

        it('Changing value in entity-resource-picker should update picklistField', () => {
            entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(createAction.mock.calls[1][1]).toEqual({
                propertyName: 'picklistField',
                value: null,
                error: null,
                doValidateProperty: false
            });
        });
    });

    describe('Data-Type-Picker', () => {
        let picklistChoiceEditor;
        let dataTypePicker;
        beforeEach(() => {
            picklistChoiceEditor = setupComponentUnderTest(picklistChoiceObject);
            dataTypePicker = getShadowRoot(picklistChoiceEditor).querySelector(SELECTORS.DATA_TYPE_PICKER);
        });

        const dispatchValueChangedEvent = (payload) => {
            const mockChangeEvent = new ValueChangedEvent(payload);
            dataTypePicker.dispatchEvent(mockChangeEvent);
        };

        it('data-type-picker should be defined', () => {
            expect(dataTypePicker).not.toBeNull();
        });

        it('data-type-picker should have two options', () => {
            const dataTypeCombobox = getShadowRoot(dataTypePicker).querySelector('lightning-combobox');
            expect(dataTypeCombobox.options).toHaveLength(2);
        });

        it('Handles value change event when data type option is selected', () => {
            dispatchValueChangedEvent({ dataType : 'MultiPicklist' });
            expect(createAction).toHaveBeenCalledWith(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
                propertyName : 'dataType',
                value: 'MultiPicklist',
                error: null,
                doValidateProperty: true
            });
        });

        it('Changing value in data-type-picker should update picklistField', () => {
            dispatchValueChangedEvent({ dataType : 'MultiPicklist' });
            expect(createAction.mock.calls[1][1]).toEqual({
                propertyName: 'picklistField',
                value: null,
                error: null,
                doValidateProperty: false
            });
        });
    });

    describe('Picklist Field Options', () => {
        let picklistChoiceEditor;
        let fieldPicker;
        beforeEach(() => {
            const hydratedPicklistObject = hydrateWithErrors(picklistChoiceObject, ['guid', 'elementType']);
            picklistChoiceEditor = setupComponentUnderTest(hydratedPicklistObject);
            fieldPicker = getShadowRoot(picklistChoiceEditor).querySelector(SELECTORS.FIELD_PICKER);
        });

        it('fieldPicker should be defined', () => {
            expect(fieldPicker).not.toBeNull();
        });

        it('Changing value in field-picker should update picklistField', () => {
            fieldPicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(createAction.mock.calls[0][1]).toEqual({
                propertyName: 'picklistField',
                value: 'Contact',
                error: null,
                doValidateProperty: true
            });
        });
    });

    describe('Sort Order', () => {
        let picklistChoiceEditor;
        let sortOrderCombobox;
        beforeEach(() => {
            const hydratedPicklistObject = hydrateWithErrors(picklistChoiceObject, ['guid', 'elementType']);
            picklistChoiceEditor = setupComponentUnderTest(hydratedPicklistObject);
            sortOrderCombobox = getShadowRoot(picklistChoiceEditor).querySelector('lightning-combobox');
        });

        it('Sort Order Combobox should be defined', () => {
            expect(sortOrderCombobox).not.toBeNull();
        });

        it('Sort Order Combobox should have three options', () => {
            expect(sortOrderCombobox.options).toHaveLength(3);
        });

        it('Ascending should be the selected sortOrder', () => {
            const sortOrderComboboxChangeEvent = new CustomEvent('change', {detail: {value: 'Desc'}});
            sortOrderCombobox.dispatchEvent(sortOrderComboboxChangeEvent);
            expect(createAction.mock.calls[0][1]).toEqual({
                propertyName: 'sortOrder',
                value: 'Desc',
                error: null,
                doValidateProperty: true
            });
        });
    });

    describe('Validation', () => {
        it('Calls reducer with validate all event', () => {
            const hydratedPicklistObject = hydrateWithErrors(picklistChoiceObject, ['guid', 'elementType']);
            const picklistChoiceEditor = setupComponentUnderTest(hydratedPicklistObject);
            picklistChoiceEditor.validate();
            expect(picklistChoiceSetReducer.mock.calls[0][1]).toEqual({type: VALIDATE_ALL});
        });
    });
});