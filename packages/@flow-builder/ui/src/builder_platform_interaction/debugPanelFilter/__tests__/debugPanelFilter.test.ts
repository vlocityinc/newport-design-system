// @ts-nocheck
import { createElement } from 'lwc';
import DebugPanelFilter from '../debugPanelFilter';
import { LABELS } from '../debugPanelFilterLabels';
import { DebugPanelFilterEvent } from 'builder_platform_interaction/events';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';

const createComponentUnderTest = (selections = LABELS.basicFilter) => {
    const el = createElement('builder_platform_interaction-debug-panel-filter', {
        is: DebugPanelFilter
    });
    el.selections = selections;
    setDocumentBodyChildren(el);
    return el;
};

const selectors = {
    selectedOptions: 'lightning-formatted-text.selected-options',
    filterButton: 'lightning-button-icon.filterButton'
};

describe('filter behaviour', () => {
    let debugPanelFilter;
    beforeEach(() => {
        debugPanelFilter = createComponentUnderTest();
    });
    describe('default behaviour', () => {
        it('shows Basic option selected on render', () => {
            const selections = debugPanelFilter.shadowRoot.querySelector(selectors.selectedOptions).value;
            expect(selections).not.toBeNull();
            expect(selections).toEqual(LABELS.basicFilter);
        });

        it('send open and close popover events on click', async () => {
            const callback = jest.fn();
            debugPanelFilter.addEventListener(DebugPanelFilterEvent.EVENT_NAME, callback);

            debugPanelFilter.shadowRoot.querySelector(selectors.filterButton).click();
            await ticks(1);
            expect(callback).toHaveBeenCalled();

            debugPanelFilter.shadowRoot.querySelector(selectors.filterButton).click();
            await ticks(1);
            expect(callback).toHaveBeenCalled();
        });

        it('updating selections updates the text', async () => {
            debugPanelFilter = createComponentUnderTest(LABELS.govLimFilter);
            let selections = debugPanelFilter.shadowRoot.querySelector(selectors.selectedOptions).value;
            expect(selections).not.toBeNull();
            expect(selections).toEqual(LABELS.govLimFilter);
            debugPanelFilter = createComponentUnderTest(LABELS.transactionFilter);
            selections = debugPanelFilter.shadowRoot.querySelector(selectors.selectedOptions).value;
            expect(selections).not.toBeNull();
            expect(selections).toEqual(LABELS.transactionFilter);
        });
    });
});
