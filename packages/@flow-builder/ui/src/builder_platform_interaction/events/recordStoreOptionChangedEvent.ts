import { WAY_TO_STORE_FIELDS } from 'builder_platform_interaction/recordEditorLib';

const eventName = 'recordstoreoptionchanged';

type RecordStoreOptionChangedEventDetail = {
    getFirstRecordOnly: boolean;
    wayToStoreFields: WAY_TO_STORE_FIELDS;
    assignNullToVariableNoRecord?: boolean;
};

export class RecordStoreOptionChangedEvent extends CustomEvent<RecordStoreOptionChangedEventDetail> {
    constructor(
        getFirstRecordOnly: boolean,
        wayToStoreFields: WAY_TO_STORE_FIELDS,
        assignNullToVariableNoRecord = false
    ) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                getFirstRecordOnly,
                wayToStoreFields,
                assignNullToVariableNoRecord
            }
        });
    }

    static EVENT_NAME = eventName;
}
