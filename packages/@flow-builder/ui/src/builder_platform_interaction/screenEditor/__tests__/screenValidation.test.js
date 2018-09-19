import { getRulesForField, screenValidation } from "../screenValidation";
import { createTestScreenField, SCREEN_NO_DEF_VALUE } from "builder_platform_interaction/builderTestUtils";
import { LABELS } from "builder_platform_interaction/validationRules";

describe('When field type is NUMBER', () => {
    it('and when valid scale is passed, no error should be returned', () => {
        const field = createTestScreenField('field1', 'Number');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('scale', "0", rules.scale)).toBeNull();
    });
    it('and when max value for valid scale is passed, no error should be returned', () => {
        const field = createTestScreenField('field1', 'Number');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('scale', "17", rules.scale)).toBeNull();
    });
    it('and when negative scale is passed, we should get a positive integer error', () => {
        const field = createTestScreenField('field1', 'Number');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('scale', "-1", rules.scale)).toBe(LABELS.shouldBeAPositiveIntegerOrZero);
    });
    it('and when invalid scale is passed, we should an over max value error', () => {
        const field = createTestScreenField('field1', 'Number');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('scale', "18", rules.scale)).toBe(LABELS.overMaxIntegerValue);
    });
});

describe('When field type is CURRENCY', () => {
    it('and when valid scale is passed, no error should be returned', () => {
        const field = createTestScreenField('field1', 'Currency');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('scale', "0", rules.scale)).toBeNull();
    });
    it('and when max value for valid scale is passed, no error should be returned', () => {
        const field = createTestScreenField('field1', 'Currency');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('scale', "17", rules.scale)).toBeNull();
    });
    it('and when negative scale is passed, we should get a positive integer error', () => {
        const field = createTestScreenField('field1', 'Currency');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('scale', "-1", rules.scale)).toBe(LABELS.shouldBeAPositiveIntegerOrZero);
    });
    it('and when invalid scale is passed, we should an over max value error', () => {
        const field = createTestScreenField('field1', 'Currency');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('scale', "18", rules.scale)).toBe(LABELS.overMaxIntegerValue);
    });
});

describe('When field type is DATE', () => {
    it('and when valid date is passed, no error should be returned', () => {
        const field = createTestScreenField('field1', 'Date');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('defaultValue', "01/02/2000", rules.defaultValue)).toBeNull();
    });
    it('and when an invalid date is passed, a valid date error should be returned', () => {
        const field = createTestScreenField('field1', 'Date');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('defaultValue', "abc", rules.defaultValue)).toBe(LABELS.mustBeAValidDate);
    });
});

describe('When field type is DisplayText', () => {
    it('and when valid display text is passed, no error should be returned', () => {
        const field = createTestScreenField('field1', 'DisplayText');
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('fieldText', "valid default value", rules.fieldText)).toBeNull();
    });
    it('and when the display text is too long, we should get an error about length', () => {
        const field = createTestScreenField('field1', 'DisplayText');
        const rules = getRulesForField(field);
        const displayTextStarter = 'this will get repeated until it is a giant string';
        expect(screenValidation.validateProperty('fieldText', displayTextStarter.repeat(2000), rules.fieldText)).toBe(LABELS.maximumCharactersLimit);
    });
});

describe('When field type is TextBox', () => {
    it('and a formulaExpression is provided without an errorMessage, we should get an error', () => {
        const field = createTestScreenField('field1', 'Number', SCREEN_NO_DEF_VALUE, {validation: false});
        field.formulaExpression = {value: 'abc', error: null};
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('errorMessage', "", rules.errorMessage)).toBe(LABELS.cannotBeBlank);
    });
    it('and a errorMessage is provided without an formulaExpression, we should get an error', () => {
        const field = createTestScreenField('field1', 'Number', SCREEN_NO_DEF_VALUE, {validation: false});
        field.errorMessage = {value: 'abc', error: null};
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('formulaExpression', "", rules.formulaExpression)).toBe(LABELS.cannotBeBlank);
    });
    it('and both errorMessage and formulaExpression are provided, there should be no error', () => {
        const field = createTestScreenField('field1', 'Number', SCREEN_NO_DEF_VALUE, {validation: true});
        const rules = getRulesForField(field);
        expect(screenValidation.validateProperty('formulaExpression', field.formulaExpression.value, rules.formulaExpression)).toBeNull();
        expect(screenValidation.validateProperty('errorMessage', field.errorMessage.value, rules.errorMessage)).toBeNull();
    });
});