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
