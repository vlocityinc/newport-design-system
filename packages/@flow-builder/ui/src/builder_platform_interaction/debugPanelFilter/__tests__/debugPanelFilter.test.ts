// @ts-nocheck
import { createElement } from 'lwc';
import DebugPanelFilter from '../debugPanelFilter';
import { LABELS } from '../debugPanelFilterLabels';
import { DebugPanelFilterEvent } from 'builder_platform_interaction/events';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';

const createComponentUnderTest = (fromEmailDebugging = false) => {
    const el = createElement('builder_platform_interaction-debug-panel-filter', {
        is: DebugPanelFilter
    });
    el.fromEmailDebugging = fromEmailDebugging;
    setDocumentBodyChildren(el);
    return el;
};

const selectors = {
    selectedOptions: 'lightning-formatted-text.selectedOptions',
    checkboxesGroup: 'lightning-checkbox-group',
    filterButton: 'lightning-button-icon.filterButton',
    popover: 'section.slds-popover',
    closePopover: 'lightning-button-icon.slds-popover__close'
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

        it('open and close the popover', async () => {
            let popover = debugPanelFilter.shadowRoot.querySelector(selectors.popover);
            expect(popover).toBeNull();
            debugPanelFilter.shadowRoot.querySelector(selectors.filterButton).click();
            await ticks(1);

            popover = debugPanelFilter.shadowRoot.querySelector(selectors.popover);
            expect(popover).not.toBeNull();
            debugPanelFilter.shadowRoot.querySelector(selectors.closePopover).click();
            await ticks(1);

            popover = debugPanelFilter.shadowRoot.querySelector(selectors.popover);
            expect(popover).toBeNull();
        });

        it('no options are selected by default', async () => {
            let popover = debugPanelFilter.shadowRoot.querySelector(selectors.popover);
            expect(popover).toBeNull();
            debugPanelFilter.shadowRoot.querySelector(selectors.filterButton).click();
            await ticks(1);
            popover = debugPanelFilter.shadowRoot.querySelector(selectors.popover);
            expect(popover).not.toBeNull();
            const checkboxGroup = debugPanelFilter.shadowRoot.querySelector(selectors.checkboxesGroup);
            expect(checkboxGroup.value).toHaveLength(0);
            expect(checkboxGroup.options).toHaveLength(2);
        });
    });

    describe('filter with interaction behaviour', () => {
        let checkboxGroup;
        beforeEach(async () => {
            let popover = debugPanelFilter.shadowRoot.querySelector(selectors.popover);
            expect(popover).toBeNull();
            debugPanelFilter.shadowRoot.querySelector(selectors.filterButton).click();
            await ticks(1);
            popover = debugPanelFilter.shadowRoot.querySelector(selectors.popover);
            expect(popover).not.toBeNull();
            checkboxGroup = debugPanelFilter.shadowRoot.querySelector(selectors.checkboxesGroup);
            expect(checkboxGroup.value).toHaveLength(0);
            expect(checkboxGroup.options).toHaveLength(2);
        });

        it('selecting governor limit dispatches DebugPanelFilterEvent', async () => {
            debugPanelFilter.shadowRoot.querySelector(selectors.checkboxesGroup).value = [LABELS.govLimFilter];
            checkboxGroup = debugPanelFilter.shadowRoot.querySelector(selectors.checkboxesGroup);
            expect(checkboxGroup.value).toHaveLength(1);
            expect(checkboxGroup.options).toHaveLength(2);
            const callback = jest.fn();
            debugPanelFilter.addEventListener(DebugPanelFilterEvent.EVENT_NAME, callback);
            checkboxGroup.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: [LABELS.govLimFilter]
                    }
                })
            );
            expect(callback).toHaveBeenCalled();
            checkboxGroup.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: [LABELS.govLimFilter]
                    }
                })
            );
            expect(callback).toHaveBeenCalled();
        });

        it('selecting transaction boundaries dispatches DebugPanelFilterEvent', async () => {
            debugPanelFilter.shadowRoot.querySelector(selectors.checkboxesGroup).value = [LABELS.transactionFilter];
            checkboxGroup = debugPanelFilter.shadowRoot.querySelector(selectors.checkboxesGroup);
            expect(checkboxGroup.value).toHaveLength(1);
            expect(checkboxGroup.options).toHaveLength(2);
            const callback = jest.fn();
            debugPanelFilter.addEventListener(DebugPanelFilterEvent.EVENT_NAME, callback);
            checkboxGroup.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: [LABELS.transactionFilter]
                    }
                })
            );
            expect(callback).toHaveBeenCalled();
        });
    });
});

describe('one click (email) debugging filter behaviour', () => {
    let debugPanelFilter;
    let checkboxGroup;
    beforeEach(async () => {
        debugPanelFilter = createComponentUnderTest(true);
        let popover = debugPanelFilter.shadowRoot.querySelector(selectors.popover);
        expect(popover).toBeNull();
        debugPanelFilter.shadowRoot.querySelector(selectors.filterButton).click();
        await ticks(1);
        popover = debugPanelFilter.shadowRoot.querySelector(selectors.popover);
        expect(popover).not.toBeNull();
    });

    it('should only have transaction filter option', () => {
        checkboxGroup = debugPanelFilter.shadowRoot.querySelector(selectors.checkboxesGroup);
        expect(checkboxGroup.value).toHaveLength(0);
        expect(checkboxGroup.options).toHaveLength(1);
    });
});
