// @ts-nocheck
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import * as apexTypeLib from 'builder_platform_interaction/apexTypeLib';
import {
    INTERACTION_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { hydrateWithErrors } from 'builder_platform_interaction/dataMutationLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import {
    ComboboxStateChangedEvent,
    PropertyChangedEvent,
    ValueChangedEvent
} from 'builder_platform_interaction/events';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { createElement } from 'lwc';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import CollectionChoiceSetEditor from '../collectionChoiceSetEditor';
import { collectionChoiceSetReducer } from '../collectionChoiceSetReducer';

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    DISPLAY_FIELD: '.test-display-field',
    VALUE_FIELD: '.test-value-field'
};

const VARIABLE = 'VARIABLE_GUID';
const IAMERRORED = 'IAMERRORED';

const MENU_ITEM: UI.ComboboxItem = {
    iconSize: 'size',
    dataType: FLOW_DATA_TYPE.SOBJECT.value,
    type: 'type',
    displayText: 'displayText',
    value: 'value'
};

const MENU_ITEM_APEX: UI.ComboboxItem = {
    iconSize: 'size',
    dataType: FLOW_DATA_TYPE.APEX.value,
    type: 'type',
    displayText: 'displayText',
    value: 'value'
};

jest.mock('builder_platform_interaction/fieldPicker', () => require('builder_platform_interaction_mocks/fieldPicker'));

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/actions', () => {
    return {
        createAction: jest.fn().mockImplementation((type, payload = {}) => ({ type, payload })),
        PROPERTY_EDITOR_ACTION: jest.requireActual('builder_platform_interaction/actions').PROPERTY_EDITOR_ACTION
    };
});
// helps remove dependency of the editor tests on the reducer functionality
jest.mock('../collectionChoiceSetReducer', () => {
    return {
        collectionChoiceSetReducer: jest.fn().mockImplementation((collectionChoice, action) => {
            if (action.type === 'UPDATE_ELEMENT_PROPERTY' && action.payload.propertyName === 'collectionReference') {
                const base = {
                    guid: '8828cb76-9deb-4765-bba0-b3291b1303ea',
                    name: {
                        value: 'collectionChoiceSet',
                        error: null
                    },
                    description: {
                        value: '',
                        error: null
                    },
                    displayField: {
                        value: 'Name',
                        error: null
                    },
                    valueField: {
                        value: 'Name',
                        error: null
                    },
                    dataType: {
                        value: 'String',
                        error: null
                    },
                    elementType: 'CollectionChoiceSet',
                    collectionReferenceIndex: {
                        value: 'c2da2c2d-1e2c-4f1b-b46c-cc55d947e29f',
                        error: null
                    },
                    collectionReference: {
                        value: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
                        error: null
                    }
                };

                return Object.assign(base, collectionChoice, {
                    [action.payload.propertyName]: {
                        error: action.payload.error,
                        value: action.payload.value
                    }
                });
            }
            return Object.assign({}, collectionChoice);
        })
    };
});

const mockAccountFieldsPromise = Promise.resolve(accountFields);
jest.mock('builder_platform_interaction/sobjectLib', () => {
    const sobjectLib = jest.requireActual('builder_platform_interaction/sobjectLib');
    const mockSobjectLib = Object.assign({}, sobjectLib);
    mockSobjectLib.fetchFieldsForEntity = jest.fn().mockImplementation(() => mockAccountFieldsPromise);
    return mockSobjectLib;
});

const mockReturnValue = {
    myString: {
        apiName: 'myString',
        dataType: 'String',
        isCollection: false,
        apexClass: 'mockApexClass'
    },
    myBoolean: {
        apiName: 'myBoolean',
        dataType: 'Boolean',
        isCollection: false,
        apexClass: 'mockApexClass'
    },
    myCurrency: {
        apiName: 'myCurrency',
        dataType: 'Currency',
        isCollection: false,
        apexClass: 'mockApexClass'
    },
    myNumber: {
        apiName: 'myNumber',
        dataType: 'Number',
        isCollection: false,
        apexClass: 'mockApexClass'
    },
    myApexDefined: {
        apiName: 'myApexDefined',
        dataType: 'Apex',
        subtype: 'mockInnerApexClass',
        isCollection: false,
        apexClass: 'mockApexClass'
    }
};

