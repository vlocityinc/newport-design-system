import { Keys } from '@flow-builder/shared-utils';

export const focusEvent = new FocusEvent('focus', {
    bubbles: false,
    cancelable: false
});

export const focusoutEvent = new FocusEvent('focusout', {
    bubbles: true,
    cancelable: true
});

export const textInputEvent = (textInput) =>
    new CustomEvent('textinput', {
        bubbles: true,
        cancelable: true,
        detail: { text: textInput }
    });

export const blurEvent = new FocusEvent('blur', {
    bubbles: true,
    cancelable: true,
    composed: true
});

export const selectEvent = (value) =>
    new CustomEvent('select', {
        bubbles: true,
        cancelable: true,
        detail: { value }
    });

export const changeEvent = (value) =>
    new CustomEvent('change', {
        bubbles: true,
        cancelable: false,
        detail: { value }
    });

export const clickEvent = () =>
    new CustomEvent('click', {
        bubbles: true,
        cancelable: false
    });

export const mouseenterEvent = () =>
    new CustomEvent('mouseenter', {
        bubbles: true,
        cancelable: false
    });

export const mouseleaveEvent = () =>
    new CustomEvent('mouseleave', {
        bubbles: true,
        cancelable: false
    });

export const mouseoverEvent = () =>
    new CustomEvent('mouseover', {
        bubbles: true,
        cancelable: false
    });

export const mouseoutEvent = () =>
    new CustomEvent('mouseout', {
        bubbles: true,
        cancelable: false
    });

export const checkboxChangeEvent = (checked = true) =>
    new CustomEvent('change', {
        bubbles: true,
        cancelable: false,
        detail: { checked }
    });

/**
 * Remove event (used on pill for instance)
 */
export const removeEvent = (): CustomEvent =>
    new CustomEvent('remove', {
        bubbles: true,
        cancelable: false
    });

export const lightningRadioGroupChangeEvent = (newValue) =>
    new CustomEvent('change', {
        detail: {
            value: newValue
        },
        composed: true,
        bubbles: true,
        cancelable: true
    });

export const dragStartEvent = (textValue?) => {
    const dragStartEvent = new CustomEvent('dragstart');
    // @ts-ignore
    dragStartEvent.dataTransfer = {
        data: {},
        setData(type, val) {
            this.data[type] = val;
            this.types = [];
            this.types[0] = type;
        },
        getData(type) {
            return this.data[type];
        }
    };

    if (textValue) {
        // @ts-ignore
        dragStartEvent.dataTransfer.setData('text', textValue);
    }
    return dragStartEvent;
};

/**
 * Returns a new keydown event that bubbles up
 *
 * @param key key pressed
 * @returns new keydown event
 */
export const keydownEvent = (key: Keys) => new KeyboardEvent('keydown', { key, bubbles: true });

export const rowActionEvent = (action, row) =>
    new CustomEvent('rowaction', {
        detail: {
            action,
            row
        },
        composed: true,
        bubbles: true,
        cancelable: true
    });
