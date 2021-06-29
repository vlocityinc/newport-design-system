// @ts-nocheck
import { getRulesForField, screenValidation, getDynamicTypeMappingValidation, getRules } from '../screenValidation';
import {
    createTestScreenField,
    SCREEN_NO_DEF_VALUE,
    createTestScreen
} from 'builder_platform_interaction/builderTestUtils';
import { generateGuid, Store } from 'builder_platform_interaction/storeLib';
import { LABELS } from 'builder_platform_interaction/validationRules';
import { isValidMetadataDateTime } from 'builder_platform_interaction/dateTimeUtils';
import { validateTextWithMergeFields } from 'builder_platform_interaction/mergeFieldLib';
import { flowWithAllElementsUIModel, screenWithSection } from 'mock/storeData';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { flowExtensionDetails as mockFlowExtensionDetails } from 'serverData/GetFlowExtensionDetails/flowExtensionDetails.json';
import { setExtensionDescriptions } from 'builder_platform_interaction/flowExtensionLib';
import { FOOTER_LABEL_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/dateTimeUtils', () => {
    return {
        isValidMetadataDateTime: jest.fn().mockName('isValidMetadataDateTime'),
        getFormat: jest.fn().mockReturnValue('mm/dd/yyyy')
    };
});

jest.mock('builder_platform_interaction/mergeFieldLib', () => {
    return {
        validateTextWithMergeFields: jest.fn().mockName('validateTextWithMergeFields').mockReturnValue([])
    };
});

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

