import { mergeWithInputOutputParameters } from '../calloutEditorLib';
import { emailAlertOnAccount } from 'mock/storeData';
import { chatterPostActionDetails } from 'serverData/GetInvocableActionDetails/chatterPostActionDetails.json';
import { actionCallAutomaticOutput } from 'mock/storeData';

describe('mergeWithInputOutputParameters', () => {
    it('sets "storeOutputAutomatically" from true to false if no output parameters', () => {
        const currentState = {
            ...emailAlertOnAccount,
            storeOutputAutomatically: true
        };
        const newState = mergeWithInputOutputParameters(currentState, []);
        expect(newState.storeOutputAutomatically).toBe(false);
    });

    it('keeps "storeOutputAutomatically" set to false if no output parameters', () => {
        const currentState = {
            ...emailAlertOnAccount
        };
        expect(currentState.storeOutputAutomatically).toBe(false);
        const newState = mergeWithInputOutputParameters(currentState, []);
        expect(newState.storeOutputAutomatically).toBe(false);
    });

    it('keeps "storeOutputAutomatically" set to true if output parameters present', () => {
        const currentState = {
            ...actionCallAutomaticOutput
        };
        const newState = mergeWithInputOutputParameters(
            currentState,
            chatterPostActionDetails.parameters
        );
        expect(newState.storeOutputAutomatically).toBe(true);
    });
});
