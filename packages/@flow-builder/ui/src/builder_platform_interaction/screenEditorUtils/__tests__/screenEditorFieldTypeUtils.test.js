import {
    getScreenFieldTypeByName, getAllScreenFieldTypes, getFieldChoiceData
} from 'builder_platform_interaction/screenEditorUtils';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';

jest.mock('../screenEditorExtensionUtils', () => {
    const componentInstanceFieldType = require.requireActual('../screenEditorExtensionUtils').COMPONENT_INSTANCE;
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
                }, {
                    name: 'orgns:customComp',
                    fieldType: componentInstanceFieldType,
                    dataType: undefined,
                    label: 'Custom Comp',
                    icon: 'utility:type_tool',
                    category: 'Custom'
                }];
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
            element.elementType = 'PICKLIST_CHOICE_SET';
            break;
        case choice2Guid:
            element.displayField = 'Choice';
            element.elementType = 'RECORD_CHOICE_SET';
            break;
        case choice3Guid:
            element.choiceText = 'Choice';
            break;
        default:
    }
    return element;
});

jest.mock('builder_platform_interaction/storeLib', () => {
    return {
        generateGuid: () => {
            return 'GUID_1';
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
        expect(fieldType.fieldType).toBe(require.requireActual('../screenEditorExtensionUtils').COMPONENT_INSTANCE);
    });
});

describe('getFieldChoiceData function', () => {
    it('Returns empty array when there are no choice references', () => {
        const data = getFieldChoiceData({choiceReferences: []});
        expect(data).toEqual([]);
    });
    it('Returns data when there are choice references', () => {
        const mockField = {
            choiceReferences: [{
                choiceReference: {value: choice1Guid, error: 'error1'}
            }, {
                choiceReference: {value: choice2Guid, error: 'error2'}
            }, {
                choiceReference: {value: choice3Guid, error: 'error3'}
            }, {
                choiceReference: {error: 'error4'}
            }, {}]
        };
        const choiceNameMergeField = '{!choiceName}';
        const expectedData = [{
                displayValue: {
                    error: 'error1',
                    value: choiceNameMergeField
                },
                guid: choice1Guid,
                label: 'Industry',
                value: choice1Guid
            }, {
                displayValue: {
                    error: 'error2',
                    value: choiceNameMergeField
                },
                guid: choice2Guid,
                label: '[undefined] Choice',
                value: choice2Guid
            }, {
                displayValue: {
                    error: 'error3',
                    value: choiceNameMergeField
                }, guid: choice3Guid,
                label: 'Choice',
                value: choice3Guid
            }, {
                displayValue: {
                    error: 'error4',
                    value: null
                },
                guid: 'GUID_1',
                label: '',
                value: ''
            }, {
                displayValue: {
                    error: null,
                    value: null
                },
                guid: 'GUID_1',
                label: '',
                value: ''
            }
        ];
        const data = getFieldChoiceData(mockField);
        expect(data).toEqual(expectedData);
    });
});
