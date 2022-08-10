const {
    startElement: mockAccountTriggeredRecord,
    updateTriggerRecordWithRelatedFields
} = require('mock/storeDataRecordTriggered');

const {
    accountFields: mockAccountRelatedRecordFields
} = require('serverData/GetRelatedRecordFieldsForEntity/accountFields.json');

export const mockFieldsPerRelatedRecordValue = new Map([
    [
        updateTriggerRecordWithRelatedFields.inputReference,
        [mockAccountTriggeredRecord, mockAccountRelatedRecordFields.ParentId, mockAccountRelatedRecordFields.Contacts]
    ]
]);
