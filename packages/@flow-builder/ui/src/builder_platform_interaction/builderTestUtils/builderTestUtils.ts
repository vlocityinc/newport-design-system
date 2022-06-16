export * from './combobox';
export * from './commonTestUtils';
export * from './complexTypeTestUtils';
export * from './deepFindMatchers';
export * from './domTestUtils';
export * from './events';
export * from './goldObjectMatchers';
export * from './manuallyAssignVariablesCheckboxTestUtils';
export * from './screenEditorTestUtils';
export * from './selectors';

// @sa11y testing appears to take some extra time (beyond the given 5000ms default jest timeout)
export const ACCESSIBILITY_TEST_TIMEOUT_IN_MS = 15000;

/**
 * Mocks a label in jest
 *
 * @param jest - The jest instance
 * @param labelName - The label name
 * @returns the mock label
 */
export function mockLabel(jest, labelName: string) {
    jest.mock(
        `@salesforce/label/${labelName}`,
        () => {
            return { default: `${labelName} mock value` };
        },
        { virtual: true }
    );

    return `${labelName} mock value`;
}
