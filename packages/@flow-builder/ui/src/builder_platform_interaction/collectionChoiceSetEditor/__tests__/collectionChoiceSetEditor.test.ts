// @ts-nocheck
import { createElement } from 'lwc';
import CollectionChoiceSetEditor from '../collectionChoiceSetEditor';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    PropertyChangedEvent,
    ValueChangedEvent,
    ComboboxStateChangedEvent
} from 'builder_platform_interaction/events';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { hydrateWithErrors } from 'builder_platform_interaction/dataMutationLib';
import { collectionChoiceSetReducer } from '../collectionChoiceSetReducer';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import {
    setDocumentBodyChildren,
    ticks,
    INTERACTION_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/fieldPicker', () => require('builder_platform_interaction_mocks/fieldPicker'));

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    DISPLAY_FIELD: '.test-display-field',
    VALUE_FIELD: '.test-value-field',
    COLLECTION_VARIABLE_FEROV_RESOURCE_PICKER: '.test-collection'
};

const VARIABLE = 'VARIABLE_GUID';
const IAMERRORED = 'IAMERRORED';

const MENU_ITEM: UI.ComboboxItem = {
    iconSize: 'size',
    dataType: 'dataType',
    type: 'type',
    displayText: 'displayText',
    value: 'value'
};

const setupComponentUnderTest = (collectionChoiceObject) => {
    const element = createElement('builder_platform_interaction-collection-choice-set-editor', {
        is: CollectionChoiceSetEditor
    });
    element.node = collectionChoiceObject;
    setDocumentBodyChildren(element);
    return element;
};
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

