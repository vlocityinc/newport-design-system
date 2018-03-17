import { createElement } from 'engine';
import Combobox from 'builder_platform_interaction-combobox';
import { comboboxConfig } from 'mock-combobox-data';

const SELECTORS = {
    COMBOBOX_PATH: 'builder_platform_interaction-combobox',
    GROUPED_COMBOBOX: 'lightning-grouped-combobox',
};

describe('Combobox Tests', () => {
    let combobox, groupedCombobox;
    beforeAll(() => {
        combobox = createElement(SELECTORS.COMBOBOX_PATH, {
            is: Combobox,
        });
        document.body.appendChild(combobox);
        groupedCombobox = combobox.querySelector(SELECTORS.GROUPED_COMBOBOX);
    });

    describe('Property sanity checks', () => {
        beforeAll(() => {
            for (const attribute in comboboxConfig) {
                if (comboboxConfig.hasOwnProperty(attribute)) {
                    combobox[attribute] = comboboxConfig[attribute];
                }
            }
        });

        it('has primitive combobox', () => {
            expect(groupedCombobox).toBeDefined();
        });

        it('has a value', () => {
            expect(combobox.value).toBeDefined();
            expect(combobox.value).toEqual(groupedCombobox.inputText);
        });

        it('has menudata', () => {
            expect(combobox.menuData).toBeDefined();
            expect(combobox.menuData).toEqual(groupedCombobox.items);
        });

        it('has disabled', () => {
            expect(combobox.disabled).toBeDefined();
            expect(combobox.disabled).toEqual(groupedCombobox.disabled);
        });

        it('has placeholder', () => {
            expect(combobox.placeholder).toBeDefined();
            expect(combobox.placeholder).toEqual(groupedCombobox.placeholder);
        });

        it('has required', () => {
            expect(combobox.required).toBeDefined();
            expect(combobox.required).toEqual(true);
            // Not passing required to primitive combobox since it throws its own error in that case
        });

        it('has error message', () => {
            expect(groupedCombobox.validity).toEqual('testErrorMessage');
        });
    });

    describe('Value Tests', () => {
        beforeAll(() => {
            combobox.value = '{';
        });

        it('Typing {! should append }', () => {
            const textInputEvent = new CustomEvent('textinput', {
                detail: { text: '{!' },
            });
            groupedCombobox.dispatchEvent(textInputEvent);
            return Promise.resolve().then(() => {
                expect(groupedCombobox.inputText).toEqual('{!}');
            });
        });
    });

    describe('Icon Tests', () => {
        const textInputEvent = new CustomEvent('textinput', {
            detail: { text: '{!myAccount.}' },
        });

        it('Search icon when empty', () => {
            combobox.value = '';
            return Promise.resolve().then(() => {
                expect(groupedCombobox.inputIconName).toEqual('utility:search');
            });
        });

        it('Activity Indicator when fetching menu data', () => {
            combobox.value = '{!myAccount}';
            return Promise.resolve().then(() => {
                expect(groupedCombobox.showActivityIndicator).toEqual(false);
                groupedCombobox.dispatchEvent(textInputEvent);
                return Promise.resolve().then(() => {
                    expect(groupedCombobox.showActivityIndicator).toEqual(true);
                    combobox.menuData = comboboxConfig.menuData;
                    return Promise.resolve().then(() => {
                        expect(groupedCombobox.showActivityIndicator).toEqual(false);
                    });
                });
            });
        });

        it('Clear icon when there is a value', () => {
            combobox.value = 'testvalue';
            return Promise.resolve().then(() => {
                expect(groupedCombobox.inputIconName).toEqual('utility:clear');
            });
        });

        // TODO Make sure only clicking on clear icon clears value
        // TODO Clicking on search icon opens up menu
    });

    describe('Events Testing', () => {
        const fetchMenuDataHandler = jest.fn();
        const valueChangedHandler = jest.fn();
        let textInputEvent, blurEvent;
        beforeAll(() => {
            combobox.addEventListener('fetchmenudata', fetchMenuDataHandler);
            combobox.addEventListener('valuechanged', valueChangedHandler);
        });

        it('FetchMenuData is fired when a . is entered', () => {
            combobox.value = '{!myAccount}';
            return Promise.resolve().then(() => {
                textInputEvent = new CustomEvent('textinput', {
                    detail: { text: '{!myAccount.}' },
                });
                groupedCombobox.dispatchEvent(textInputEvent);
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
            });
        });

        it('FetchMenuData is fired when a . is deleted', () => {
            combobox.value = '{!myAccount.}';
            return Promise.resolve().then(() => {
                textInputEvent = new CustomEvent('textinput', {
                    detail: { text: '{!myAccount}' },
                });
                groupedCombobox.dispatchEvent(textInputEvent);
                expect(fetchMenuDataHandler).toHaveBeenCalledTimes(1);
            });
        });

        it('ValueChanged is fired on blur', () => {
            blurEvent = new CustomEvent('blur');
            groupedCombobox.dispatchEvent(blurEvent);
            expect(valueChangedHandler).toHaveBeenCalledTimes(1);
        });

        it('ValueChanged is not fired on blur if value has not changed', () => {
            // TODO
        });
    });
});