describe('When field has validation enabled', () => {
    let field;

    beforeEach(() => {
        field = createTestScreenField('field1', 'Number', '1', {
            validation: true
        });
    });

    it('error message cannot have an invalid merge field', () => {
        const error = { message: 'invalid merge field' };
        const rules = getRulesForField(field);
        validateTextWithMergeFields.mockReturnValueOnce([error]);
        expect(
            screenValidation.validateProperty(
                'errorMessage',
                field.validationRule.errorMessage.value,
                rules.validationRule.errorMessage
            )
        ).toEqual(error.message);
    });

    it('formula cannot have an invalid merge field', () => {
        const error = { message: 'invalid merge field' };
        const rules = getRulesForField(field);
        validateTextWithMergeFields.mockReturnValueOnce([error]);
        expect(
            screenValidation.validateProperty(
                'formulaExpression',
                field.validationRule.errorMessage.value,
                rules.validationRule.errorMessage
            )
        ).toEqual(error.message);
    });

    it('help text cannot have an invalid merge field', () => {
        const error = { message: 'invalid merge field' };
        const rules = getRulesForField(field);
        validateTextWithMergeFields.mockReturnValueOnce([error]);
        expect(screenValidation.validateProperty('helpText', field.helpText.value, rules.helpText)).toEqual(
            error.message
        );
    });

    it('the rules for formulaExpression should be as expected', () => {
        const rules = getRulesForField(field);
        expect(rules.validationRule.formulaExpression[1].name).toBe('isValidFormulaExpression');
    });
});
describe('When screen have custom footer labels', () => {
    let screenNode;
    beforeEach(() => {
        Store.setMockState(flowWithAllElementsUIModel);
        screenNode = createTestScreen('TestScreen', null);
    });
    it('should get an error if backLabelType is custom and backLabel is an empty string', () => {
        screenNode.backLabel.value = '';
        screenNode.backLabelType.value = FOOTER_LABEL_TYPE.CUSTOM;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.backLabel).toMatchObject({
            error: LABELS.cannotBeBlank,
            value: ''
        });
    });

    it('should get an error if backLabelType is custom and backLabel is an string with multiple spaces only', () => {
        screenNode.backLabel.value = '  ';
        screenNode.backLabelType.value = FOOTER_LABEL_TYPE.CUSTOM;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.backLabel).toMatchObject({
            error: LABELS.cannotBeBlank,
            value: '  '
        });
    });

    it('should get an error if backLabelType is custom and backLabel is null', () => {
        screenNode.backLabel.value = null;
        screenNode.backLabelType.value = FOOTER_LABEL_TYPE.CUSTOM;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.backLabel).toMatchObject({
            error: LABELS.cannotBeBlank,
            value: null
        });
    });

    it('should not get an error if backLabelType is custom and backLabel is an valid string', () => {
        screenNode.backLabel.value = 'string';
        screenNode.backLabelType.value = FOOTER_LABEL_TYPE.CUSTOM;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.backLabel).toMatchObject({
            error: null,
            value: 'string'
        });
    });

    it('should get an error if nextOrFinishLabelType is custom and nextOrFinishLabel is an empty string', () => {
        screenNode.nextOrFinishLabel.value = '';
        screenNode.nextOrFinishLabelType.value = FOOTER_LABEL_TYPE.CUSTOM;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.nextOrFinishLabel).toMatchObject({
            error: LABELS.cannotBeBlank,
            value: ''
        });
    });

    it('should get an error if nextOrFinishLabelType is custom and nextOrFinishLabel is an string with multiple spaces only', () => {
        screenNode.nextOrFinishLabel.value = '  ';
        screenNode.nextOrFinishLabelType.value = FOOTER_LABEL_TYPE.CUSTOM;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.nextOrFinishLabel).toMatchObject({
            error: LABELS.cannotBeBlank,
            value: '  '
        });
    });

    it('should get an error if nextOrFinishLabelType is custom and nextOrFinishLabel is null', () => {
        screenNode.nextOrFinishLabel.value = null;
        screenNode.nextOrFinishLabelType.value = FOOTER_LABEL_TYPE.CUSTOM;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.nextOrFinishLabel).toMatchObject({
            error: LABELS.cannotBeBlank,
            value: null
        });
    });

    it('should not get an error if nextOrFinishLabelType is custom and nextOrFinishLabel is an valid string', () => {
        screenNode.nextOrFinishLabel.value = 'string';
        screenNode.nextOrFinishLabelType.value = FOOTER_LABEL_TYPE.CUSTOM;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.nextOrFinishLabel).toMatchObject({
            error: null,
            value: 'string'
        });
    });

    it('should get an error if pauseLabelType is custom and pauseLabel is an empty string', () => {
        screenNode.pauseLabel.value = '';
        screenNode.pauseLabelType.value = FOOTER_LABEL_TYPE.CUSTOM;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.pauseLabel).toMatchObject({
            error: LABELS.cannotBeBlank,
            value: ''
        });
    });

    it('should get an error if pauseLabelType is custom and pauseLabel is an string with multiple spaces only', () => {
        screenNode.pauseLabel.value = '  ';
        screenNode.pauseLabelType.value = FOOTER_LABEL_TYPE.CUSTOM;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.pauseLabel).toMatchObject({
            error: LABELS.cannotBeBlank,
            value: '  '
        });
    });

    it('should get an error if pauseLabelType is custom and pauseLabel is null', () => {
        screenNode.pauseLabel.value = null;
        screenNode.pauseLabelType.value = FOOTER_LABEL_TYPE.CUSTOM;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.pauseLabel).toMatchObject({
            error: LABELS.cannotBeBlank,
            value: null
        });
    });

    it('should not get an error if pauseLabelType is custom and pauseLabel is an valid string', () => {
        screenNode.pauseLabel.value = 'string';
        screenNode.pauseLabelType.value = FOOTER_LABEL_TYPE.CUSTOM;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.pauseLabel).toMatchObject({
            error: null,
            value: 'string'
        });
    });

    it('should get an error if pauseMessageType is custom and pausedText is an empty string', () => {
        screenNode.pausedText.value = '';
        screenNode.pauseMessageType.value = FOOTER_LABEL_TYPE.CUSTOM;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.pausedText).toMatchObject({
            error: LABELS.cannotBeBlank,
            value: ''
        });
    });

    it('should get an error if pauseMessageType is custom and pausedText is an string with multiple spaces only', () => {
        screenNode.pausedText.value = '   ';
        screenNode.pauseMessageType.value = FOOTER_LABEL_TYPE.CUSTOM;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.pausedText).toMatchObject({
            error: LABELS.cannotBeBlank,
            value: '   '
        });
    });

    it('should get an error if pauseMessageType is custom and pausedText is a blank string with p tag', () => {
        screenNode.pausedText.value = '<p> </p>';
        screenNode.pauseMessageType.value = FOOTER_LABEL_TYPE.CUSTOM;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.pausedText).toMatchObject({
            error: LABELS.cannotBeBlank,
            value: '<p> </p>'
        });
    });

    it('should not get an error if pauseMessageType is custom and pausedText is an valid string', () => {
        screenNode.pausedText.value = '<p>string</p>';
        screenNode.pauseMessageType.value = FOOTER_LABEL_TYPE.CUSTOM;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.pausedText).toMatchObject({
            error: null,
            value: '<p>string</p>'
        });
    });

    it('should get an error if pauseMessageType is custom and pausedText is null', () => {
        screenNode.pausedText.value = null;
        screenNode.pauseMessageType.value = FOOTER_LABEL_TYPE.CUSTOM;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.pausedText).toMatchObject({
            error: LABELS.cannotBeBlank,
            value: null
        });
    });

    it('should get an error if allowHelp is true and helpText is an empty string', () => {
        screenNode.helpText.value = '';
        screenNode.allowHelp = true;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.helpText).toMatchObject({
            error: LABELS.cannotBeBlank,
            value: ''
        });
    });

    it('should get an error if allowHelp is true and helpText is an string with multiple spaces only', () => {
        screenNode.helpText.value = '  ';
        screenNode.allowHelp = true;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.helpText).toMatchObject({
            error: LABELS.cannotBeBlank,
            value: '  '
        });
    });

    it('should get an error if allowHelp is true and helpText is a blank string with <p> tag', () => {
        screenNode.helpText.value = '<p> </p>';
        screenNode.allowHelp = true;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.helpText).toMatchObject({
            error: LABELS.cannotBeBlank,
            value: '<p> </p>'
        });
    });

    it('should not get an error if allowHelp is true and helpText is a valid string', () => {
        screenNode.helpText.value = '<p>string</p>';
        screenNode.allowHelp = true;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.helpText).toMatchObject({
            error: null,
            value: '<p>string</p>'
        });
    });

    it('should get an error if allowHelp is true and helpText is null', () => {
        screenNode.helpText.value = null;
        screenNode.allowHelp = true;
        const screen = screenValidation.validateAll(screenNode, getRules(screenNode));
        expect(screen.helpText).toMatchObject({
            error: LABELS.cannotBeBlank,
            value: null
        });
    });
});

