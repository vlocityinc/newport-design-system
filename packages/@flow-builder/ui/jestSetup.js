import { Store } from 'builder_platform_interaction_mocks/storeLib';
import { format } from 'util';

window.runningJestTest = true;
window.processEnv = { NODE_ENV: 'development' };

jest.mock('builder_platform_interaction/loggingUtils', () =>
    require('builder_platform_interaction_mocks/loggingUtils')
);

/**
 * This file runs before each test after the test framework has been installed in the environment
 */

let consoleError;

beforeEach(() => {
    consoleError = undefined;
    jest.spyOn(global.console, 'error').mockImplementation((...args) => {
        const formattedMessage = format(...args);
        // Currently the error for no URL is supressed because of problems with editor tests
        // Todo: fix the no URL set error in editor.test.ts GUS work item: https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000008WUa5IAG/view
        if (!formattedMessage.includes('Undefined url value')) {
            consoleError = new Error(`Console errors are not allowed. Console error message is :\n${formattedMessage}`);
        }
    });
});

afterEach(() => {
    // Clean up DOM after running to each test run
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
    if (consoleError) {
        throw consoleError;
    }
});

// we want every test to have a clean store. Since individual tests execute synchronously this will not interfere with another test's store
beforeAll(() => {
    Store.resetStore();
});

afterAll(() => {
    Store.resetStore();
});

// fail test suite on unhandled promise rejection
// eslint-disable-next-line lwc-core/no-process-env
process.on('unhandledRejection', error => {
    throw error;
});
