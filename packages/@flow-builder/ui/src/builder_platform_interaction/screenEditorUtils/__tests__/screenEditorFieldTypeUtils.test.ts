// @ts-nocheck
import { ELEMENT_TYPE, FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';
import {
    getAllScreenFieldTypes,
    getFieldChoiceData,
    getScreenFieldTypeByName
} from 'builder_platform_interaction/screenEditorUtils';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';

jest.mock('builder_platform_interaction/flowExtensionLib', () => {
    return {
        getAllCachedExtensionTypes: () => {
            return [
                {
                    name: 'flowruntime:fileUpload',
                    fieldType: 'ComponentInstance',
                    dataType: undefined,
                    label: 'File Upload',
                    icon: 'utility:type_tool',
                    category: 'Input'
                },
                {
                    name: 'orgns:customComp',
                    fieldType: 'ComponentInstance',
                    dataType: undefined,
                    label: 'Custom Comp',
                    icon: 'utility:type_tool',
                    category: 'Custom'
                }
            ];
        }
    };
});

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid: jest.fn()
    };
});
const choice1Guid = 'choice1';
const choice2Guid = 'choice2';
const choice3Guid = 'choice3';
getElementByGuid.mockImplementation((guid) => {
    const element = {
        guid,
        name: 'choiceName'
    };
    switch (guid) {
        case choice1Guid:
            element.picklistField = 'Industry';
            element.picklistObject = 'Account';
            element.elementType = ELEMENT_TYPE.PICKLIST_CHOICE_SET;
            break;
        case choice2Guid:
            element.displayField = 'Choice';
            element.elementType = ELEMENT_TYPE.RECORD_CHOICE_SET;
            break;
        case choice3Guid:
            element.choiceText = 'Choice';
            element.elementType = ELEMENT_TYPE.CHOICE;
            break;
        default:
    }
    return element;
});

jest.mock('builder_platform_interaction/storeLib', () => {
    return {
        generateGuid: () => {
            return 'GUID1';
        }
    };
});

jest.mock('builder_platform_interaction/contextLib', () => {
    return Object.assign({}, require('builder_platform_interaction_mocks/contextLib'), {
        orgHasFlowScreenSections: jest.fn()
    });
});

describe('getScreenFieldTypeByName function', () => {
    it('Returns normal screen field type (not extension) by name', () => {
        const name = getAllScreenFieldTypes()[1].name;
        const fieldType = getScreenFieldTypeByName(name);
        expect(fieldType.name).toBe(name);
    });

    it('Returns extension field type by name', () => {
        const fieldType = getScreenFieldTypeByName('orgns:customComp');
        expect(fieldType.name).toBe('orgns:customComp');
        expect(fieldType.fieldType).toBe(FlowScreenFieldType.ComponentInstance);
    });
});

describe('getFieldChoiceData function', () => {
    it('Returns empty array when there are no choice references', () => {
        const data = getFieldChoiceData({ choiceReferences: [] });
        expect(data).toEqual([]);
    });
    it('Returns data when there are choice references', () => {
        const mockField = {
            choiceReferences: [
                {
                    choiceReference: { value: choice1Guid, error: null }
                },
                {
                    choiceReference: { value: choice2Guid, error: 'error2' }
                },
                {
                    choiceReference: { value: choice3Guid, error: null }
                },
                {
                    choiceReference: { error: 'error4' }
                },
                {}
            ]
        };
        const choiceNameMergeField = '{!choiceName}';
        const expectedData = [
            {
                elementType: 'PicklistChoice',
                label: {
                    error: null,
                    value: choiceNameMergeField
                },
                name: 'choiceName',
                picklistField: 'Industry',
                picklistObject: 'Account',
                value: choice1Guid,
                guid: choice1Guid
            },
            {
                label: {
                    error: 'error2',
                    value: null
                },
                name: '',
                value: '',
                guid: ''
            },
            {
                elementType: 'Choice',
                label: {
                    error: null,
                    value: choiceNameMergeField
                },
                name: 'choiceName',
                value: choice3Guid,
                guid: choice3Guid
            },
            {
                label: {
                    error: 'error4',
                    value: null
                },
                name: '',
                value: '',
                guid: ''
            },
            {
                label: {
                    error: null,
                    value: null
                },
                name: '',
                value: '',
                guid: ''
            }
        ];
        const data = getFieldChoiceData(mockField);
        expect(data).toEqual(expectedData);
    });
});
