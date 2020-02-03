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
    cancelable: true
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

export const checkboxChangeEvent = (checked = true) => {
    return new CustomEvent('change', {
        bubbles: true,
        cancelable: false,
        detail: { checked }
    });
};
