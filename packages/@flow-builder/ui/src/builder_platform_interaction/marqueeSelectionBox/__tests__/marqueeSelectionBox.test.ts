// @ts-nocheck
import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import MarqueeSelectionBox from 'builder_platform_interaction/marqueeSelectionBox';
import { createElement } from 'lwc';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-marquee-selection-box', {
        is: MarqueeSelectionBox
    });
    el.marqueeStartPoint = [5, 5];
    el.marqueeEndPoint = [5, 5];
    setDocumentBodyChildren(el);
    return el;
};

describe('marqueeSelectionBox', () => {
    it('Checks if marqueeSelectionBox is rendered correctly', () => {
        const marqueeSelectionBoxComponent = createComponentUnderTest();
        expect(marqueeSelectionBoxComponent.marqueeStartPoint).toEqual([5, 5]);
        expect(marqueeSelectionBoxComponent.marqueeEndPoint).toEqual([5, 5]);
    });
});
