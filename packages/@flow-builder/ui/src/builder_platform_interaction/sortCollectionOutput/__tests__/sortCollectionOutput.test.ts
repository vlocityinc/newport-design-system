// @ts-nocheck
import {
    changeEvent,
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { UpdateSortCollectionOutputEvent } from 'builder_platform_interaction/events';
import SortCollectionOutput from 'builder_platform_interaction/sortCollectionOutput';
import { LIMIT_RANGE, SORT_OUTPUT_OPTION } from 'builder_platform_interaction/sortEditorLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { createElement } from 'lwc';
import { flowWithAllElementsUIModel } from 'mock/storeData';

const createComponentUnderTest = ({
    limit = { value: null, error: null },
    selectedOutput = SORT_OUTPUT_OPTION.ALL
} = {}) => {
    const el = createElement('builder_platform_interaction-sort-collection-output', {
        is: SortCollectionOutput
    });
    Object.assign(el, { limit, selectedOutput });
    setDocumentBodyChildren(el);
    return el;
};

jest.mock('builder_platform_interaction/storeLib', () => {
    // this is needed for some reason even if createSelector isn't mocked
    function createSelector() {
        const actual = jest.requireActual('builder_platform_interaction/storeLib');
        return actual.createSelector;
    }
    const storeMockLib = require('builder_platform_interaction_mocks/storeLib');
    storeMockLib.createSelector = createSelector;
    return storeMockLib;
});

const getSortOutputRadioGroup = (sortCollectionOutput) =>
    sortCollectionOutput.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_RADIO_GROUP);
const getLimitText = (sortCollectionOutput) =>
    sortCollectionOutput.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_INPUT);

describe('sort-collection-output', () => {
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });

    describe('without values', () => {
        let sortCollectionOutput;
        beforeEach(() => {
            sortCollectionOutput = createComponentUnderTest();
        });
        it('shows radio group', () => {
            const sortOutputRadio = getSortOutputRadioGroup(sortCollectionOutput);
            expect(sortOutputRadio).not.toBeNull();
            expect(sortOutputRadio.value).toEqual(SORT_OUTPUT_OPTION.ALL);
        });
        it('does not show limit', () => {
            expect(getLimitText(sortCollectionOutput)).toBeNull();
        });
    });
    describe('with values', () => {
        let sortCollectionOutput;
        it('show limit without value', () => {
            sortCollectionOutput = createComponentUnderTest({
                selectedOutput: SORT_OUTPUT_OPTION.CUSTOM
            });
            const limit = getLimitText(sortCollectionOutput);
            expect(limit).not.toBeNull();
            expect(limit.value).toBeNull();
        });
        it('show limit with value', () => {
            sortCollectionOutput = createComponentUnderTest({
                selectedOutput: SORT_OUTPUT_OPTION.CUSTOM,
                limit: { value: '10', error: null }
            });
            const limit = getLimitText(sortCollectionOutput);
            expect(limit).not.toBeNull();
            expect(limit.value).toEqual('10');
        });
    });
    describe('handle events', () => {
        describe('change from All to Custom', () => {
            let sortCollectionOutput, selectedOutputRadio;
            it('fires updateSortCollectionOutputEvent', async () => {
                sortCollectionOutput = createComponentUnderTest();
                selectedOutputRadio = getSortOutputRadioGroup(sortCollectionOutput);
                await ticks(1);
                const eventCallback = jest.fn();
                const newValue = SORT_OUTPUT_OPTION.CUSTOM;
                sortCollectionOutput.addEventListener(UpdateSortCollectionOutputEvent.EVENT_NAME, eventCallback);
                selectedOutputRadio.dispatchEvent(changeEvent(newValue));
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0].detail).toMatchObject({
                    selectedOutput: SORT_OUTPUT_OPTION.CUSTOM,
                    limit: null
                });
            });

            it('show limit text when changing', async () => {
                sortCollectionOutput = createComponentUnderTest();
                selectedOutputRadio = getSortOutputRadioGroup(sortCollectionOutput);
                const newValue = SORT_OUTPUT_OPTION.CUSTOM;
                selectedOutputRadio.dispatchEvent(changeEvent(newValue));
                await ticks(1);
                const limit = getLimitText(sortCollectionOutput);
                expect(limit).not.toBeNull();
            });
        });
        describe('change limit number', () => {
            it('fires updateSortCollectionOutputEvent', async () => {
                const sortCollectionOutput = createComponentUnderTest({ selectedOutput: SORT_OUTPUT_OPTION.CUSTOM });
                const limit = getLimitText(sortCollectionOutput);
                await ticks(1);
                const eventCallback = jest.fn();
                const newValue = 10;
                sortCollectionOutput.addEventListener(UpdateSortCollectionOutputEvent.EVENT_NAME, eventCallback);
                limit.dispatchEvent(changeEvent(newValue));
                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0].detail).toMatchObject({
                    selectedOutput: SORT_OUTPUT_OPTION.CUSTOM,
                    limit: newValue
                });
            });
            it('shows error when limit is invalid', async () => {
                const sortCollectionOutput = createComponentUnderTest({ selectedOutput: SORT_OUTPUT_OPTION.CUSTOM });
                const limit = getLimitText(sortCollectionOutput);
                await ticks(1);
                const eventCallback = jest.fn();
                const newValue = LIMIT_RANGE.max + 1;
                sortCollectionOutput.addEventListener(UpdateSortCollectionOutputEvent.EVENT_NAME, eventCallback);
                limit.dispatchEvent(changeEvent(newValue));
                expect(limit.validity.valid).toBeFalsy();
            });
        });
    });
});
