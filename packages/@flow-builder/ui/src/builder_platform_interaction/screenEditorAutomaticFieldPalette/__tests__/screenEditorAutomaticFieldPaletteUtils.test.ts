import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { userFields } from 'serverData/GetFieldsForEntity/userFields.json';
import { getAutomaticFieldIcon, isAutomaticFieldRequired } from '../screenEditorAutomaticFieldPaletteUtils';

describe('isAutomaticFieldRequired', () => {
    test('an automatic field is required if required attribute is true', () => {
        const field = userFields.Alias;
        expect(field.required).toBe(true);
        expect(isAutomaticFieldRequired(field)).toBe(true);
    });
    test('an automatic field is not required if required attribute is false', () => {
        const field = userFields.AboutMe;
        expect(field.required).toBe(false);
        expect(isAutomaticFieldRequired(field)).toBe(false);
    });
    test('a boolean automatic field is not required', () => {
        const field = userFields.EmailPreferencesAutoBcc;
        // boolean fields are never required
        expect(field.required).toBe(true);
        expect(isAutomaticFieldRequired(field)).toBe(false);
    });
    test('Account name automatic field is required, even if required attribute is false', () => {
        const field = accountFields.Name;
        // required is false for Account.Name if "Person Accounts" is enabled for the org (this is the case for the org used to create gold files).
        // But field is required whether account's record type is Business Account or Person Account.
        expect(field.required).toBe(false);
        expect(isAutomaticFieldRequired(field)).toBe(true);
    });
});
describe('getAutomaticFieldIcon', () => {
    test('palette icon for non-compound field', () => {
        const field = accountFields.Name;
        expect(getAutomaticFieldIcon(field)).toBe('utility:text');
    });
    test('palette icon for Person Name compound field', () => {
        const field = userFields.Name;
        expect(getAutomaticFieldIcon(field)).toBe('utility:identity');
    });
    test('palette icon for Address compound field', () => {
        const field = userFields.Address;
        expect(getAutomaticFieldIcon(field)).toBe('utility:checkin');
    });
});
