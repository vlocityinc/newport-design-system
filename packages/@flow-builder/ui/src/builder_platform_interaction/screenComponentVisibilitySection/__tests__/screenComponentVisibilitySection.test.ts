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
    describe('Labels', () => {
        describe('Accordion section label', () => {
            it('defaults to FlowBuilderScreenEditor.componentVisbilitySectionTitle', () => {
                const element = createComponentUnderTest();

                expect(element.accordionSectionLabel).toEqual('FlowBuilderScreenEditor.componentVisbilitySectionTitle');
            });
            it('correctly sets the desired value', () => {
                const customAccordionSectionLabel = 'my own label';
                const element = createComponentUnderTest({
                    accordionSectionLabel: customAccordionSectionLabel
                });

                expect(element.accordionSectionLabel).toEqual(customAccordionSectionLabel);
            });
        });
        describe('Visibility logic combobox label', () => {
            it('defaults to undefined', () => {
                const element = createComponentUnderTest();

                expect(element.visibilityLogicComboboxLabel).toBeUndefined();
            });
            it('correctly sets the desired value', () => {
                const customVisibilityLogicComboboxLabel = 'my own label';
                const element = createComponentUnderTest({
                    visibilityLogicComboboxLabel: customVisibilityLogicComboboxLabel
                });

                expect(element.visibilityLogicComboboxLabel).toEqual(customVisibilityLogicComboboxLabel);
            });
        });
    });
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