describe('when screen has paused text and help text', () => {
    it('paused text cannot have an invalid merge field', () => {
        const error = { message: 'invalid merge field' };
        validateTextWithMergeFields.mockReturnValueOnce([error]);
        expect(screenValidation.validateProperty('pausedText', 'some bad merge field')).toEqual(error.message);
    });

    it('help text cannot have an invalid merge field', () => {
        const error = { message: 'invalid merge field' };
        validateTextWithMergeFields.mockReturnValueOnce([error]);
        expect(screenValidation.validateProperty('helpText', 'some bad merge field')).toEqual(error.message);
    });
});

describe('When field type is NUMBER', () => {
    it('and when valid scale is passed, no error should be returned', () => {
        const field = createTestScreenField('field1', 'Number');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('scale', '0', rules.scale)).toBeNull();
    });
    it('and when max value for valid scale is passed, no error should be returned', () => {
        const field = createTestScreenField('field1', 'Number');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('scale', '17', rules.scale)).toBeNull();
    });
    it('and when negative scale is passed, we should get a positive integer error', () => {
        const field = createTestScreenField('field1', 'Number');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('scale', '-1', rules.scale)).toBe(
            LABELS.shouldBeAPositiveIntegerOrZero
        );
    });
    it('and when invalid scale is passed, we should an over max value error', () => {
        const field = createTestScreenField('field1', 'Number');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('scale', '18', rules.scale)).toBe(LABELS.overMaxIntegerValue);
    });
    it('and default value is a reference, there should be no error', () => {
        const field = createTestScreenField('field1', 'Number');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('defaultValue', '{!myVar}', rules.defaultValue)).toBeNull();
    });
});

