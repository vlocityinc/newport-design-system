import { createElement } from 'lwc';
import RecordStoreOption from 'builder_platform_interaction/recordStoreOptions';
import { RecordStoreOptionChangedEvent } from 'builder_platform_interaction/events';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    NUMBER_RECORDS_TO_STORE,
    WAY_TO_STORE_FIELDS
} from 'builder_platform_interaction/recordEditorLib';

const createComponentUnderTest = (elementType, props) => {
    const el = createElement(
        'builder_platform_interaction-record-store-options',
        {
            is: RecordStoreOption
        }
    );
    el.elementType = elementType;
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
};

const selectors = {
    lightningRadioGroup: 'lightning-radio-group',
    lightningFormattedRichText: 'lightning-formatted-rich-text',
    lightningCombobox: 'lightning-input'
};

const getNumberRecordsToStoreRadioGroup = recordStoreOptionComponent => {
    const numberRecordsToStoreRadioGroup = recordStoreOptionComponent.shadowRoot.querySelectorAll(
        selectors.lightningRadioGroup
    );
    return numberRecordsToStoreRadioGroup[0];
};

const getWayToStoreFieldsRadioGroup = recordStoreOptionComponent => {
    const numberRecordsToStoreRadioGroup = recordStoreOptionComponent.shadowRoot.querySelectorAll(
        selectors.lightningRadioGroup
    );
    return numberRecordsToStoreRadioGroup[1];
};

const getTitle = recordStoreOptionComponent => {
    const formattedRichText = recordStoreOptionComponent.shadowRoot.querySelector(
        selectors.lightningFormattedRichText
    );
    return formattedRichText;
};

const getAssignNullIfNoRecordFoundCombobox = recordStoreOptionComponent => {
    const assignNullIfNoRecordFoundCombobox = recordStoreOptionComponent.shadowRoot.querySelector(
        selectors.lightningCombobox
    );
    return assignNullIfNoRecordFoundCombobox;
};

const getChangeEvent = eventValue => {
    return new CustomEvent('change', {
        detail: {
            value: eventValue
        }
    });
};

const getCheckedEvent = eventValue => {
    return new CustomEvent('change', {
        detail: {
            checked: eventValue
        }
    });
};

const getRecordStoreOptionChangedEventDetail = (
    assignNullToVariableNoRecordValue,
    getFirstRecordOnlyValue,
    wayToStoreFieldsValue
) => {
    return {
        assignNullToVariableNoRecord: assignNullToVariableNoRecordValue,
        getFirstRecordOnly: getFirstRecordOnlyValue,
        wayToStoreFields: wayToStoreFieldsValue
    };
};

describe('record-store-options default', () => {
    let recordStoreOptionComponent;
    beforeEach(() => {
        recordStoreOptionComponent = createComponentUnderTest(
            ELEMENT_TYPE.RECORD_LOOKUP
        );
    });
    test('Should have 2 options to store records', () => {
        expect(
            getNumberRecordsToStoreRadioGroup(recordStoreOptionComponent)
                .options
        ).toHaveLength(2);
    });
    test('Should have 2 options to way to store fields', () => {
        expect(
            getWayToStoreFieldsRadioGroup(recordStoreOptionComponent).options
        ).toHaveLength(2);
    });
    test('Check Radio Button default is firstRecord', () => {
        expect(
            getNumberRecordsToStoreRadioGroup(recordStoreOptionComponent).value
        ).toBe(NUMBER_RECORDS_TO_STORE.FIRST_RECORD);
    });
    test('Check Radio Button default is SObject Variable', () => {
        expect(
            getWayToStoreFieldsRadioGroup(recordStoreOptionComponent).value
        ).toBe(WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
    });
    test('checkbox "Assign Null if no record found" is not checked', () => {
        expect(
            getAssignNullIfNoRecordFoundCombobox(recordStoreOptionComponent)
                .checked
        ).toBe(false);
    });
    test('Event RecordStoreOptionChangedEvent is dispatched after selected radio button changed', async () => {
        const eventCallback = jest.fn();
        recordStoreOptionComponent.addEventListener(
            RecordStoreOptionChangedEvent.EVENT_NAME,
            eventCallback
        );
        getNumberRecordsToStoreRadioGroup(
            recordStoreOptionComponent
        ).dispatchEvent(getChangeEvent(NUMBER_RECORDS_TO_STORE.ALL_RECORDS));
        await Promise.resolve();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail).toMatchObject(
            getRecordStoreOptionChangedEventDetail(
                false,
                false,
                WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
            )
        );
    });
    test('checkbox "Assign Null if no record found" changed', async () => {
        const eventCallback = jest.fn();
        recordStoreOptionComponent.addEventListener(
            RecordStoreOptionChangedEvent.EVENT_NAME,
            eventCallback
        );
        getAssignNullIfNoRecordFoundCombobox(
            recordStoreOptionComponent
        ).dispatchEvent(getCheckedEvent(true));
        await Promise.resolve();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail).toMatchObject(
            getRecordStoreOptionChangedEventDetail(
                true,
                true,
                WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
            )
        );
    });
    test('Event RecordStoreOptionChangedEvent is dispatched after selected way to store fields radio button changed to SObject Variable', async () => {
        const eventCallback = jest.fn();
        recordStoreOptionComponent.addEventListener(
            RecordStoreOptionChangedEvent.EVENT_NAME,
            eventCallback
        );
        getWayToStoreFieldsRadioGroup(recordStoreOptionComponent).dispatchEvent(
            getChangeEvent(WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE)
        );
        await Promise.resolve();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail).toMatchObject(
            getRecordStoreOptionChangedEventDetail(
                false,
                true,
                WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
            )
        );
    });
    test('Event RecordStoreOptionChangedEvent is dispatched after selected way to store fields radio button changed to Separate Variables', async () => {
        const eventCallback = jest.fn();
        recordStoreOptionComponent.addEventListener(
            RecordStoreOptionChangedEvent.EVENT_NAME,
            eventCallback
        );
        getWayToStoreFieldsRadioGroup(recordStoreOptionComponent).dispatchEvent(
            getChangeEvent(WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES)
        );
        await Promise.resolve();
        expect(eventCallback).toHaveBeenCalled();
        expect(eventCallback.mock.calls[0][0].detail).toMatchObject(
            getRecordStoreOptionChangedEventDetail(
                false,
                true,
                WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES
            )
        );
    });
});

