import { getStoreElements } from '../storeElementsFilter';
import * as store from 'mock/storeData';
import * as selectorsMock from 'builder_platform_interaction/selectors';
import { getScreenElement } from '../resourceUtils';
import { mockScreenElement } from 'mock/calloutData';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('../resourceUtils', () => {
    return {
        getScreenElement: jest.fn().mockImplementation(() => mockScreenElement)
    };
});

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        writableElementsSelector: jest.fn(),
        sObjectOrSObjectCollectionByEntitySelector: jest.fn(),
        readableElementsSelector: jest.fn()
    };
});

describe('get store elements', () => {
    afterEach(() => {
        getScreenElement.mockReset();
    });
    // TODO: W-5470931 more tests for getStoreElements
    it('returns elements based on element type - source data from store alone', () => {
        selectorsMock.readableElementsSelector.mockReturnValue([store.outcome]);
        getScreenElement.mockReturnValue(null);
        const menuData = getStoreElements(jest.fn(), {
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: false
        });
        expect(menuData).toHaveLength(1);
    });

    it('returns elements based on element type - source data from store and localstorage', () => {
        selectorsMock.readableElementsSelector.mockReturnValue([store.outcome]);
        getScreenElement.mockReturnValue(mockScreenElement);
        const menuData = getStoreElements(jest.fn(), {
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: false
        });
        expect(menuData).toHaveLength(4);
    });
});