describe('When field type is CURRENCY', () => {
    it('and when valid scale is passed, no error should be returned', () => {
        const field = createTestScreenField('field1', 'Currency');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('scale', '0', rules.scale)).toBeNull();
    });
    it('and when max value for valid scale is passed, no error should be returned', () => {
        const field = createTestScreenField('field1', 'Currency');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('scale', '17', rules.scale)).toBeNull();
    });
    it('and when negative scale is passed, we should get a positive integer error', () => {
        const field = createTestScreenField('field1', 'Currency');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('scale', '-1', rules.scale)).toBe(
            LABELS.shouldBeAPositiveIntegerOrZero
        );
    });
    it('and when invalid scale is passed, we should an over max value error', () => {
        const field = createTestScreenField('field1', 'Currency');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('scale', '18', rules.scale)).toBe(LABELS.overMaxIntegerValue);
    });
    it('and default value is a reference, there should be no error', () => {
        const field = createTestScreenField('field1', 'Currency');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('defaultValue', '{!myVar}', rules.defaultValue)).toBeNull();
    });
});

describe('When field type is DATE', () => {
    it('and when valid date is passed, no error should be returned', () => {
        isValidMetadataDateTime.mockReturnValueOnce(true);
        const field = createTestScreenField('field1', 'Date');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('defaultValue', '2000-02-01', rules.defaultValue)).toBeNull();
    });
    it('and when an invalid date is passed, a valid date error should be returned', () => {
        isValidMetadataDateTime.mockReturnValueOnce(false);
        const field = createTestScreenField('field1', 'Date');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('defaultValue', 'abc', rules.defaultValue)).toBe(
            LABELS.dateErrorMessage
        );
    });
    it('and default value is a devName, there should be no error', () => {
        const field = createTestScreenField('field1', 'Date');
        field.defaultValue = { value: '{!myVar}', error: null };
        field.defaultValueDataType = 'reference';
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('defaultValue', '{!myVar}', rules.defaultValue)).toBeNull();
    });
    it('and default value is a GUID, there should be no error', () => {
        const field = createTestScreenField('field1', 'Date');
        field.defaultValue = { value: generateGuid(), error: null };
        field.defaultValueDataType = 'reference';
        const rules = getRulesForField(field);
        expect(
            screenValidation.validateProperty('defaultValue', field.defaultValue.value, rules.defaultValue)
        ).toBeNull();
    });
});

describe('When field type is DATE/TIME', () => {
    it('and when valid date/time is passed, no error should be returned', () => {
        isValidMetadataDateTime.mockReturnValueOnce(true);
        const field = createTestScreenField('field1', 'DateTime');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('defaultValue', '2000-02-01 3:30 PM', rules.defaultValue)).toBeNull();
    });
    it('and when an invalid date/time is passed, a valid date error should be returned', () => {
        isValidMetadataDateTime.mockReturnValueOnce(false);
        const field = createTestScreenField('field1', 'DateTime');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('defaultValue', 'abc', rules.defaultValue)).toBe(
            LABELS.datetimeErrorMessage
        );
    });
    it('and default value is a reference, there should be no error', () => {
        const field = createTestScreenField('field1', 'DateTime');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('defaultValue', '{!myVar}', rules.defaultValue)).toBeNull();
    });
});

