import { createElement } from 'lwc';
import ScreenComponentVisiblitySection from 'builder_platform_interaction/screenComponentVisibilitySection';

import { query } from 'builder_platform_interaction/builderTestUtils';
import { getSupportedFeatures } from 'builder_platform_interaction/systemLib';
import { FLOW_SUPPORTED_FEATURES } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/componentVisibility', () =>
    require('builder_platform_interaction_mocks/componentVisibility')
);

const SELECTOR_COMPONENT_VISIBILITY =
    'builder_platform_interaction-component-visibility';

const createComponentUnderTest = props => {
    const el = createElement(
        'builder_platform_interaction-screen-component-visibility-section',
        {
            is: ScreenComponentVisiblitySection
        }
    );

    props = props || { field: {} };
    Object.assign(el, props);

    document.body.appendChild(el);
    return el;
};

jest.mock('builder_platform_interaction/systemLib', () => {
    return {
        getSupportedFeatures: jest.fn()
    };
});

describe('Screen Component Visibility Section', () => {
    it('Component Visibility is not displayed when ConditionalFieldVisibility feature not present', () => {
        getSupportedFeatures.mockImplementation(() => new Set());

        const element = createComponentUnderTest();

        const componentVisibility = query(
            element,
            SELECTOR_COMPONENT_VISIBILITY
        );

        expect(componentVisibility).toBeFalsy();
    });

    it('Component Visibility is displayed when ConditionalFieldVisibility feature present', () => {
        getSupportedFeatures.mockImplementation(() =>
            new Set().add(FLOW_SUPPORTED_FEATURES.CONDITIONAL_FIELD_VISIBILITY)
        );

        const element = createComponentUnderTest();
        const componentVisibility = query(
            element,
            SELECTOR_COMPONENT_VISIBILITY
        );

        expect(componentVisibility).toBeTruthy();
    });
});
