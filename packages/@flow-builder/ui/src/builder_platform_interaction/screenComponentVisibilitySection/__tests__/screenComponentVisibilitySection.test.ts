// @ts-nocheck
import { createElement } from 'lwc';
import ScreenComponentVisiblitySection from 'builder_platform_interaction/screenComponentVisibilitySection';
import { query, setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { isConditionalFieldVisibilitySupported } from 'builder_platform_interaction/processTypeLib';

jest.mock('builder_platform_interaction/componentVisibility', () =>
    require('builder_platform_interaction_mocks/componentVisibility')
);

jest.mock('builder_platform_interaction/processTypeLib');

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getProcessType: jest.fn()
    };
});

const SELECTOR_COMPONENT_VISIBILITY = 'builder_platform_interaction-component-visibility';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-component-visibility-section', {
        is: ScreenComponentVisiblitySection
    });

    props = props || { field: {} };
    Object.assign(el, props);

    setDocumentBodyChildren(el);
    return el;
};

describe('Screen Component Visibility Section', () => {
    it('Component Visibility is not displayed when ConditionalFieldVisibility feature not present', () => {
        isConditionalFieldVisibilitySupported.mockImplementation(() => false);

        const element = createComponentUnderTest();
        const componentVisibility = query(element, SELECTOR_COMPONENT_VISIBILITY);

        expect(componentVisibility).toBeFalsy();
    });

    it('Component Visibility is displayed when ConditionalFieldVisibility feature present', () => {
        isConditionalFieldVisibilitySupported.mockImplementation(() => true);

        const element = createComponentUnderTest();
        const componentVisibility = query(element, SELECTOR_COMPONENT_VISIBILITY);

        expect(componentVisibility).toBeTruthy();
    });
});
