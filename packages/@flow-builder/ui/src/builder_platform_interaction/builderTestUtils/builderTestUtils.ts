import { createElement } from 'lwc';
import { setDocumentBodyChildren } from './domTestUtils';
import { ticks } from './commonTestUtils';

export * from './screenEditorTestUtils';
export * from './commonTestUtils';
export * from './deepFindMatchers';
export * from './manuallyAssignVariablesCheckboxTestUtils';
export * from './goldObjectMatchers';
export * from './domTestUtils';
export * from './complexTypeTestUtils';
export * from './selectors';
export * from './events';
export * from './combobox';

export const createComponent = async (tagName, component, options) => {
    const el = createElement(tagName, {
        is: component
    });

    if (options) {
        Object.assign(el, options);
    }

    setDocumentBodyChildren(el);
    await ticks(1);
    return el;
};

// @sa11y testing appears to take some extra time (beyond the given 5000ms default jest timeout)
export const ACCESSIBILITY_TEST_TIMEOUT_IN_MS = 15000;
