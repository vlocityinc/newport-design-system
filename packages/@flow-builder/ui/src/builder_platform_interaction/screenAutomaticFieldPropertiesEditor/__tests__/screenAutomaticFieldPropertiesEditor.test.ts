import { createElement } from 'lwc';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import ScreenAutomaticFieldPropertiesEditor from 'builder_platform_interaction/screenAutomaticFieldPropertiesEditor';
import { ScreenFieldName } from 'builder_platform_interaction/screenEditorUtils';
import { objectWithAllPossibleFieldsFields as mockObjectWithAllPossibleFieldsFields } from 'serverData/GetFieldsForEntity/objectWithAllPossibleFieldsFields.json';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import {
    accountVariableNameAutomaticField,
    objectWithAllPossibleFieldsVariableTextFieldAutomaticField,
    flowWithAllElementsUIModel as mockFlowWithAllElementsUIModel
} from 'mock/storeData';
import { createScreenFieldWithFields } from 'builder_platform_interaction/elementFactory';
import { allEntities as mockEntities } from 'serverData/GetEntities/allEntities.json';
import { objectManagerUrls as mockObjectManagerUrls } from 'serverData/GetObjectManagerUrls/objectManagerUrls.json';
import { CLASSIC_EXPERIENCE, getPreferredExperience } from 'builder_platform_interaction/contextLib';
import { format } from 'builder_platform_interaction/commonUtils';
import { FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/storeLib', () => {
    const getCurrentState = function () {
        return {
            elements: mockFlowWithAllElementsUIModel.elements
        };
    };
    const getStore = function () {
        return {
            getCurrentState
        };
    };
    const storeLib = require('builder_platform_interaction_mocks/storeLib');
    // Overriding mock storeLib to have custom getStore function
    storeLib.Store.getStore = getStore;
    return storeLib;
});

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        getFieldsForEntity: jest.fn().mockImplementation((entityName) => {
            if (entityName === 'Account') {
                return mockAccountFields;
            } else if (entityName === 'Object_with_all_possible_fields__c') {
                return mockObjectWithAllPossibleFieldsFields;
            }
            return undefined;
        }),
        getEntity: jest.fn().mockImplementation((entityName) => {
            return mockEntities.find((entity) => entity.apiName.toLowerCase() === entityName.toLowerCase());
        })
    };
});

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce: (serverActionType) => {
            switch (serverActionType) {
                case SERVER_ACTION_TYPE.GET_AUTOMATIC_FIELD_OBJECT_MANAGER_URLS:
                    return Promise.resolve(mockObjectManagerUrls);
                default:
                    return Promise.reject().catch();
            }
        }
    };
});

jest.mock('builder_platform_interaction/contextLib', () => require('builder_platform_interaction_mocks/contextLib'));

jest.mock('@salesforce/label/FlowBuilderAutomaticFieldEditor.datatypeNumber', () => ({ default: 'Number({0}, {1})' }), {
    virtual: true
});
jest.mock('@salesforce/label/FlowBuilderAutomaticFieldEditor.datatypeText', () => ({ default: 'Text({0})' }), {
    virtual: true
});
jest.mock('@salesforce/label/FlowBuilderAutomaticFieldEditor.datatypeTextArea', () => ({ default: 'Text Area({0})' }), {
    virtual: true
});
jest.mock(
    '@salesforce/label/FlowBuilderAutomaticFieldEditor.datatypeLongTextArea',
    () => ({ default: 'Long Text Area({0})' }),
    {
        virtual: true
    }
);

const DESCRIPTION_VALUE_SELECTOR =
    "tr[class*='{0}'] > td > " +
    LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_FORMATTED_TEXT +
    "[class*='autofield-description-value']";

function getDataTypeValue(comp) {
    return comp.shadowRoot.querySelector(format(DESCRIPTION_VALUE_SELECTOR, 'autofield-datatype')).value;
}

