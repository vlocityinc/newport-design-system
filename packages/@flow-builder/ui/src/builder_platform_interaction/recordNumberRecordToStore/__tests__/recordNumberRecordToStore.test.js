import { createElement } from 'lwc';
import RecordNumberRecordToStore from 'builder_platform_interaction/recordNumberRecordToStore';
import { NumberRecordToStoreChangedEvent } from 'builder_platform_interaction/events';
import { NUMBER_RECORDS_OPTIONS } from '../../recordLookupEditor/recordLookupEditorLabels';
import { NUMBER_RECORDS_TO_STORE } from 'builder_platform_interaction/recordEditorLib';

const createComponentUnderTest = props => {
    const el = createElement(
        'builder_platform_interaction-record-number-record-to-store',
        {
            is: RecordNumberRecordToStore
        }
    );
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
};

const SELECTORS = {
    lightningGroupButton: 'lightning-radio-group'
};

const getLightningGroupButton = recordNumberRecordToStore =>
    recordNumberRecordToStore.shadowRoot.querySelector(
        SELECTORS.lightningGroupButton
    );

describe('record-number-record-to-store', () => {
    describe('handle events', () => {
        it('handle "onchange" event and fires "NumberRecordToStoreChangedEvent"', async () => {
            const recordNumberRecordToStore = createComponentUnderTest({
                recordStoreOptions: NUMBER_RECORDS_OPTIONS,
                numberRecordsToStoreValue: NUMBER_RECORDS_TO_STORE.FIRST_RECORD
            });
            const eventCallback = jest.fn();
            recordNumberRecordToStore.addEventListener(
                NumberRecordToStoreChangedEvent.EVENT_NAME,
                eventCallback
            );
            getLightningGroupButton(recordNumberRecordToStore).dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: NUMBER_RECORDS_TO_STORE.ALL_RECORDS
                    }
                })
            );

            await Promise.resolve();
            expect(eventCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { getFirstRecordOnly: false }
                })
            );
        });
    });
});