jest.mock('builder_platform_interaction/apexTypeLib', () => {
    const apexTypeLib = jest.requireActual('builder_platform_interaction/apexTypeLib');
    const mockApexTypeLib = Object.assign({}, apexTypeLib);
    mockApexTypeLib.getPropertiesForClass = jest.fn().mockImplementation(() => mockReturnValue);
    return mockApexTypeLib;
});

jest.mock('builder_platform_interaction/referenceToVariableUtil', () => {
    return {
        getVariableOrField: jest.fn().mockImplementation((collRef) => {
            if (collRef) {
                return {
                    subtype: 'Account',
                    dataType: 'SObject'
                };
            }
            return {};
        })
    };
});

const newCollectionObjectOrField = {
    item: { value: 'Contact' },
    displayText: 'contact',
    error: null
};

function getComboboxStateChangedEvent() {
    return new CustomEvent('comboboxstatechanged', {
        detail: newCollectionObjectOrField
    });
}

const getFerovResourcePicker = (collectionChoiceSetElement) => {
    return collectionChoiceSetElement.shadowRoot.querySelector(SELECTORS.FEROV_RESOURCE_PICKER);
};

const dispatchComboBoxEvent = (collectionChoiceEditor, menuEventObj, displayText, error) => {
    const event = new ComboboxStateChangedEvent(menuEventObj, displayText, error);
    getFerovResourcePicker(collectionChoiceEditor).dispatchEvent(event);
};

const setupComponentUnderTest = (collectionChoiceObject) => {
    const element = createElement('builder_platform_interaction-collection-choice-set-editor', {
        is: CollectionChoiceSetEditor
    });
    element.node = collectionChoiceObject;
    setDocumentBodyChildren(element);
    return element;
};

