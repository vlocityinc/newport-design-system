import { Store } from 'builder_platform_interaction_mocks/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';

jest.mock('builder_platform_interaction/loggingUtils', () =>
    require('builder_platform_interaction_mocks/loggingUtils')
);

/**
 * This file runs before each test after the test framework has been installed in the environment
 */

/**
 * Cleanup DOM after each test
 */
afterEach(() => {
    // Clean up DOM after running to each test run
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});

// we want every test to have a clean store. Since individual tests execute synchronously this will not interfere with another test's store
beforeAll(() => {
    Store.resetStore();
});

afterAll(() => {
    Store.resetStore();
});
