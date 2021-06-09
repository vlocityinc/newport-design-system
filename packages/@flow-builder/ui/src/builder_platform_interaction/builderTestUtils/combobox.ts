import { LIGHTNING_COMPONENTS_SELECTORS, ticks, clickEvent, removeEvent } from './builderTestUtils';
import Combobox from 'builder_platform_interaction/combobox';

/**
 * Return the pill component corresponding to the given combobox
 *
 * @param {Combobox} combobox - combobox component
 * @returns {HTMLElement | null} lightning pill component
 */
export const getComboboxPill = (combobox: any): any | null => {
    const { shadowRoot } = combobox;
    if (!shadowRoot) {
        throw new Error('combobox shadowRoot must not be null');
    }
    return shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_PILL);
};

/**
 * Click on pill to switch to merge field notation combobox mode
 *
 * @param {Combobox} combobox - current combobox
 * @returns {Promise<void>}
 */
// eslint-disable-next-line @lwc/lwc/no-async-await
export const clickPill = async (combobox: Combobox): Promise<void> => {
    const pill = getComboboxPill(combobox);
    if (pill) {
        pill.dispatchEvent(clickEvent());
        await ticks(1);
    }
};

/**
 * Remove pill to switch to merge field notation combobox mode and reset combobox menu data
 *
 * @param {Combobox} combobox - current combobox
 * @returns {Promise<void>}
 */
// eslint-disable-next-line @lwc/lwc/no-async-await
export const removePill = async (combobox: Combobox): Promise<void> => {
    const pill = getComboboxPill(combobox);
    if (pill) {
        pill.dispatchEvent(removeEvent());
        await ticks(1);
    }
};
