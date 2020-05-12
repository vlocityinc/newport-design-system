// @ts-nocheck
import { getStoreElements, flattenElements } from '../storeElementsFilter';
import * as store from 'mock/storeData';
import { getScreenElement } from '../resourceUtils';
import { mockScreenElement } from 'mock/calloutData';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('../resourceUtils', () => {
    return {
        getScreenElement: jest.fn().mockImplementation(() => mockScreenElement)
    };
});

let mockReadableSelectorValue;

const mockWritableElement = {
    name: 'writable'
};
const mockReadableElement = {
    name: 'readable'
};
const mockSobjectElement = {
    name: 'sobject'
};

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        writableElementsSelector: jest.fn(() => {
            return mockWritableElement;
        }),
        isOrCanContainsObjectOrSObjectCollectionSelector: jest.fn(() => () => {
            return mockSobjectElement;
        }),
        readableElementsSelector: jest.fn(() => {
            return mockReadableSelectorValue ? mockReadableSelectorValue : mockReadableElement;
        })
    };
});

describe('get store elements', () => {
    afterEach(() => {
        getScreenElement.mockReset();
    });
    // TODO: W-5470931 more tests for getStoreElements
    it('returns elements based on element type - source data from store alone', () => {
        mockReadableSelectorValue = [store.outcome];
        getScreenElement.mockReturnValue(null);
        const menuData = getStoreElements(jest.fn(), {
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: false
        });
        expect(menuData).toHaveLength(1);
    });

    it('returns elements based on element type - source data from store and localstorage', () => {
        mockReadableSelectorValue = [store.outcome];
        getScreenElement.mockReturnValue(mockScreenElement);
        const menuData = getStoreElements(jest.fn(), {
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            shouldBeWritable: false
        });

        expect(menuData.length).toBeGreaterThan(10);
    });
    it('Should rely on sobject selector if sobject selector config is set', () => {
        expect(
            getStoreElements(jest.fn(), {
                sObjectSelectorConfig: {}
            })
        ).toEqual(mockSobjectElement);
    });
    it('Should return all nested screen field elements when flatten the screen element', () => {
        getScreenElement.mockReturnValue(mockScreenElement);
        const elements = flattenElements(getScreenElement());
        expect(elements).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ guid: 'e1b88c4a-1a78-42d2-8057-93e2401bbdd4' }),
                expect.objectContaining({ guid: 'region-container-1' }),
                expect.objectContaining({ guid: 'region-container-1-region-1' }),
                expect.objectContaining({ guid: 'region-container-1-region-2' }),
                expect.objectContaining({ guid: 'region-container-1-region-1-input-field-1' }),
                expect.objectContaining({ guid: 'region-container-1-region-1-input-field-2' }),
                expect.objectContaining({ guid: 'region-container-1-region-2-input-field-1' }),
                expect.objectContaining({ guid: 'region-container-1-region-2-input-field-2' })
            ])
        );
    });

    describe('CLUD elements', () => {
        beforeAll(() => {
            mockReadableSelectorValue = undefined;
        });
        test.each`
            elementType                   | shouldBeWritable | expected               | message
            ${ELEMENT_TYPE.RECORD_CREATE} | ${true}          | ${mockWritableElement} | ${'writable'}
            ${ELEMENT_TYPE.RECORD_CREATE} | ${false}         | ${mockReadableElement} | ${'readable'}
            ${ELEMENT_TYPE.RECORD_LOOKUP} | ${true}          | ${mockWritableElement} | ${'writable'}
            ${ELEMENT_TYPE.RECORD_LOOKUP} | ${false}         | ${mockReadableElement} | ${'readable'}
            ${ELEMENT_TYPE.RECORD_UPDATE} | ${true}          | ${mockWritableElement} | ${'writable'}
            ${ELEMENT_TYPE.RECORD_UPDATE} | ${false}         | ${mockReadableElement} | ${'readable'}
            ${ELEMENT_TYPE.RECORD_DELETE} | ${true}          | ${mockWritableElement} | ${'writable'}
            ${ELEMENT_TYPE.RECORD_DELETE} | ${false}         | ${mockReadableElement} | ${'readable'}
        `(
            'Should return $message element with no sobject selector config',
            ({ elementType, shouldBeWritable, expected }) => {
                expect(
                    getStoreElements(jest.fn(), {
                        elementType,
                        shouldBeWritable
                    })
                ).toEqual(expected);
            }
        );
    });
});
