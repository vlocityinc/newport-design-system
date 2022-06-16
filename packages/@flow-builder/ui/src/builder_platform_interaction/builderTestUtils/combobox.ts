import { ticks } from './commonTestUtils';
import { clickEvent, removeEvent } from './events';
import { LIGHTNING_COMPONENTS_SELECTORS } from './selectors';

/**
 * Return the pill component corresponding to the given combobox
 *
 * @param combobox - combobox component
 * @returns lightning pill component
 */
export const getComboboxPill = (combobox: HTMLElement): HTMLElement | null => {
    const { shadowRoot } = combobox;
    if (!shadowRoot) {
        throw new Error('combobox shadowRoot must not be null');
    }
    return shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_PILL);
};

/**
 * Click on pill to switch to merge field notation combobox mode
 *
 * @param combobox - current combobox
 */
export const clickPill = async (combobox: HTMLElement) => {
    const pill = getComboboxPill(combobox);
    if (pill) {
        pill.dispatchEvent(clickEvent());
        await ticks(1);
    }
};

/**
 * Remove pill to switch to merge field notation combobox mode and reset combobox menu data
 *
 * @param combobox - current combobox
 */
export const removePill = async (combobox: HTMLElement): Promise<void> => {
    const pill = getComboboxPill(combobox);
    if (pill) {
        pill.dispatchEvent(removeEvent());
        await ticks(1);
    }
};
