import { mapReducer } from '../mapReducer';
import { CollectionReferenceChangedEvent } from 'builder_platform_interaction/events';
import * as store from 'mock/storeData';

describe('map-reducer', () => {
    let originalState;
    beforeEach(() => {
        originalState = {
            collectionReference: { value: store.accountSObjectCollectionVariable.guid, error: null },
            mapItems: [],
            currentValueFromCollection: { value: store.contactSObjectVariable.name, error: null },
            outputTable: { value: 'Contact', error: null },
            storeOutputAutomatically: true
        };
    });

    describe('updates properties', () => {
        it('updates input collection', () => {
            const event = {
                type: CollectionReferenceChangedEvent.EVENT_NAME,
                detail: {
                    value: store.caseSObjectCollectionVariable.guid,
                    error: null
                }
            };
            const newState = mapReducer(originalState, event);
            expect(newState.collectionReference.value).toEqual(event.detail.value);
        });
    });
    describe('errors', () => {
        it('from the input collection', () => {
            const event = {
                type: CollectionReferenceChangedEvent.EVENT_NAME,
                detail: {
                    value: 'invalidCollection',
                    error: 'Entered an invalid value'
                }
            };
            const newState = mapReducer(originalState, event);
            expect(newState.collectionReference.error).toEqual(event.detail.error);
        });
    });
    // TODO: will add more tests in next PR
});