describe('When field type is DisplayText', () => {
    it('and when valid display text is passed, no error should be returned', () => {
        const field = createTestScreenField('field1', 'DisplayText');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('fieldText', 'valid default value', rules.fieldText)).toBeNull();
    });
    it('and when the display text is too long, we should get an error about length', () => {
        const field = createTestScreenField('field1', 'DisplayText');
        const rules = getRulesForField(field);
        const displayTextStarter = 'this will get repeated until it is a giant string';
        expect(screenValidation.validateProperty('fieldText', displayTextStarter.repeat(2000), rules.fieldText)).toBe(
            LABELS.maximumCharactersLimit
        );
    });
    it('cannot have an invalid merge field', () => {
        const field = createTestScreenField('field1', 'DisplayText', {
            validation: false
        });
        const error = { message: 'invalid merge field' };
        const rules = getRulesForField(field);
        validateTextWithMergeFields.mockReturnValueOnce([error]);
        expect(screenValidation.validateProperty('fieldText', field.fieldText.value, rules.fieldText)).toEqual(
            error.message
        );
    });
});

describe('When field type is TextBox', () => {
    it('and a formulaExpression is provided without an errorMessage, we should get an error', () => {
        const field = createTestScreenField('field1', 'TextBox', SCREEN_NO_DEF_VALUE, { validation: false });
        field.validationRule.formulaExpression = { value: 'abc', error: null };
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('errorMessage', '', rules.validationRule.errorMessage)).toBe(
            LABELS.cannotBeBlank
        );
    });
    it('and a errorMessage is provided without an formulaExpression, we should get an error', () => {
        const field = createTestScreenField('field1', 'TextBox', SCREEN_NO_DEF_VALUE, { validation: false });
        field.validationRule.errorMessage = { value: 'abc', error: null };
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('formulaExpression', '', rules.validationRule.formulaExpression)).toBe(
            LABELS.cannotBeBlank
        );
    });
    it('and both errorMessage and formulaExpression are provided, there should be no error', () => {
        const field = createTestScreenField('field1', 'TextBox', SCREEN_NO_DEF_VALUE, { validation: true });
        const rules = getRulesForField(field);
        expect(
            screenValidation.validateProperty(
                'formulaExpression',
                field.validationRule.formulaExpression.value,
                rules.validationRule.formulaExpression
            )
        ).toBeNull();
        expect(
            screenValidation.validateProperty(
                'errorMessage',
                field.validationRule.errorMessage.value,
                rules.validationRule.errorMessage
            )
        ).toBeNull();
    });
    it('and default value is a reference, there should be no error', () => {
        const field = createTestScreenField('field1', 'TextBox');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('defaultValue', '{!myVar}', rules.defaultValue)).toBeNull();
    });
});

describe('When field type is LargeTextArea', () => {
    it('and a formulaExpression is provided without an errorMessage, we should get an error', () => {
        const field = createTestScreenField('field1', 'LargeTextArea', SCREEN_NO_DEF_VALUE, { validation: false });
        field.validationRule.formulaExpression = { value: 'abc', error: null };
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('errorMessage', '', rules.validationRule.errorMessage)).toBe(
            LABELS.cannotBeBlank
        );
    });
    it('and a errorMessage is provided without an formulaExpression, we should get an error', () => {
        const field = createTestScreenField('field1', 'LargeTextArea', SCREEN_NO_DEF_VALUE, { validation: false });
        field.validationRule.errorMessage = { value: 'abc', error: null };
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('formulaExpression', '', rules.validationRule.formulaExpression)).toBe(
            LABELS.cannotBeBlank
        );
    });
    it('and both errorMessage and formulaExpression are provided, there should be no error', () => {
        const field = createTestScreenField('field1', 'LargeTextArea', SCREEN_NO_DEF_VALUE, { validation: true });
        const rules = getRulesForField(field);
        expect(
            screenValidation.validateProperty(
                'formulaExpression',
                field.validationRule.formulaExpression.value,
                rules.validationRule.formulaExpression
            )
        ).toBeNull();
        expect(
            screenValidation.validateProperty(
                'errorMessage',
                field.validationRule.errorMessage.value,
                rules.validationRule.errorMessage
            )
        ).toBeNull();
    });
    it('and default value is a reference, there should be no error', () => {
        const field = createTestScreenField('field1', 'LargeTextArea');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('defaultValue', '{!myVar}', rules.defaultValue)).toBeNull();
    });
});

