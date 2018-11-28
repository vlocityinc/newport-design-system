import { flowPropertiesEditorValidation } from '../flowPropertiesEditorValidation';
import { LABELS } from "builder_platform_interaction/validationRules";

describe('FlowPropertiesValidations', () => {
    describe('Process Type property', () => {
        it('should return an error if null.', () => {
            expect(flowPropertiesEditorValidation.validateProperty('processType', null)).toBe(LABELS.cannotBeBlank);
        });
        it('should not return an error if valid processType is entered.', () => {
            expect(flowPropertiesEditorValidation.validateProperty('stageOrder', 'Autolauched Flow')).toBe(null);
        });
    });
});