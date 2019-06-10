import {
    getScreenFieldTypeByName,
    getAllScreenFieldTypes,
    getFieldChoiceData
} from 'builder_platform_interaction/screenEditorUtils';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('../screenEditorExtensionUtils', () => {
    const componentInstanceFieldType = require.requireActual(
        '../screenEditorExtensionUtils'
    ).COMPONENT_INSTANCE;
    return {
        getAllCachedExtensionTypes: () => {
            return [
                {
                    name: 'flowruntime:fileUpload',
                    fieldType: componentInstanceFieldType,
                    dataType: undefined,
                    label: 'File Upload',
                    icon: 'utility:type_tool',
                    category: 'Input'
                },
                {
                    name: 'orgns:customComp',
                    fieldType: componentInstanceFieldType,
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
getElementByGuid.mockImplementation(guid => {
    const element = {
        guid,
        name: 'choiceName'
    };
    switch (guid) {
        case choice1Guid:
            element.picklistField = 'Industry';
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

describe('getScreenFieldTypeByName function', () => {
    it('Returns normal screen field type (not extension) by name', () => {
        const name = getAllScreenFieldTypes()[1].name;
        const fieldType = getScreenFieldTypeByName(name);
        expect(fieldType.name).toBe(name);
    });

    it('Returns extension field type by name', () => {
        const fieldType = getScreenFieldTypeByName('orgns:customComp');
        expect(fieldType.name).toBe('orgns:customComp');
        expect(fieldType.fieldType).toBe(
            require.requireActual('../screenEditorExtensionUtils')
                .COMPONENT_INSTANCE
        );
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
                defaultValueOption: false,
                label: {
                    error: null,
                    value: choiceNameMergeField
                },
                name: 'choiceName',
                value: choice1Guid
            },
            {
                defaultValueOption: false,
                label: {
                    error: 'error2',
                    value: null
                },
                name: '',
                value: ''
            },
            {
                defaultValueOption: true,
                label: {
                    error: null,
                    value: choiceNameMergeField
                },
                name: 'choiceName',
                value: choice3Guid
            },
            {
                defaultValueOption: false,
                label: {
                    error: 'error4',
                    value: null
                },
                name: '',
                value: ''
            },
            {
                defaultValueOption: false,
                label: {
                    error: null,
                    value: null
                },
                name: '',
                value: ''
            }
        ];
        const data = getFieldChoiceData(mockField);
        expect(data).toEqual(expectedData);
    });
});
