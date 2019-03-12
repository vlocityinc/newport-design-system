import { addToParentElementCache, getElementFromParentElementCache } from 'builder_platform_interaction/comboboxCache';
import { comboboxInitialConfig } from "mock/comboboxData";

const accountVar = comboboxInitialConfig.menuData[1].items[0];
const contactVar = comboboxInitialConfig.menuData[1].items[1];

jest.mock('builder_platform_interaction/storeLib', () => {
    const mockStoreLib = require('builder_platform_interaction_mocks/storeLib');
    return mockStoreLib;
});

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        apexScalarVariablesSelector: jest.fn(() => []),
    };
});

describe('combobox cache tests', () => {
    it('adding an item to the cache and reading it back works properly', () => {
        addToParentElementCache(accountVar.displayText, accountVar);
        const accountVarFromCache = getElementFromParentElementCache(accountVar.displayText);
        expect(accountVarFromCache).toEqual(accountVar);
    });

    it('trying to add an item to the cache with hasNext not true throws an error', () => {
        const textVar = comboboxInitialConfig.menuData[2].items[0];
        expect(() => {
            addToParentElementCache(textVar.displayText, textVar);
        }).toThrow('hasNext must be true for items in this cache!');
    });

    it('Trying to fetch an item not in the cache returns undefined', () => {
        const contactVarFromCache = getElementFromParentElementCache(contactVar.displayText);
        expect(contactVarFromCache).toBeUndefined();
    });
});