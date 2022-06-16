import { createComponent } from 'builder_platform_interaction/builderTestUtils';
import { NewResourceEvent } from 'builder_platform_interaction/events';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { LABELS } from '../fieldInputMenuLabels';

const tag = 'builder_platform_interaction-field-input-menu';

const createComponentUnderTest = async (props) => {
    const overrideProps = {};

    return createComponent(tag, props, overrideProps);
};

const selectors = {
    container: '.container',
    footer: '.footer',
    footerText: '.footer-text',
    footerButton: '.footer button',
    footerIcon: '.footer lightning-icon'
};

jest.mock('builder_platform_interaction/fieldInputMenuViewContainer', () =>
    jest.requireActual('builder_platform_interaction_mocks/fieldInputMenuViewContainer')
);

jest.mock('builder_platform_interaction/fieldInputMenuHeader', () =>
    jest.requireActual('builder_platform_interaction_mocks/fieldInputMenuHeader')
);

jest.mock('lightning/icon', () => jest.requireActual('lightning/icon'));

describe('Field Input Menu Tests', () => {
    let cmp;
    let dom;

    beforeEach(async () => {
        cmp = await createComponentUnderTest({});
        dom = lwcUtils.createDomProxy(cmp, selectors);
    });

    test('sanity', () => {
        expect(cmp).toBeTruthy();
    });

    it('Should have a menu container', () => {
        expect(dom.container).not.toBeNull();
    });

    it('Should have a menu footer', () => {
        expect(dom.footer).not.toBeNull();
    });

    it('Should have the correct footer label', () => {
        expect(dom.footerText.textContent).toBe(LABELS.footerLabel);
    });

    it('Should have a footer add icon', () => {
        expect(dom.footerIcon).not.toBeNull();
    });

    it('Footer add icon should have the right name', () => {
        expect(dom.footerIcon.iconName).toBe('utility:add');
    });

    it('Footer add icon should have the right size', () => {
        expect(dom.footerIcon.size).toBe('x-small');
    });

    it('Footer add icon should have the right alternative text', () => {
        expect(dom.footerIcon.alternativeText).toBe(LABELS.addUtilityLabel);
    });

    it('Should emit addnewresource on footer click', () => {
        const callback = jest.fn();

        cmp.addEventListener(NewResourceEvent.EVENT_NAME, callback);
        dom.footerButton.click();

        expect(callback).toHaveBeenCalled();
    });
});
