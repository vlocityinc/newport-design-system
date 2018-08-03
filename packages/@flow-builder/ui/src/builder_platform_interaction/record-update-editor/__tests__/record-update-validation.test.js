import { recordUpdateValidation } from '../record-update-validation';
import * as storeMockedData from 'mock-store-data';
import { LABELS } from 'builder_platform_interaction-validation-rules';

describe('Check validations', () => {
    describe('when props set to inputReference', () => {
        let recordUpdateElementWithValidSObject;
        beforeEach(() => {
            recordUpdateElementWithValidSObject = {
                description : {value: '', error: null},
                elementType : 'RECORD_UPDATE',
                guid : 'RECORDUPDATE_1',
                isCanvasElement : true,
                label : {value: 'testRecord', error: null},
                locationX : 358,
                locationY : 227,
                name : {value: 'testRecord', error: null},
                inputReference : {value: storeMockedData.accountSObjectVariableGuid, error: null}
            };
        });
        it('should return same object if valid', () => {
            expect(recordUpdateValidation.validateAll(recordUpdateElementWithValidSObject)).toEqual(recordUpdateElementWithValidSObject);
        });
        it('should return an error if blank', () => {
            recordUpdateElementWithValidSObject.inputReference.value = '';
            const validatedRecordUpdate =  recordUpdateValidation.validateAll(recordUpdateElementWithValidSObject);
            expect(validatedRecordUpdate.inputReference.error).toBe(LABELS.cannotBeBlank);
        });
        it('should return an error if null', () => {
            recordUpdateElementWithValidSObject.inputReference.value = null;
            const validatedRecordUpdate =  recordUpdateValidation.validateAll(recordUpdateElementWithValidSObject);
            expect(validatedRecordUpdate.inputReference.error).toBe(LABELS.cannotBeBlank);
        });
    });
});