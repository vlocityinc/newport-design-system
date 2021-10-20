import { createElement } from 'lwc';
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import AccordionSectionWithIcon from '../accordionSectionWithIcon';

const createComponentUnderTest = (props = {}) => {
    const element = createElement('builder_platform_interaction-accordion-section-with-icon', {
        is: AccordionSectionWithIcon
    });
    Object.assign(element, props);
    setDocumentBodyChildren(element);
    return element;
};

const iconName = 'mockIconName';
const iconSize = 'mockIconSize';
const backgroundColor = 'mockBackgroundColor';
const alternativeText = 'mockAlternativeText';

const SELECTORS = {
    ELEMENT_ICON: 'builder_platform_interaction-element-icon',
    CHEVRON: 'lightning-icon'
};

describe('accordion-section-with-icon', () => {
    let accordionSection;

    it('should render element-icon with correct attributes', () => {
        const elementIcon = {
            iconName,
            iconSize,
            alternativeText,
            backgroundColor
        };
        accordionSection = createComponentUnderTest({ elementIcon });
        const icon = accordionSection.shadowRoot.querySelectorAll(SELECTORS.ELEMENT_ICON)[0];
        expect(icon.iconName).toEqual(iconName);
        expect(icon.iconSize).toEqual(iconSize);
        expect(icon.alternativeText).toEqual(alternativeText);
        expect(icon.backgroundColor).toEqual(backgroundColor);
    });

    it('should not render lightning-icon if iconName is falsy', () => {
        accordionSection = createComponentUnderTest({ elementIcon: {} });
        const icons = accordionSection.shadowRoot.querySelectorAll(SELECTORS.ELEMENT_ICON);
        expect(icons.length).toEqual(0);
    });
});
