// @ts-nocheck
import {
    AddSortOptionItemEvent,
    CollectionReferenceChangedEvent,
    DeleteSortOptionItemEvent,
    UpdateSortCollectionOutputEvent,
    UpdateSortOptionItemEvent
} from 'builder_platform_interaction/events';
import { SORT_OUTPUT_OPTION } from 'builder_platform_interaction/sortEditorLib';
import { sortReducer } from '../sortReducer';

describe('sort-reducer', () => {
    let originalState;
    beforeEach(() => {
        originalState = {
            collectionReference: { value: 'accountSObjectCollectionVariable', error: null },
            limit: { value: null, error: null },
            sortOptions: [
                {
                    sortField: { value: 'Id', error: null },
                    sortOrder: { value: 'Asc', erro: null },
                    doesPutEmptyStringAndNullFirst: false,
                    rowIndex: 'r1'
                },
                {
                    sortField: { value: 'Name', error: null },
                    sortOrder: { value: 'Desc', erro: null },
                    doesPutEmptyStringAndNullFirst: false,
                    rowIndex: 'r2'
                }
            ]
        };
    });

    describe('updates properties', () => {
        it('updates flow collection', () => {
            const event = {
                type: CollectionReferenceChangedEvent.EVENT_NAME,
                detail: {
                    value: 'caseSObjectCollectionVariable',
                    error: null
                }
            };
            const newState = sortReducer(originalState, event);
            expect(newState.collectionReference.value).toEqual(event.detail.value);
            // reset sort options
            expect(newState.sortOptions).toHaveLength(1);
            expect(newState.sortOptions[0].sortField.value).toBeNull();
        });
        it('add sortOption', () => {
            const event = {
                type: AddSortOptionItemEvent.EVENT_NAME,
                detail: {
                    index: originalState.sortOptions.length
                }
            };
            const newState = sortReducer(originalState, event);
            expect(newState.sortOptions).toHaveLength(3);
        });
        it('delete sortOption', () => {
            const event = {
                type: DeleteSortOptionItemEvent.EVENT_NAME,
                detail: {
                    index: 0
                }
            };
            const newState = sortReducer(originalState, event);
            expect(newState.sortOptions).toHaveLength(1);
            expect(newState.sortOptions[0].sortField.value).toEqual(originalState.sortOptions[1].sortField.value);
        });
        it('update sortOption', () => {
            const event = {
                type: UpdateSortOptionItemEvent.EVENT_NAME,
                detail: {
                    propertyName: 'sortField',
                    optionIndex: 0,
                    value: 'BillingCity',
                    error: null
                }
            };
            const newState = sortReducer(originalState, event);
            expect(newState.sortOptions).toHaveLength(2);
            expect(newState.sortOptions[0].sortField.value).toEqual(event.detail.value);
        });
        it('update sort output', () => {
            const event = {
                type: UpdateSortCollectionOutputEvent.EVENT_NAME,
                detail: {
                    selectedOutput: SORT_OUTPUT_OPTION.CUSTOM,
                    limit: '10',
                    error: null
                }
            };
            const newState = sortReducer(originalState, event);
            expect(newState.limit.value).toEqual('10');
        });
    });
    describe('errors', () => {
        it('from the flow collection', () => {
            const event = {
                type: CollectionReferenceChangedEvent.EVENT_NAME,
                detail: {
                    value: 'invalidCollection',
                    error: 'Entered an invalid value'
                }
            };
            const newState = sortReducer(originalState, event);
            expect(newState.collectionReference.error).toEqual(event.detail.error);
            // reset sort options
            expect(newState.sortOptions).toHaveLength(1);
            expect(newState.sortOptions[0].sortField.value).toBeNull();
        });
        it('from the sort options', () => {
            const event = {
                type: UpdateSortOptionItemEvent.EVENT_NAME,
                detail: {
                    propertyName: 'sortField',
                    optionIndex: 0,
                    value: 'invalidField',
                    error: 'Entered an invalid value'
                }
            };
            const newState = sortReducer(originalState, event);
            expect(newState.sortOptions).toHaveLength(2);
            expect(newState.sortOptions[0].sortField.error).toEqual(event.detail.error);
        });
    });
});
