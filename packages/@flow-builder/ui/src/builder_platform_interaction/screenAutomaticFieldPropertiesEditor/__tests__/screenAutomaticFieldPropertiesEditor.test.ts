import { createElement } from 'lwc';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import ScreenAutomaticFieldPropertiesEditor from 'builder_platform_interaction/screenAutomaticFieldPropertiesEditor';
import {
    SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME,
    ScreenFieldName
} from 'builder_platform_interaction/screenEditorUtils';
import { objectWithAllPossibleFieldsFields as mockObjectWithAllPossibleFieldsFields } from 'serverData/GetFieldsForEntity/objectWithAllPossibleFieldsFields.json';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import {
    accountVariableNameAutomaticField,
    objectWithAllPossibleFieldsVariableTextFieldAutomaticField,
    flowWithAllElementsUIModel as mockFlowWithAllElementsUIModel,
    objectWithAllPossibleFieldsVariable
} from 'mock/storeData';
import { createScreenFieldWithFields, createAutomaticField } from 'builder_platform_interaction/elementFactory';
import { allEntities as mockEntities } from 'serverData/GetEntities/allEntities.json';
import { objectManagerUrls as mockObjectManagerUrls } from 'serverData/GetObjectManagerUrls/objectManagerUrls.json';
import { CLASSIC_EXPERIENCE, getPreferredExperience } from 'builder_platform_interaction/contextLib';
import { format } from 'builder_platform_interaction/commonUtils';
import { FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/storeLib', () => {
    const getCurrentState = () => ({
        elements: mockFlowWithAllElementsUIModel.elements
    });

    const storeLib = require('builder_platform_interaction_mocks/storeLib');
    // Overriding mock storeLib to have custom getStore function
    storeLib.Store.getStore = () => ({
        getCurrentState
    });
    return storeLib;
});
jest.mock('builder_platform_interaction/screenComponentVisibilitySection', () =>
    require('builder_platform_interaction_mocks/screenComponentVisibilitySection')
);
jest.mock('builder_platform_interaction/sobjectLib', () => ({
    getFieldsForEntity: jest.fn().mockImplementation((entityName) => {
        switch (entityName) {
            case 'Account':
                return mockAccountFields;
            case 'Object_with_all_possible_fields__c':
                return mockObjectWithAllPossibleFieldsFields;
            default:
                return undefined;
        }
    }),
    getEntity: jest
        .fn()
        .mockImplementation((entityName) =>
            mockEntities.find((entity) => entity.apiName.toLowerCase() === entityName.toLowerCase())
        )
}));
jest.mock('builder_platform_interaction/serverDataLib', () => {
    const { SERVER_ACTION_TYPE } = jest.requireActual('builder_platform_interaction/serverDataLib');
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
const SELECTORS = {
    DESCRIPTION_VALUE_SELECTOR_FORMAT: `tr.{0} > td > ${LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_FORMATTED_TEXT}.autofield-description-value`,
    DATATYPE: 'autofield-datatype',
    IS_REQUIRED: 'autofield-required',
    CREATEABLE: 'autofield-createable',
    UPDATEABLE: 'autofield-updateable'
};

const getAutomaticFieldPropertyValue = (comp, fieldCssClassName) =>
    comp.shadowRoot.querySelector(format(SELECTORS.DESCRIPTION_VALUE_SELECTOR_FORMAT, fieldCssClassName)).value;

const getDataTypeValue = (comp) => getAutomaticFieldPropertyValue(comp, SELECTORS.DATATYPE);
const getIsRequiredValue = (comp) => getAutomaticFieldPropertyValue(comp, SELECTORS.IS_REQUIRED);
const getIsCreateableValue = (comp) => getAutomaticFieldPropertyValue(comp, SELECTORS.CREATEABLE);
const getIsUpdateableValue = (comp) => getAutomaticFieldPropertyValue(comp, SELECTORS.UPDATEABLE);

const getObjectManagerLinkUrl = (comp) =>
    comp.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_FORMATTED_URL).value;

const createComponentForTest = (field) => {
    const element = createElement('builder_platform_interaction-screen-automatic-field-properties-editor', {
        is: ScreenAutomaticFieldPropertiesEditor
    });
    Object.assign(element, { field });
    setDocumentBodyChildren(element);
    return element;
};

const getAccordion = (comp) => comp.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_ACCORDION);
const getScreenComponentFieldVisibilitySection = (comp) =>
    getAccordion(comp).shadowRoot.querySelector('slot').assignedNodes()[0];

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
        (getPreferredExperience as jest.Mock).mockReturnValue(`NOT${CLASSIC_EXPERIENCE}`);
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
    it('is false whatever the setting is for boolean field', () => {
        const automaticScreenField = createAutomaticField(
            ScreenFieldName.Checkbox,
            `${objectWithAllPossibleFieldsVariable.name}.Checkbox_Field__c`
        );
        const field = createScreenFieldWithFields(automaticScreenField);
        const component = createComponentForTest(field);
        expect(getIsRequiredValue(component)).toBe('FlowBuilderAutomaticFieldEditor.isRequiredFalse');
    });
});

describe('isCreateable', () => {
    it('is empty when user does not have access to the referenced field', () => {
        const objectFieldReference = 'varOfARecordICannotAccess.Name';
        const field = createScreenFieldWithFields({
            fieldType: FlowScreenFieldType.ObjectProvided,
            objectFieldReference
        });
        const component = createComponentForTest(field);
        expect(getIsCreateableValue(component)).toEqual('');
    });
    it('is defined when user has access to the referenced field', () => {
        const field = createScreenFieldWithFields(accountVariableNameAutomaticField);
        const component = createComponentForTest(field);
        expect(getIsCreateableValue(component)).toBeTruthy();
    });
});

describe('isUpdateable', () => {
    it('is empty when user does not have access to the referenced field', () => {
        const objectFieldReference = 'varOfARecordICannotAccess.Name';
        const field = createScreenFieldWithFields({
            fieldType: FlowScreenFieldType.ObjectProvided,
            objectFieldReference
        });
        const component = createComponentForTest(field);
        expect(getIsUpdateableValue(component)).toEqual('');
    });
    it('is defined when user has access to the referenced field', () => {
        const field = createScreenFieldWithFields(accountVariableNameAutomaticField);
        const component = createComponentForTest(field);
        expect(getIsUpdateableValue(component)).toBeTruthy();
    });
});
describe('Field visibility', () => {
    describe.each`
        titleToken | objectVariable                                                | activeSectionName
        ${''}      | ${accountVariableNameAutomaticField}                          | ${SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME}
        ${' NO'}   | ${objectWithAllPossibleFieldsVariableTextFieldAutomaticField} | ${''}
    `('Object variable with$titleToken visibility rules', ({ objectVariable, activeSectionName }) => {
        let component;
        beforeAll(() => {
            const screenField = createScreenFieldWithFields(objectVariable);
            component = createComponentForTest(screenField);
        });
        it('displays the "screenComponentVisibilitySection" component', () => {
            expect(getScreenComponentFieldVisibilitySection(component)).not.toBeNull();
        });
        it(`sets the active section name of the accordion to "${activeSectionName}"`, () => {
            const accordion = getAccordion(component);
            expect(accordion.activeSectionName).toBe(activeSectionName);
        });
    });
});
