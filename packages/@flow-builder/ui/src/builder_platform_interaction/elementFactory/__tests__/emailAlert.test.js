// @ts-nocheck
import { createEmailAlert, createDuplicateEmailAlert } from '../emailAlert';
import { emailAlertOnAccount } from 'mock/storeData';

describe('create email alert', () => {
    it('has store output automatically false on new email alert', () => {
        const newEmailAlert = createEmailAlert();
        expect(newEmailAlert.storeOutputAutomatically).toBe(false);
    });
    it('has store output automatically false when loading existing email alert', () => {
        const loadExistingEmailAlert = createEmailAlert(emailAlertOnAccount);
        expect(loadExistingEmailAlert.storeOutputAutomatically).toBe(false);
    });
    it('has store output automatically false when duplicating email alert', () => {
        const duplicateEmailAlert = createDuplicateEmailAlert(emailAlertOnAccount, 'newGuid', 'newName');
        expect(duplicateEmailAlert.duplicatedElement.storeOutputAutomatically).toBe(false);
    });
});