jest.mock('builder_platform_interaction/storeUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/storeUtils');
    return {
        getElementByGuid: jest.fn().mockImplementation((collRef) => {
            if (collRef) {
                return {
                    subtype: 'Account'
                };
            }
            return {};
        }),
        isDevNameInStore: jest.fn(),
        getTriggerType: jest.fn(),
        getElementByDevName: actual.getElementByDevName
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

const getVariableFerovResourcePicker = (collectionChoiceSetElement) => {
    return collectionChoiceSetElement.shadowRoot.querySelector(SELECTORS.COLLECTION_VARIABLE_FEROV_RESOURCE_PICKER);
};

const dispatchComboBoxEvent = (collectionChoiceEditor, menuEventObj, displayText, error) => {
    const event = new ComboboxStateChangedEvent(menuEventObj, displayText, error);
    getVariableFerovResourcePicker(collectionChoiceEditor).dispatchEvent(event);
};
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

describe('collection-choice-set-editor', () => {
    let collectionChoiceObject, collectionChoiceEditor;

    // TDOO: per W-10089060 let's move to the offical mockData in the near future
    const collectionChoiceObjectAsIfFromStore = {
        guid: '8828cb76-9deb-4765-bba0-b3291b1303e6',
        name: 'collectionChoiceSet',
        description: '',
        limit: '',
        displayField: 'Name',
        valueField: 'Id',
        dataType: 'String',
        sortOrder: 'NotSorted',
        elementType: 'CollectionChoiceSet',
        collectionReferenceIndex: '8da17fa9-310c-41d0-af09-f9bd81fc0c17',
        collectionReference: '9b2579d0-01d3-45b0-b6b2-bb016b085511'
    };

    const collectionChoiceObjectWithoutCollectionReference = {
        elementType: ELEMENT_TYPE.COLLECTION_CHOICE_SET,
        guid: 'guid1',
        name: {
            value: 'collectionChoice1',
            error: null
        },
        description: {
            value: 'This is collection choice',
            error: null
        },
        collectionReference: {
            value: null,
            error: null
        }
    };

    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    beforeEach(() => {
        collectionChoiceObject = getElementForPropertyEditor(collectionChoiceObjectAsIfFromStore);
        collectionChoiceEditor = setupComponentUnderTest(collectionChoiceObject);
    });

    describe('Label description component', () => {
        let labelDescription;
        beforeEach(() => {
            labelDescription = collectionChoiceEditor.shadowRoot.querySelector(SELECTORS.LABEL_DESCRIPTION);
        });

        it('Label-Description should be defined', () => {
            expect(labelDescription).not.toBeNull();
        });

        it('Devname should be same as the name of the collectionChoiceObject', () => {
            expect(labelDescription.devName).toEqual(collectionChoiceObject.name);
        });

        it('Description should be same as the description of the collectionChoiceObject', () => {
            expect(labelDescription.description).toEqual(collectionChoiceObject.description);
        });

        it('Handles the property changed event and updates the property', () => {
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

    it('Collection handles the combobox value changed event and updates the property', async () => {
        const A_MENU_ITEM = { ...MENU_ITEM };
        A_MENU_ITEM.value = VARIABLE;
        A_MENU_ITEM.subType = 'Contact';

        Promise.resolve().then(() => {
            dispatchComboBoxEvent(collectionChoiceEditor, A_MENU_ITEM, VARIABLE, null);
        });

        await ticks(1);
        expect(collectionChoiceEditor.node.collectionReference.value).toBe(VARIABLE);
        expect(collectionChoiceEditor.node.collectionReference.error).toBe(null);
    });

    it('handles the collection value and error message is updated', async () => {
        const A_MENU_ITEM = { ...MENU_ITEM };
        A_MENU_ITEM.value = VARIABLE;

        Promise.resolve().then(() => {
            dispatchComboBoxEvent(collectionChoiceEditor, A_MENU_ITEM, VARIABLE, IAMERRORED);
        });
        await ticks(1);
        expect(collectionChoiceEditor.node.collectionReference.value).toBe(VARIABLE);
        expect(collectionChoiceEditor.node.collectionReference.error).toBe(IAMERRORED);
    });

    describe('Ferov-Resource-Picker for Collection Choice Object', () => {
        let ferovResourcePicker, A_MENU_ITEM;
        beforeEach(() => {
            A_MENU_ITEM = { ...MENU_ITEM };
            A_MENU_ITEM.subtype = 'Contact';
            ferovResourcePicker = collectionChoiceEditor.shadowRoot.querySelector(
                SELECTORS.COLLECTION_VARIABLE_FEROV_RESOURCE_PICKER
            );
        });

        it('ferov-resource-picker should be defined', () => {
            expect(ferovResourcePicker).not.toBeNull();
        });

        it('Changing value in ferov-resource-picker should update object', () => {
            ferovResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
            expect(createAction.mock.calls[0][1]).toEqual({
                propertyName: 'collectionReference',
                value: 'Contact',
                error: null,
                doValidateProperty: true
            });
        });

        it('Changing value in ferov-resource-picker should call getFieldsForEntity', async () => {
            fetchFieldsForEntity.mockClear();
            dispatchComboBoxEvent(collectionChoiceEditor, A_MENU_ITEM, VARIABLE, null);
            expect(fetchFieldsForEntity).toHaveBeenCalledTimes(1);
        });

        it('Changing value in ferov-resource-picker should update displayField', () => {
            const event = new ComboboxStateChangedEvent(A_MENU_ITEM, VARIABLE, null);
            getVariableFerovResourcePicker(collectionChoiceEditor).dispatchEvent(event);

            expect(createAction.mock.calls[1][1]).toEqual({
                propertyName: 'displayField',
                value: null,
                error: null,
                doValidateProperty: false
            });
        });

        it('Changing value in ferov-resource-picker should update valueField', () => {
            dispatchComboBoxEvent(collectionChoiceEditor, A_MENU_ITEM, VARIABLE, null);

            expect(createAction.mock.calls[2][1]).toEqual({
                propertyName: 'valueField',
                value: null,
                error: null,
                doValidateProperty: false
            });
        });
    });

    describe('Choice Value Field Picker', () => {
        let fieldPicker;
        beforeEach(() => {
            fieldPicker = collectionChoiceEditor.shadowRoot.querySelector(SELECTORS.FIELD_PICKER);
        });

        it('field-picker should be defined', () => {
            expect(fieldPicker).not.toBeNull();
        });

        it('field-picker fields should be defined', () => {
            expect(Object.keys(fieldPicker.fields)).toHaveLength(Object.keys(accountFields).length);
        });
    });

    describe('second-section', () => {
        let displayField, dataTypePicker, valueField;

        describe('choice-template-section', () => {
            describe('displayField', () => {
                describe('without object field filled', () => {
                    collectionChoiceEditor = setupComponentUnderTest(collectionChoiceObjectWithoutCollectionReference);
                    displayField = collectionChoiceEditor.shadowRoot.querySelector(SELECTORS.DISPLAY_FIELD);
                    it('Display Field is undefined', () => {
                        expect(displayField).toBeNull();
                    });
                });

                describe('with object field filled', () => {
                    beforeEach(() => {
                        collectionChoiceEditor = setupComponentUnderTest(collectionChoiceObject);
                        displayField = collectionChoiceEditor.shadowRoot.querySelector(SELECTORS.DISPLAY_FIELD);
                    });

                    it('Display Field should be defined', () => {
                        expect(displayField).not.toBeNull();
                    });

                    it('Changing value in displayField field-picker should update displayField value', () => {
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
                    collectionChoiceEditor = setupComponentUnderTest(collectionChoiceObjectWithoutCollectionReference);
                    dataTypePicker = collectionChoiceEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE_PICKER);

                    it('Data type Picker is undefined', () => {
                        expect(dataTypePicker).toBeNull();
                    });
                });
                describe('with object field filled', () => {
                    beforeEach(() => {
                        collectionChoiceEditor = setupComponentUnderTest(collectionChoiceObject);
                        dataTypePicker = collectionChoiceEditor.shadowRoot.querySelector(SELECTORS.DATA_TYPE_PICKER);
                    });

                    const dispatchValueChangedEvent = (payload) => {
                        const mockChangeEvent = new ValueChangedEvent(payload);
                        dataTypePicker.dispatchEvent(mockChangeEvent);
                    };

                    it('Datatype Picker should be defined', () => {
                        expect(dataTypePicker).not.toBeNull();
                    });

                    it('Datatype Picker should have five options', () => {
                        const dataTypeCombobox = dataTypePicker.shadowRoot.querySelector('lightning-combobox');
                        expect(dataTypeCombobox.options).toHaveLength(5);
                    });

                    it('Handles value change event when data type option is selected', () => {
                        dispatchValueChangedEvent({ dataType: 'Number' });
                        expect(createAction).toHaveBeenCalledWith(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
                            propertyName: 'dataType',
                            value: 'Number',
                            error: null,
                            doValidateProperty: true
                        });
                    });

                    it('Changing value in Datatype Picker should update valueField', () => {
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
                    collectionChoiceEditor = setupComponentUnderTest(collectionChoiceObjectWithoutCollectionReference);
                    valueField = collectionChoiceEditor.shadowRoot.querySelector(SELECTORS.VALUE_FIELD);
                    it('Display Field is undefined', () => {
                        expect(valueField).toBeNull();
                    });
                });

                describe('with object field filled', () => {
                    beforeEach(() => {
                        collectionChoiceEditor = setupComponentUnderTest(collectionChoiceObject);
                        valueField = collectionChoiceEditor.shadowRoot.querySelector(SELECTORS.VALUE_FIELD);
                    });

                    it('Value Field should be defined', () => {
                        expect(valueField).not.toBeNull();
                    });

                    it('Changing value in valueField field-picker should update valueField value', () => {
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
    });

    describe('Validation', () => {
        it('Calls reducer with validate all event', () => {
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