describe('record-store-options with values', () => {
    let recordStoreOptionComponent;
    test('Check Radio Button is firstRecord if outputReference refers to sObject variable', () => {
        recordStoreOptionComponent = createComponentUnderTest(
            ELEMENT_TYPE.RECORD_LOOKUP,
            { numberOfRecordsToStore: NUMBER_RECORDS_TO_STORE.FIRST_RECORD }
        );
        expect(
            getNumberRecordsToStoreRadioGroup(recordStoreOptionComponent).value
        ).toBe(NUMBER_RECORDS_TO_STORE.FIRST_RECORD);
    });
    test('Check Radio Button is allRecords if outputReference refers to sObject collection variable', () => {
        recordStoreOptionComponent = createComponentUnderTest(
            ELEMENT_TYPE.RECORD_LOOKUP,
            { numberOfRecordsToStore: NUMBER_RECORDS_TO_STORE.ALL_RECORDS }
        );
        expect(
            getNumberRecordsToStoreRadioGroup(recordStoreOptionComponent).value
        ).toBe(NUMBER_RECORDS_TO_STORE.ALL_RECORDS);
    });
    test('Check Radio Button is SObject Variable if passed as parameter', () => {
        recordStoreOptionComponent = createComponentUnderTest(
            ELEMENT_TYPE.RECORD_LOOKUP,
            { wayToStoreFields: WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE }
        );
        expect(
            getWayToStoreFieldsRadioGroup(recordStoreOptionComponent).value
        ).toBe(WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
    });
    test('Check Radio Button is Separate Variable if passed as parameter', () => {
        recordStoreOptionComponent = createComponentUnderTest(
            ELEMENT_TYPE.RECORD_LOOKUP,
            { wayToStoreFields: WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES }
        );
        expect(
            getWayToStoreFieldsRadioGroup(recordStoreOptionComponent).value
        ).toBe(WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES);
    });
    test('checkbox "Assign Null if no record found" is checked', () => {
        recordStoreOptionComponent = createComponentUnderTest(
            ELEMENT_TYPE.RECORD_LOOKUP,
            { assignNullValuesIfNoRecordsFound: true }
        );
        expect(
            getAssignNullIfNoRecordFoundCombobox(recordStoreOptionComponent)
                .checked
        ).toBe(true);
    });
});

describe('record-store-options Record Create', () => {
    let recordStoreOptionComponent;
    beforeEach(() => {
        recordStoreOptionComponent = createComponentUnderTest(
            ELEMENT_TYPE.RECORD_CREATE
        );
    });
    test('Check Label', () => {
        expect(recordStoreOptionComponent).toBeDefined();
        expect(getTitle(recordStoreOptionComponent)).toBeNull();
    });
});
