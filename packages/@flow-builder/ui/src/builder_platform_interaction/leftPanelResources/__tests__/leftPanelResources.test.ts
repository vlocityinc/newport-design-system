import { createElement } from 'lwc';
import LeftPanelResources from '../leftPanelResources';
import { MOCK_ELEMENT_PALETTE_ITEM, MOCK_RESOURCE_PALETTE_ITEM } from 'mock/paletteData';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-left-panel-resources', {
        is: LeftPanelResources
    });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
};
const SELECTORS = {
    HEADER: 'h3'
};

describe('left-panel-resources', () => {
    describe('CSS vertical padding', () => {
        it('displays correctly when resources NOT present (only elements)', () => {
            const leftPanelResourcesComponent = createComponentUnderTest({
                nonCanvasElements: [],
                canvasElements: [MOCK_ELEMENT_PALETTE_ITEM]
            });
            const [elementsHeader] = leftPanelResourcesComponent.shadowRoot.querySelectorAll(SELECTORS.HEADER);
            expect(elementsHeader).not.toBeNull();
            expect(elementsHeader.classList).toContain('slds-p-bottom_small');
        });
        it('displays correctly when resources and elements present', () => {
            const leftPanelResourcesComponent = createComponentUnderTest({
                nonCanvasElements: [MOCK_RESOURCE_PALETTE_ITEM],
                canvasElements: [MOCK_ELEMENT_PALETTE_ITEM]
            });
            const [resourceHeader, elementsHeader] = leftPanelResourcesComponent.shadowRoot.querySelectorAll(
                SELECTORS.HEADER
            );
            expect(resourceHeader).not.toBeNull();
            expect(resourceHeader.classList).toContain('slds-p-bottom_small');
            expect(elementsHeader).not.toBeNull();
            expect(elementsHeader.classList).toContain('slds-p-vertical_small');
        });
    });
});
