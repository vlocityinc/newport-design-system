import { createElement } from 'lwc';
import ZoomPanel from 'builder_platform_interaction/zoomPanel';

const createComponentUnderTest = props => {
    const el = createElement('builder_platform_interaction-zoom-panel', {
        is: ZoomPanel
    });

    Object.assign(el, props);

    document.body.appendChild(el);
    return el;
};

const selectors = {
    marqueeButton: 'lightning-button-icon-stateful',
    zoomButtonGroup: 'lightning-button-group'
};

describe('Zoom Panel', () => {
    describe('Marquee button', () => {
        it('check marquee button is hidden by default when showMarqueeButton is false', () => {
            const zoomPanelElement = createComponentUnderTest();
            const marqueeButton = zoomPanelElement.shadowRoot.querySelector(
                selectors.marqueeButton
            );
            expect(marqueeButton).toBeNull();
        });

        it('check marquee button is shown when showMarqueeButton specified to true', () => {
            const zoomPanelElement = createComponentUnderTest({
                showMarqueeButton: true
            });
            const marqueeButton = zoomPanelElement.shadowRoot.querySelector(
                selectors.marqueeButton
            );
            expect(marqueeButton).not.toBeNull();
        });
    });

    describe('Zoom button group', () => {
        it('check zoom button group is shown by default', () => {
            const zoomPanelElement = createComponentUnderTest();
            const zoomButtonGroup = zoomPanelElement.shadowRoot.querySelector(
                selectors.zoomButtonGroup
            );
            expect(zoomButtonGroup).not.toBeNull();
        });
    });
});
