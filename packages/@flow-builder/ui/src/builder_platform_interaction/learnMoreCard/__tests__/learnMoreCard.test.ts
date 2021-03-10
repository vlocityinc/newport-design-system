import { createElement } from 'lwc';
import { LIGHTNING_COMPONENTS_SELECTORS, setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import LearnMoreCard from 'builder_platform_interaction/learnMoreCard';

type LearnMoreCardProps = {
    popupTriggerLabel: string;
    popupTriggerTitle: string;
    sideText: string;
    popupCloseButtonTitle: string;
    popupCloseButtonAssistiveText: string;
    popupBodyText: string;
    popupLinkLabel: string;
    popupLinkUrl: string;
};

// General purpose functions

function createComponentForTest(props: LearnMoreCardProps): LearnMoreCard {
    const element = createElement('builder_platform_interaction-learn-more-card', {
        is: LearnMoreCard
    });
    Object.assign(element, props);
    setDocumentBodyChildren(element);
    return element;
}

function getPropertyFromSelector(comp: LearnMoreCard, selector: string, property: string): any {
    return comp.shadowRoot.querySelector(selector)[property];
}

// Functions allowing to get specific element properties

function getPopupTriggerLabel(comp: LearnMoreCard): string {
    return getPropertyFromSelector(comp, LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BUTTON, 'label');
}

function getPopupTriggerTitle(comp: LearnMoreCard): string {
    return getPropertyFromSelector(comp, LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BUTTON, 'title');
}

function getSideText(comp: LearnMoreCard): string {
    return getPropertyFromSelector(comp, LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_FORMATTED_TEXT, 'value');
}

function getPopupCloseButtonTitle(comp: LearnMoreCard): string {
    return getPropertyFromSelector(comp, LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BUTTON_ICON, 'title');
}

function getPopupCloseButtonAssistiveText(comp: LearnMoreCard): string {
    return getPropertyFromSelector(comp, LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BUTTON_ICON, 'alternativeText');
}

function getPopupBodyText(comp: LearnMoreCard): string {
    return getPropertyFromSelector(
        comp,
        `.slds-popover__body > ${LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_FORMATTED_TEXT}`,
        'value'
    );
}

function getPopupLinkLabel(comp: LearnMoreCard): string {
    return getPropertyFromSelector(comp, LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_FORMATTED_URL, 'label');
}

function getPopupLinkUrl(comp: LearnMoreCard): string {
    return getPropertyFromSelector(comp, LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_FORMATTED_URL, 'value');
}

// Test cases

describe('The learn more card', () => {
    let component: LearnMoreCard;
    beforeAll(() => {
        const props: LearnMoreCardProps = {
            popupTriggerLabel: 'popupTriggerLabel',
            popupTriggerTitle: 'popupTriggerTitle',
            sideText: 'sideText',
            popupCloseButtonTitle: 'popupCloseButtonTitle',
            popupCloseButtonAssistiveText: 'popupCloseButtonAssistiveText',
            popupBodyText: 'popupBodyText',
            popupLinkLabel: 'popupLinkLabel',
            popupLinkUrl: 'popupLinkUrl'
        };
        component = createComponentForTest(props);
    });

    describe('should have its elements displayed correctly', () => {
        test('Popup trigger label', () => {
            expect(getPopupTriggerLabel(component)).toEqual('popupTriggerLabel');
        });
        test('Popup trigger title', () => {
            expect(getPopupTriggerTitle(component)).toEqual('popupTriggerTitle');
        });
        test('Side text', () => {
            expect(getSideText(component)).toEqual('sideText');
        });
        test('Popup close button title', () => {
            expect(getPopupCloseButtonTitle(component)).toEqual('popupCloseButtonTitle');
        });
        test('Popup close button assistive text', () => {
            expect(getPopupCloseButtonAssistiveText(component)).toEqual('popupCloseButtonAssistiveText');
        });
        test('Popup body text', () => {
            expect(getPopupBodyText(component)).toEqual('popupBodyText');
        });
        test('Popup link label', () => {
            expect(getPopupLinkLabel(component)).toEqual('popupLinkLabel');
        });
        test('Popup link URL', () => {
            expect(getPopupLinkUrl(component)).toEqual('popupLinkUrl');
        });
    });
});