describe('collection-choice-set-editor', () => {
    let collectionChoiceObject, collectionChoiceEditor;

    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });

    beforeEach(() => {
        const collectionChoiceSetElement = getElementByDevName('ccs_getAccAutowFieldsNfilters');
        collectionChoiceObject = getElementForPropertyEditor(collectionChoiceSetElement);
        collectionChoiceEditor = setupComponentUnderTest(collectionChoiceObject);
    });

    describe('label description component', () => {
        let labelDescription;
        beforeEach(() => {
            labelDescription = collectionChoiceEditor.shadowRoot.querySelector(SELECTORS.LABEL_DESCRIPTION);
        });

        it('label-description should be defined', () => {
            expect(labelDescription).not.toBeNull();
        });

        it('devname should be same as the name of the collectionChoiceObject', () => {
            expect(labelDescription.devName).toEqual(collectionChoiceObject.name);
        });

        it('description should be same as the description of the collectionChoiceObject', () => {
            expect(labelDescription.description).toEqual(collectionChoiceObject.description);
        });

        it('handles the property changed event and updates the property', () => {
            const event = new PropertyChangedEvent('description', 'new desc', null);
            collectionChoiceEditor.shadowRoot
                .querySelector('builder_platform_interaction-label-description')
                .dispatchEvent(event);
            expect(createAction).toHaveBeenCalledWith(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
                propertyName: 'description',
                value: 'new desc',
                error: null,
                doValidateProperty: true
            });
        });
    });

    describe('handles events', () => {
        it('handles the combobox value changed event and updates the property', async () => {
            const A_MENU_ITEM = { ...MENU_ITEM };
            A_MENU_ITEM.value = VARIABLE;
            A_MENU_ITEM.subType = 'Contact';
            dispatchComboBoxEvent(collectionChoiceEditor, A_MENU_ITEM, VARIABLE, null);
            await ticks(1);
            expect(collectionChoiceEditor.node.collectionReference.value).toBe(VARIABLE);
            expect(collectionChoiceEditor.node.collectionReference.error).toBe(null);
        });

        it('handles the collection value and error message is updated', async () => {
            const A_MENU_ITEM = { ...MENU_ITEM };
            A_MENU_ITEM.value = VARIABLE;
            dispatchComboBoxEvent(collectionChoiceEditor, A_MENU_ITEM, VARIABLE, IAMERRORED);
            await ticks(1);
            expect(collectionChoiceEditor.node.collectionReference.value).toBe(VARIABLE);
            expect(collectionChoiceEditor.node.collectionReference.error).toBe(IAMERRORED);
        });
    });

    describe('collection resource picker', () => {
        let ferovResourcePicker, A_MENU_ITEM, A_MENU_ITEM_APEX;
        beforeEach(() => {
            A_MENU_ITEM = { ...MENU_ITEM };
            A_MENU_ITEM.subtype = 'Contact';
            A_MENU_ITEM_APEX = { ...MENU_ITEM_APEX };
            A_MENU_ITEM_APEX.subtype = 'ApexClass';
            ferovResourcePicker = getFerovResourcePicker(collectionChoiceEditor);
        });
        it('ferov-resource-picker should be defined', () => {
            expect(ferovResourcePicker).not.toBeNull();
        });

        it('changing value in ferov-resource-picker should update object', () => {
            ferovResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(createAction.mock.calls[0][1]).toEqual({
                propertyName: 'collectionReference',
                value: 'Contact',
                error: null,
                doValidateProperty: true
            });
        });

        it('changing value in ferov-resource-picker should NOT call apexTypeLib.getPropertiesForClass when SObject', async () => {
            apexTypeLib.getPropertiesForClass.mockClear();
            dispatchComboBoxEvent(collectionChoiceEditor, A_MENU_ITEM, VARIABLE, null);
            expect(apexTypeLib.getPropertiesForClass).toHaveBeenCalledTimes(0);
        });

        it('changing value in ferov-resource-picker should call getFieldsForEntity when SObject', async () => {
            fetchFieldsForEntity.mockClear();
            dispatchComboBoxEvent(collectionChoiceEditor, A_MENU_ITEM, VARIABLE, null);
            expect(fetchFieldsForEntity).toHaveBeenCalledTimes(1);
        });

        it('changing value in ferov-resource-picker should NOT call getFieldsForEntity when Apex Defined', async () => {
            fetchFieldsForEntity.mockClear();
            dispatchComboBoxEvent(collectionChoiceEditor, A_MENU_ITEM_APEX, VARIABLE, null);
            expect(fetchFieldsForEntity).toHaveBeenCalledTimes(0);
        });

        it('changing value in ferov-resource-picker should call apexTypeLib.getPropertiesForClass when Apex Defined', async () => {
            apexTypeLib.getPropertiesForClass.mockClear();
            dispatchComboBoxEvent(collectionChoiceEditor, A_MENU_ITEM_APEX, VARIABLE, null);
            expect(apexTypeLib.getPropertiesForClass).toHaveBeenCalledTimes(1);
        });

        it('changing value in ferov-resource-picker should update display field', () => {
            const event = new ComboboxStateChangedEvent(A_MENU_ITEM, VARIABLE, null);
            getFerovResourcePicker(collectionChoiceEditor).dispatchEvent(event);

            expect(createAction.mock.calls[1][1]).toEqual({
                propertyName: 'displayField',
                value: null,
                error: null,
                doValidateProperty: false
            });
        });

        it('changing value in ferov-resource-picker should update value field', () => {
            dispatchComboBoxEvent(collectionChoiceEditor, A_MENU_ITEM, VARIABLE, null);

            expect(createAction.mock.calls[2][1]).toEqual({
                propertyName: 'valueField',
                value: null,
                error: null,
                doValidateProperty: false
            });
        });
    });

    describe('choice value field picker', () => {
        let fieldPicker, A_MENU_ITEM_APEX;
        beforeEach(() => {
            fieldPicker = collectionChoiceEditor.shadowRoot.querySelector(SELECTORS.FIELD_PICKER);
            A_MENU_ITEM_APEX = { ...MENU_ITEM_APEX };
            A_MENU_ITEM_APEX.subtype = 'ApexClass';
        });

        it('field-picker should be defined', () => {
            expect(fieldPicker).not.toBeNull();
        });

        it('field-picker fields should be defined', () => {
            expect(Object.keys(fieldPicker.fields)).toHaveLength(Object.keys(accountFields).length);
        });

        it('non primitive field types should be filtered out for ApexDefinedType', async () => {
            dispatchComboBoxEvent(collectionChoiceEditor, A_MENU_ITEM_APEX, VARIABLE, null);
            await ticks(1);
            expect(Object.keys(fieldPicker.fields)).toEqual([
                mockReturnValue.myString.apiName,
                mockReturnValue.myBoolean.apiName,
                mockReturnValue.myCurrency.apiName,
                mockReturnValue.myNumber.apiName
            ]);
        });
    });

    describe('second-section', () => {
        let displayField, dataTypePicker, valueField;

        describe('displayField', () => {
            describe('without object field filled', () => {
                it('display field is undefined', () => {
                    collectionChoiceObject.collectionReference.value = null;
                    collectionChoiceEditor = setupComponentUnderTest(collectionChoiceObject);
                    displayField = collectionChoiceEditor.shadowRoot.querySelector(SELECTORS.DISPLAY_FIELD);
                    expect(displayField).toBeNull();
                });
            });

            describe('with object field filled', () => {
                beforeEach(() => {
                    displayField = collectionChoiceEditor.shadowRoot.querySelector(SELECTORS.DISPLAY_FIELD);
                });

                it('display field should be defined', () => {
                    expect(displayField).not.toBeNull();
                });
                it('changing value in displayField field-picker should update display field value', () => {
                    displayField.dispatchEvent(getComboboxStateChangedEvent());
                    expect(createAction.mock.calls[0][1]).toEqual({
                        propertyName: 'displayField',
                        value: 'Contact',
                        error: null,
                        doValidateProperty: true
                    });
                });
            });
        });

        describe('dataType', () => {
            describe('without object field filled', () => {
                it('datatype picker is undefined', () => {
                    collectionChoiceObject.collectionReference.value = null;
                    collectionChoiceEditor = setupComponentUnderTest(collectionChoiceObject);
                    dataTypePicker = collectionChoiceEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE_PICKER);
                    expect(dataTypePicker).toBeNull();
                });
            });
            describe('with object field filled', () => {
                beforeEach(() => {
                    dataTypePicker = collectionChoiceEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE_PICKER);
                });

                const dispatchValueChangedEvent = (payload) => {
                    const mockChangeEvent = new ValueChangedEvent(payload);
                    dataTypePicker.dispatchEvent(mockChangeEvent);
                };

                it('datatype picker should be defined', () => {
                    expect(dataTypePicker).not.toBeNull();
                });

                it('datatype picker should have five options', () => {
                    const dataTypeCombobox = dataTypePicker.shadowRoot.querySelector('lightning-combobox');
                    expect(dataTypeCombobox.options).toHaveLength(5);
                });

                it('handles value change event when data type option is selected', () => {
                    dispatchValueChangedEvent({ dataType: 'Number' });
                    expect(createAction).toHaveBeenCalledWith(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
                        propertyName: 'dataType',
                        value: 'Number',
                        error: null,
                        doValidateProperty: true
                    });
                });

                it('changing value in datatype picker should update value field', () => {
                    dispatchValueChangedEvent({ dataType: 'Number' });
                    expect(createAction.mock.calls[1][1]).toEqual({
                        propertyName: 'valueField',
                        value: null,
                        error: null,
                        doValidateProperty: false
                    });
                });
            });
        });

        describe('valueField', () => {
            describe('whithout object field filled', () => {
                it('value field is undefined', () => {
                    collectionChoiceObject.collectionReference.value = null;
                    collectionChoiceEditor = setupComponentUnderTest(collectionChoiceObject);
                    valueField = collectionChoiceEditor.shadowRoot.querySelector(SELECTORS.VALUE_FIELD);
                    expect(valueField).toBeNull();
                });
            });

            describe('with object field filled', () => {
                beforeEach(() => {
                    valueField = collectionChoiceEditor.shadowRoot.querySelector(SELECTORS.VALUE_FIELD);
                });

                it('value field should be defined', () => {
                    expect(valueField).not.toBeNull();
                });

                it('changing value in value field field-picker should update value field value', () => {
                    valueField.dispatchEvent(getComboboxStateChangedEvent());
                    expect(createAction.mock.calls[0][1]).toEqual({
                        propertyName: 'valueField',
                        value: 'Contact',
                        error: null,
                        doValidateProperty: true
                    });
                });
            });
        });
    });

    describe('validation', () => {
        it('calls reducer with validate all event', () => {
            const hydratedCollectionChoiceObject = hydrateWithErrors(collectionChoiceObject, ['guid', 'elementType']);
            collectionChoiceEditor = setupComponentUnderTest(hydratedCollectionChoiceObject);
            collectionChoiceEditor.validate();
            expect(collectionChoiceSetReducer.mock.calls[0][1]).toEqual({
                showSecondSection: true,
                type: VALIDATE_ALL
            });
        });
    });
});