function getIsRequiredValue(comp) {
    return comp.shadowRoot.querySelector(format(DESCRIPTION_VALUE_SELECTOR, 'autofield-required')).value;
}

function getObjectManagerLinkUrl(comp) {
    return comp.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_FORMATTED_URL).value;
}

function createComponentForTest(field) {
    const element = createElement('builder_platform_interaction-screen-automatic-field-properties-editor', {
        is: ScreenAutomaticFieldPropertiesEditor
    });
    Object.assign(element, { field });
    setDocumentBodyChildren(element);
    return element;
}

describe('Data types formatting with tokens', () => {
    let component;
    test('Text field data type is properly formatted', () => {
        component = createComponentForTest({
            type: {
                name: ScreenFieldName.TextBox
            },
            length: 60
        });
        expect(getDataTypeValue(component)).toEqual('Text(60)');
    });
    test('Number field data type is properly formatted', () => {
        component = createComponentForTest({
            type: {
                name: ScreenFieldName.Number
            },
            precision: 15,
            scale: 3
        });
        expect(getDataTypeValue(component)).toEqual('Number(12, 3)');
    });
    test('Number being Integer in the backend field data type is properly formatted', () => {
        component = createComponentForTest({
            type: {
                name: ScreenFieldName.Number
            },
            precision: 0
        });
        expect(getDataTypeValue(component)).toEqual('Number(8, 0)');
    });
    test('Text Area field data type is properly formatted', () => {
        component = createComponentForTest({
            type: {
                name: ScreenFieldName.LargeTextArea
            },
            length: 255
        });
        expect(getDataTypeValue(component)).toEqual('Text Area(255)');
    });
    it('Long Text Area field data type is properly formatted', () => {
        component = createComponentForTest({
            type: {
                name: ScreenFieldName.LargeTextArea
            },
            length: 256
        });
        expect(getDataTypeValue(component)).toEqual('Long Text Area(256)');
    });
});

describe('Link to Object Manager', () => {
    it('should return the Lightning link to field list page when not using Classic experience', async () => {
        (getPreferredExperience as jest.Mock).mockReturnValue('NOT' + CLASSIC_EXPERIENCE);
        const field = createScreenFieldWithFields(objectWithAllPossibleFieldsVariableTextFieldAutomaticField);
        const component = createComponentForTest(field);
        await ticks();
        expect(getObjectManagerLinkUrl(component)).toEqual(
            '/lightning/setup/ObjectManager/Object_with_all_possible_fields__c/FieldsAndRelationships/view'
        );
    });
    describe('When using Classic experience', () => {
        beforeAll(() => {
            (getPreferredExperience as jest.Mock).mockReturnValue(CLASSIC_EXPERIENCE);
        });
        it('should return the Classic link to standard object field page', async () => {
            const field = createScreenFieldWithFields(accountVariableNameAutomaticField);
            const component = createComponentForTest(field);
            await ticks();
            expect(getObjectManagerLinkUrl(component)).toEqual('/p/setup/layout/LayoutFieldList?type=Account');
        });
        it('should return the Classic link to custom object page', async () => {
            const field = createScreenFieldWithFields(objectWithAllPossibleFieldsVariableTextFieldAutomaticField);
            const component = createComponentForTest(field);
            await ticks();
            expect(getObjectManagerLinkUrl(component)).toEqual('/p/setup/custent/CustomObjectsPage');
        });
    });
});

describe('isRequired', () => {
    it('is empty when user does not have access to the referenced field', () => {
        const objectFieldReference = 'varOfARecordICannotAccess.Name';
        const field = createScreenFieldWithFields({
            fieldType: FlowScreenFieldType.ObjectProvided,
            objectFieldReference
        });
        const component = createComponentForTest(field);
        expect(getIsRequiredValue(component)).toEqual('');
    });
    it('is defined when user has access to the referenced field', () => {
        const field = createScreenFieldWithFields(accountVariableNameAutomaticField);
        const component = createComponentForTest(field);
        expect(getIsRequiredValue(component)).toBeTruthy();
    });
});
