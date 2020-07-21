// @ts-nocheck
export const focusEvent = new FocusEvent('focus', {
    bubbles: false,
    cancelable: false
});

export const focusoutEvent = new FocusEvent('focusout', {
    bubbles: true,
    cancelable: true
});

export const textInputEvent = textInput => {
    return new CustomEvent('textinput', {
        bubbles: true,
        cancelable: true,
        detail: { text: textInput }
    });
};

export const blurEvent = new FocusEvent('blur', {
    bubbles: true,
    cancelable: true,
    composed: true
});

export const selectEvent = value => {
    return new CustomEvent('select', {
        bubbles: true,
        cancelable: true,
        detail: { value }
    });
};

export const changeEvent = value => {
    return new CustomEvent('change', {
        bubbles: true,
        cancelable: false,
        detail: { value }
    });
};

export const clickEvent = () => {
    return new CustomEvent('click', {
        bubbles: true,
        cancelable: false
    });
};

export const mouseoverEvent = () => {
    return new CustomEvent('mouseover', {
        bubbles: true,
        cancelable: false
    });
};

export const mouseoutEvent = () => {
    return new CustomEvent('mouseout', {
        bubbles: true,
        cancelable: false
    });
};

export const checkboxChangeEvent = (checked = true) => {
    return new CustomEvent('change', {
        bubbles: true,
        cancelable: false,
        detail: { checked }
    });
};

/**
 * Remove event (used on pill for instance)
 */
export const removeEvent = (): CustomEvent => {
    return new CustomEvent('remove', {
        bubbles: true,
        cancelable: false
    });
};

export const lightningRadioGroupChangeEvent = newValue => {
    return new CustomEvent('change', {
        detail: {
            newValue
        },
        composed: true,
        bubbles: true,
        cancelable: true
    });
};
