import { setDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { createElement } from 'lwc';
import { MOCK_ELEMENT_PALETTE_ITEM, MOCK_RESOURCE_PALETTE_ITEM } from 'mock/paletteData';
import LeftPanelResources from '../leftPanelResources';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-left-panel-resources', {
        is: LeftPanelResources
    });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
};
const { writeMetrics, LEFT_PANEL_RESOURCES } = loggingUtils;

jest.mock('builder_platform_interaction/sharedUtils', () => {
    const mockSharedUtils = jest.requireActual('builder_platform_interaction_mocks/sharedUtils');
    return Object.assign({}, mockSharedUtils, {
        loggingUtils: {
            writeMetrics: jest.fn(),
            logPerfTransactionStart: jest.fn(),
            logPerfTransactionEnd: jest.fn(),
            initMetricsTracker: jest.fn()
        }
    });
});

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

    describe('SLI logging', () => {
        it('sends SLI logging with error equals to false when there is no error', () => {
            const leftPanelResourcesComponent = createComponentUnderTest({});

            expect(writeMetrics).toBeCalledWith(LEFT_PANEL_RESOURCES, 0, false, {});
        });
    });
});
