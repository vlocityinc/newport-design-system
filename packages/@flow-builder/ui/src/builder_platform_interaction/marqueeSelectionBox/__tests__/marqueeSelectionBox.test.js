import { createElement } from 'lwc';
import MarqueeSelectionBox from 'builder_platform_interaction/marqueeSelectionBox';

const createComponentUnderTest = () => {
    const el = createElement(
        'builder_platform_interaction-marquee-selection-box',
        {
            is: MarqueeSelectionBox
        }
    );
    el.marqueeStartPoint = [5, 5];
    el.marqueeEndPoint = [5, 5];
    document.body.appendChild(el);
    return el;
};

describe('marqueeSelectionBox', () => {
    it('Checks if marqueeSelectionBox is rendered correctly', () => {
        const marqueeSelectionBoxComponent = createComponentUnderTest();
        expect(marqueeSelectionBoxComponent.marqueeStartPoint).toEqual([5, 5]);
        expect(marqueeSelectionBoxComponent.marqueeEndPoint).toEqual([5, 5]);
    });
});
