import {
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { CLASSIC_EXPERIENCE, getPreferredExperience } from 'builder_platform_interaction/contextLib';
import { ExtraTypeInfo, FieldDataType } from 'builder_platform_interaction/dataTypeLib';
import { createAutomaticField, createScreenFieldWithFields } from 'builder_platform_interaction/elementFactory';
import { FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';
import ScreenAutomaticFieldPropertiesEditor from 'builder_platform_interaction/screenAutomaticFieldPropertiesEditor';
import {
    ScreenFieldName,
    SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME
} from 'builder_platform_interaction/screenEditorUtils';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { createElement } from 'lwc';
import {
    accountVariableNameAutomaticField,
    contactVariableAddressAutomaticField,
    contactVariableNameAutomaticField,
    flowWithAllElementsUIModel as mockFlowWithAllElementsUIModel,
    objectWithAllPossibleFieldsVariable,
    objectWithAllPossibleFieldsVariableTextFieldAutomaticField
} from 'mock/storeData';
import { objectManagerUrls as mockObjectManagerUrls } from 'serverData/GetObjectManagerUrls/objectManagerUrls.json';
const { format } = commonUtils;

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
jest.mock('builder_platform_interaction/sobjectLib', () => require('builder_platform_interaction_mocks/sobjectLib'));
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
jest.mock('@salesforce/label/FlowBuilderAutomaticFieldEditor.datatypePhone', () => ({ default: 'Phone' }), {
    virtual: true
});
jest.mock('@salesforce/label/FlowBuilderAutomaticFieldEditor.datatypeEmail', () => ({ default: 'Email' }), {
    virtual: true
});
jest.mock('@salesforce/label/FlowBuilderAutomaticFieldEditor.datatypePersonName', () => ({ default: 'Name' }), {
    virtual: true
});
jest.mock('@salesforce/label/FlowBuilderAutomaticFieldEditor.datatypeAddress', () => ({ default: 'Address' }), {
    virtual: true
});
jest.mock('@salesforce/label/FlowBuilderAutomaticFieldEditor.datatypePicklist', () => ({ default: 'Picklist' }), {
    virtual: true
});

const SELECTORS = {
    DESCRIPTION_VALUE_SELECTOR_FORMAT: `tr.{0} > td > ${LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_FORMATTED_TEXT}.autofield-description-value`,
    DESCRIPTION_ROW_SELECTOR_FORMAT: 'tr.{0}',
    DATATYPE: 'autofield-datatype',
    IS_REQUIRED: 'autofield-required',
    CREATEABLE: 'autofield-createable',
    UPDATEABLE: 'autofield-updateable'
};

const getAutomaticFieldPropertyValue = (comp, fieldCssClassName) =>
    comp.shadowRoot.querySelector(format(SELECTORS.DESCRIPTION_VALUE_SELECTOR_FORMAT, fieldCssClassName)).value;
const getAutomaticFieldPropertyRow = (comp, fieldCssClassName) =>
    comp.shadowRoot.querySelector(format(SELECTORS.DESCRIPTION_ROW_SELECTOR_FORMAT, fieldCssClassName));

const getDataTypeValue = (comp) => getAutomaticFieldPropertyValue(comp, SELECTORS.DATATYPE);
const getIsRequiredValue = (comp) => getAutomaticFieldPropertyValue(comp, SELECTORS.IS_REQUIRED);
const getIsCreateableValue = (comp) => getAutomaticFieldPropertyValue(comp, SELECTORS.CREATEABLE);
const getIsUpdateableValue = (comp) => getAutomaticFieldPropertyValue(comp, SELECTORS.UPDATEABLE);
const getCreatableRow = (comp) => getAutomaticFieldPropertyRow(comp, SELECTORS.CREATEABLE);
const getUpdateableRow = (comp) => getAutomaticFieldPropertyRow(comp, SELECTORS.UPDATEABLE);

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
    const cases = [
        [ScreenFieldName.TextBox, 60, null, null, null, null, 'Text(60)'],
        [ScreenFieldName.TextBox, null, null, null, FieldDataType.Phone, null, 'Phone'],
        [ScreenFieldName.TextBox, null, null, null, FieldDataType.Email, null, 'Email'],
        [ScreenFieldName.TextBox, 121, null, null, null, ExtraTypeInfo.PersonName, 'Name'],
        [ScreenFieldName.TextBox, 121, null, null, FieldDataType.Address, null, 'Address'],
        [ScreenFieldName.Number, null, 15, 3, null, null, 'Number(12, 3)'],
        [ScreenFieldName.Number, null, 0, null, null, null, 'Number(8, 0)'],
        [ScreenFieldName.LargeTextArea, 255, null, null, null, null, 'Text Area(255)'],
        [ScreenFieldName.LargeTextArea, 256, null, null, null, null, 'Long Text Area(256)'],
        [ScreenFieldName.DropdownBox, null, null, null, null, null, 'Picklist']
    ];
    test.each(cases)(
        'Given type name %p, length %p, precision %p, scale %p, entityFieldDataType %p, entityFieldExtraTypeInfo %p returns formatted data type %p',
        (
            screenFieldName,
            fieldLength,
            fieldPrecision,
            fieldScale,
            fieldDataType,
            fieldExtraTypeInfo,
            expectedResult
        ) => {
            const component = createComponentForTest({
                type: {
                    name: screenFieldName
                },
                length: fieldLength,
                precision: fieldPrecision,
                scale: fieldScale,
                entityFieldDataType: fieldDataType,
                entityFieldExtraTypeInfo: fieldExtraTypeInfo
            });
            expect(getDataTypeValue(component)).toEqual(expectedResult);
        }
    );
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
    });
    it('is not showing creatable part for name compound field', () => {
        const field = createScreenFieldWithFields(contactVariableNameAutomaticField);
        const component = createComponentForTest(field);
        expect(getCreatableRow(component)).toBeNull();
    });
    it('is not showing creatable part for address compound field', () => {
        const field = createScreenFieldWithFields(contactVariableAddressAutomaticField);
        const component = createComponentForTest(field);
        expect(getCreatableRow(component)).toBeNull();
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
    it('is not showing updateable part for name compound field', () => {
        const field = createScreenFieldWithFields(contactVariableNameAutomaticField);
        const component = createComponentForTest(field);
        expect(getUpdateableRow(component)).toBeNull();
    });
    it('is not showing updateable part for address compound field', () => {
        const field = createScreenFieldWithFields(contactVariableAddressAutomaticField);
        const component = createComponentForTest(field);
        expect(getUpdateableRow(component)).toBeNull();
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