describe('When field type is Section', () => {
    it('validates child fields', () => {
        Store.setMockState(flowWithAllElementsUIModel);
        const field1 = createTestScreenField('field1', 'LargeTextArea');
        const field2 = createTestScreenField('field2', 'DisplayText');
        let section = {
            guid: 'section1',
            name: 'section1',
            fieldType: 'RegionContainer',
            fields: [
                {
                    guid: 'column1',
                    name: 'column1',
                    fieldType: 'Region',
                    type: {
                        name: 'Column'
                    },
                    inputParameters: [
                        {
                            name: 'width',
                            value: '6'
                        }
                    ],
                    fields: []
                },
                {
                    guid: 'column2',
                    name: 'column2',
                    fieldType: 'Region',
                    type: {
                        name: 'Column'
                    },
                    inputParameters: [
                        {
                            name: 'width',
                            value: '6'
                        }
                    ],
                    fields: [field1, field2]
                }
            ]
        };
        section.fields[1].fields[0].name.value = '';
        section = screenValidation.validateAll(section);
        expect(section.fields[1].fields[0].name.error).toBe('FlowBuilderValidation.cannotBeBlank');
    });
});

describe('When Section have child fields', () => {
    it('should not set an error if default value is a reference', () => {
        Store.setMockState(flowWithAllElementsUIModel);
        setExtensionDescriptions(mockFlowExtensionDetails);
        const screenNode = getElementForPropertyEditor(screenWithSection);
        const screen = screenValidation.validateAll(screenNode);
        expect(screen.fields[2].fields[0].fields[1].defaultValue).toMatchObject({
            error: null,
            value: '$System.OriginDateTime'
        });
    });
});

it('validates dynamic type mappings', () => {
    const validation = getDynamicTypeMappingValidation();
    expect(validation.validateProperty('dynamicTypeMapping', '')).toBe('FlowBuilderValidation.cannotBeBlank');
    expect(validation.validateProperty('dynamicTypeMapping', 'Asset')).toBeNull();
});

describe('test validateFieldNameUniquenessLocally method', () => {
    const state = {
        guid: '4d5aac2b-4a24-4abc-b16d-c5d717f0eee4',
        name: { value: 'Section1', error: null },
        fields: [
            {
                guid: '84d10ece-6003-4ded-a378-f1c5d8ea71f5',
                name: { value: 'NewColumn', error: null },
                fields: [
                    {
                        guid: '79f426c9-5726-4333-b529-18004e72dc43',
                        name: { value: 'text1', error: null },
                        fields: []
                    },
                    {
                        guid: 'a5b2e015-b91c-4b6b-880e-fdf0677a1ff5',
                        name: { value: '', error: null },
                        fields: []
                    }
                ]
            }
        ]
    };

    const guid = 'a5b2e015-b91c-4b6b-880e-fdf0677a1ff5';

    it('fails with duplicate name in section', () => {
        expect(screenValidation.validateFieldNameUniquenessLocally(state, 'text1', guid)).not.toBeNull();
    });

    it('passes with unique names in section', () => {
        expect(screenValidation.validateFieldNameUniquenessLocally(state, 'text2', guid)).toBeNull();
    });
});
