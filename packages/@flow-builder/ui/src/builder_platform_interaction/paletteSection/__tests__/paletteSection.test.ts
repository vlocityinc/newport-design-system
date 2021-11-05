// @ts-nocheck
import {
    PaletteItemClickedEvent,
    PaletteItemChevronClickedEvent,
    LocatorIconClickedEvent
} from 'builder_platform_interaction/events';
import PaletteSection from 'builder_platform_interaction/paletteSection';
import { createComponent } from 'builder_platform_interaction/builderTestUtils';
import { MOCK_RESOURCE_PALETTE_ITEM } from 'mock/paletteData';

const ICON_SIZE = 'myIconSize';

const DEFAULT_OPTIONS = {
    section: MOCK_RESOURCE_PALETTE_ITEM,
    iconSize: ICON_SIZE,
    enableLocator: true,
    showResourceDetails: true,
    itemsDraggable: true
};

const createComponentUnderTest = async (options) => {
    options = { ...DEFAULT_OPTIONS, ...(options || {}) };
    return createComponent('builder_platform_interaction-palette-section', PaletteSection, options);
};

const selectors = {
    elementIcon: 'builder_platform_interaction-element-icon',
    link: 'builder_platform_interaction-palette-item',
    rows: 'tr',
    resourceDetails: '.test-details-chevron-icon',
    locator: '.test-locator-icon'
};

function getFirstRow(cmp) {
    return Array.from(cmp.shadowRoot.querySelectorAll(selectors.rows))[0];
}

function getLocatorButton(cmp) {
    const row = getFirstRow(cmp);
    return row.querySelector(selectors.locator);
}

function getResourceDetailsButton(cmp) {
    const row = getFirstRow(cmp);
    return row.querySelector(selectors.resourceDetails);
}

describe('PaletteSection', () => {
    let cmp;

    beforeEach(async () => {
        cmp = await createComponentUnderTest();
    });

    describe('rows', () => {
        it('are created correctly', async () => {
            const cmp = await createComponentUnderTest();
            const rows = cmp.shadowRoot.querySelectorAll(selectors.rows);
            expect(rows).toHaveLength(2);

            rows.forEach((row) => {
                expect(row.getAttribute('draggable')).toBeTruthy();
            });
        });
    });

    describe('resource details button', () => {
        beforeEach(async () => {
            cmp = await createComponentUnderTest({ showResourceDetails: true });
        });

        it('is present when showResourceDetails is true', async () => {
            expect(getResourceDetailsButton(cmp)).not.toBeNull();
        });

        it('is not present when showResourceDetails is false', async () => {
            cmp = await createComponentUnderTest({ showResourceDetails: false });
            expect(getResourceDetailsButton(cmp)).toBeNull();
        });

        it('fires a PaletteItemChevronClickedEvent on click', async () => {
            cmp = await createComponentUnderTest({ showResourceDetails: true });
            const eventCallback = jest.fn();
            cmp.addEventListener(PaletteItemChevronClickedEvent.EVENT_NAME, eventCallback);
            const details = getResourceDetailsButton(cmp);
            details.click();

            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toEqual({
                elementGUID: MOCK_RESOURCE_PALETTE_ITEM._children[0].guid,
                iconName: undefined
            });
        });
    });

    describe('locator button', () => {
        it('is present when enableLocator is true', async () => {
            cmp = await createComponentUnderTest({ enableLocator: true });
            expect(getLocatorButton(cmp)).not.toBeNull();
        });

        it('is not present when enableLocator is false', async () => {
            cmp = await createComponentUnderTest({ enableLocator: false });
            expect(getLocatorButton(cmp)).toBeNull();
        });

        it('fires a LocatorIconClickedEvent on click', async () => {
            cmp = await createComponentUnderTest();
            const eventCallback = jest.fn();
            cmp.addEventListener(LocatorIconClickedEvent.EVENT_NAME, eventCallback);
            const locator = getLocatorButton(cmp);
            locator.click();

            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toEqual({
                elementGuid: MOCK_RESOURCE_PALETTE_ITEM._children[0].guid
            });
        });
    });

    describe('link', () => {
        it('clicks the link to dispatch a PaletteItemClickedEvent with the elementType and guid', async () => {
            const cmp = await createComponentUnderTest();
            const eventCallback = jest.fn();
            cmp.addEventListener(PaletteItemClickedEvent.EVENT_NAME, eventCallback);
            const link = cmp.shadowRoot.querySelector(selectors.link);
            link.click();

            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0].detail).toEqual({
                elementSubtype: null,
                elementType: MOCK_RESOURCE_PALETTE_ITEM._children[0].elementType,
                guid: MOCK_RESOURCE_PALETTE_ITEM._children[0].guid
            });
        });
    });
});
