// @ts-nocheck
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { createComponent } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { PAGE_SIZE } from '../alcConnectorMenu';
import * as LargeMenu from './largeMenu.json';

const selectors = {
    listboxItem: 'li[role="presentation"]'
};

const changeSearchInput = (cmp, inputChange) => {
    const lightningInput = cmp.shadowRoot.querySelector('lightning-input');
    lightningInput.dispatchEvent(
        new CustomEvent('change', {
            detail: {
                value: inputChange
            }
        })
    );
};

jest.mock('builder_platform_interaction/sharedUtils', () => require('builder_platform_interaction_mocks/sharedUtils'));

const defaultOptions = {
    source: {}
};

const createComponentUnderTest = async (overrideOptions) => {
    return createComponent('builder_platform_interaction-alc-connector-menu', defaultOptions, overrideOptions);
};

describe('Alc Connector Menu Search', () => {
    let cmp, listBox;

    beforeAll(async () => {
        cmp = await createComponentUnderTest({
            metadata: LargeMenu
        });
        listBox = cmp.shadowRoot.querySelector('div.body-fixed-height');
    });

    it('shows one page worth of results when the search starts', async () => {
        changeSearchInput(cmp, 'a');
        await ticks(1);
        const listItems = cmp.shadowRoot.querySelectorAll(selectors.listboxItem);
        expect(listItems).toHaveLength(PAGE_SIZE);

        for (let i = 0; i < listItems.length; i++) {
            const listItem = listItems[i];
            const menuItem = LargeMenu.menuItems[i];
            expect(listItem.dataset.key).toEqual(menuItem.guid);
        }
    });

    it('shows two pages of search results after scrolling to the bottom', async () => {
        listBox.scrollTop = 50000;
        listBox.dispatchEvent(
            new CustomEvent('scroll', {
                composed: true,
                bubbles: true
            })
        );
        await ticks(1);
        const listItems = cmp.shadowRoot.querySelectorAll(selectors.listboxItem);
        expect(listItems).toHaveLength(PAGE_SIZE * 2);
    });

    it('shows three pages of search results after scrolling to the bottom one more time', async () => {
        listBox.dispatchEvent(
            new CustomEvent('scroll', {
                composed: true,
                bubbles: true
            })
        );
        await ticks(1);
        const listItems = cmp.shadowRoot.querySelectorAll(selectors.listboxItem);
        expect(listItems).toHaveLength(PAGE_SIZE * 3);
    });

    it('resets back to one page worth of results upon search input change', async () => {
        changeSearchInput(cmp, 'ab');
        await ticks(1);
        const listItems = cmp.shadowRoot.querySelectorAll(selectors.listboxItem);
        expect(listItems).toHaveLength(PAGE_SIZE);
    });
});
