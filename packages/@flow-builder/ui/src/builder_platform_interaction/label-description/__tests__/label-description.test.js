/*
 * Copyright 2018 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

import {createElement} from 'engine';
import LabelDescription from 'builder_platform_interaction-label-description';
import {PropertyChangedEvent} from 'builder_platform_interaction-events';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-label-description', {
        is: LabelDescription
    });
    document.body.appendChild(el);
    return el;
};

const selectors = {
    label: '.label',
    devName: '.devName',
    description: '.description',
};

const focusoutEvent = new FocusEvent('focusout', {
    'bubbles'   : true,
    'cancelable': true,
});

describe('label-description', () => {
    describe('label', () => {
        it('input value is set when passed in as attribute', () => {
            const newValue = 'newValue';

            const labelDescription = createComponentUnderTest();
            labelDescription.label.value = newValue;

            return Promise.resolve().then(() => {
                const labelLightningInput = labelDescription.querySelector(selectors.label);

                expect(labelLightningInput.value).toEqual(newValue);
            });
        });

        describe('on focus out', () => {
            it('fires propertyChanged event if changed', () => {
                const newValue = 'newValue';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const labelLightningInput = labelDescription.querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({propertyName: 'label', value: newValue});
                });
            });

            it('does not fire propertyChanged event if unchanged', () => {
                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const devNameLightningInput = labelDescription.querySelector(selectors.devName);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    devNameLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback).not.toHaveBeenCalled();
                });
            });
        });

        it('is not included when hideLabel = true', () => {
            const labelDescription = createComponentUnderTest();
            labelDescription.hideLabel = true;

            return Promise.resolve().then(() => {
                const labelLightningInput = labelDescription.querySelector(selectors.label);

                expect(labelLightningInput).toBeNull();
            });
        });

        describe('error', () => {
            it('is displayed if present', () => {
                const errorMsg = 'an error';
                const labelDescription = createComponentUnderTest();
                labelDescription.label = {
                    value: '',
                    error:  errorMsg
                };

                return Promise.resolve().then(() => {
                    const labelLightningInput = labelDescription.querySelector(selectors.label);

                    expect(labelLightningInput.setCustomValidity).toHaveBeenCalledWith(errorMsg);
                    expect(labelLightningInput.showHelpMessageIfInvalid).toHaveBeenCalled();
                });
            });

            it('is not displayed if not present', () => {
                const labelDescription = createComponentUnderTest();
                labelDescription.label = {
                    value: '',
                    error:  null
                };

                return Promise.resolve().then(() => {
                    const labelLightningInput = labelDescription.querySelector(selectors.label);

                    expect(labelLightningInput.setCustomValidity).toHaveBeenCalledWith('');
                    expect(labelLightningInput.showHelpMessageIfInvalid).toHaveBeenCalled();
                });
            });
        });

        describe('when a special character is entered & on focus out', () => {
            it('the DevName field should pre-populate with "UniqueName" text', () => {
                const newValue = ':)';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const labelLightningInput = labelDescription.querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);
                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({propertyName: 'label', value: newValue});
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({propertyName: 'name', value: 'UniqueName'});
                });
            });
        });
    });
    describe('devName', () => {
        it('input value is set when passed in as attribute', () => {
            const newValue = 'newValue';

            const labelDescription = createComponentUnderTest();
            labelDescription.devName.value = newValue;

            return Promise.resolve().then(() => {
                const devNameLightningInput = labelDescription.querySelector(selectors.devName);

                expect(devNameLightningInput.value).toEqual(newValue);
            });
        });

        it('default label is set', () => {
            const labelDescription = createComponentUnderTest();
            const expectedDefaultLabel = 'Unique Name';

            return Promise.resolve().then(() => {
                const devName = labelDescription.querySelector(selectors.devName);
                expect(devName.label).toEqual(expectedDefaultLabel);
            });
        });

        it('label is set when passed in as attribute', () => {
            const devNameLabel = 'API Name';
            const labelDescription = createComponentUnderTest();
            labelDescription.devNameLabel = devNameLabel;

            return Promise.resolve().then(() => {
                const devName = labelDescription.querySelector(selectors.devName);
                expect(devName.label).toEqual(devNameLabel);
            });
        });

        it('expands to full width with hideLabel = true', () => {
            const labelDescription = createComponentUnderTest();
            labelDescription.hideLabel = true;

            return Promise.resolve().then(() => {
                const devNameLightningInput = labelDescription.querySelector(selectors.devName);
                expect(devNameLightningInput.className).toBe('slds-col devName');
            });
        });

        describe('on focus out', () => {
            it('fires propertyChanged event if changed', () => {
                const newValue = 'newValue';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const devNameLightningInput = labelDescription.querySelector(selectors.devName);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    devNameLightningInput.mockUserInput(newValue);

                    devNameLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({propertyName: 'name', value: newValue});
                });
            });

            it('does not fire propertyChanged event if unchanged', () => {
                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const devNameLightningInput = labelDescription.querySelector(selectors.devName);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    devNameLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback).not.toHaveBeenCalled();
                });
            });
        });

        describe('error', () => {
            it('is displayed if present', () => {
                const errorMsg = 'an error';
                const labelDescription = createComponentUnderTest();
                labelDescription.devName = {
                    value: '',
                    error:  errorMsg
                };

                return Promise.resolve().then(() => {
                    const devNameLightningInput = labelDescription.querySelector(selectors.devName);

                    expect(devNameLightningInput.setCustomValidity).toHaveBeenCalledWith(errorMsg);
                    expect(devNameLightningInput.showHelpMessageIfInvalid).toHaveBeenCalled();
                });
            });

            it('is not displayed if not present', () => {
                const labelDescription = createComponentUnderTest();
                labelDescription.devName = {
                    value: '',
                    error:  null
                };

                return Promise.resolve().then(() => {
                    const devNameLightningInput = labelDescription.querySelector(selectors.devName);

                    expect(devNameLightningInput.setCustomValidity).toHaveBeenCalledWith('');
                    expect(devNameLightningInput.showHelpMessageIfInvalid).toHaveBeenCalled();
                });
            });
        });

        describe('value set from label update', () => {
            it('occurs when devName does not exist and label has changed', () => {
                const newValue = 'newValue';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const labelLightningInput = labelDescription.querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(2);
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({propertyName: 'name', value: newValue});
                });
            });

            it('occurs when devName does not exist and label has not changed', () => {
                const newValue = 'newValue';

                const labelDescription = createComponentUnderTest();
                labelDescription.label = {
                    value: newValue,
                };

                return Promise.resolve().then(() => {
                    const labelLightningInput = labelDescription.querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(1);
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({propertyName: 'name', value: newValue});
                });
            });

            it('does not occur when label was blank and remains blank after focusout', () => {
                const labelDescription = createComponentUnderTest();
                labelDescription.label = {
                    value: ''
                };

                return Promise.resolve().then(() => {
                    const labelLightningInput = labelDescription.querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback).not.toHaveBeenCalled();
                });
            });

            it('does not occur when devName exists', () => {
                const newValue = 'newValue';

                const labelDescription = createComponentUnderTest();
                labelDescription.devName = {
                    value: 'TEST',
                    error: ''
                };

                return Promise.resolve().then(() => {
                    const labelLightningInput = labelDescription.querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(1);
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({propertyName: 'label', value: newValue});
                });
            });

            it('should strip off trailing invalid characters', () => {
                const newValue = 'newValue_!@#@#$';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const labelLightningInput = labelDescription.querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(2);
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({propertyName: 'name', value: 'newValue'});
                });
            });
            it('should strip off preceding invalid characters', () => {
                const newValue = '$__newValue';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const labelLightningInput = labelDescription.querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(2);
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({propertyName: 'name', value: 'newValue'});
                });
            });
            it('should replace concurrent invalid characters with a single underscore', () => {
                const newValue = 'new_!@#@#$Value';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const labelLightningInput = labelDescription.querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(2);
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({propertyName: 'name', value: 'new_Value'});
                });
            });

            it('should prepend an "X" if label begins with a number', () => {
                const newValue = '1b';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const labelLightningInput = labelDescription.querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(2);
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({propertyName: 'name', value: 'X1b'});
                });
            });
            it('should strip preceding invalid characters and prepend an "X" if label begins with invalid characters ' +
                ' and then a number', () => {
                const newValue = '_$9b';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const labelLightningInput = labelDescription.querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(2);
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({propertyName: 'name', value: 'X9b'});
                });
            });
            it('should strip preceding invalid characters and prepend an "X" if label begins with invalid characters ' +
                ' and then a number' +
                'and replace concurrent invalid characters with a single underscore ' +
                'strip off trailing invalid characters', () => {
                const newValue = '_$9%b_#^';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const labelLightningInput = labelDescription.querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(2);
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({propertyName: 'name', value: 'X9_b'});
                });
            });
            it('should truncate label to 80 characters', () => {
                const newValue = 'a12345678901234567890123456789012345678901234567890123456789012345678901234567890';
                const expectedValue = 'a1234567890123456789012345678901234567890123456789012345678901234567890123456789';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const labelLightningInput = labelDescription.querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(2);
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({propertyName: 'name', value: expectedValue});
                });
            });
        });
    });
    describe('description', () => {
        it('input value is set when passed in as attribute', () => {
            const newValue = 'newValue';

            const labelDescription = createComponentUnderTest();
            labelDescription.description.value = newValue;

            return Promise.resolve().then(() => {
                const descriptionLightningInput = labelDescription.querySelector(selectors.description);

                expect(descriptionLightningInput.value).toEqual(newValue);
            });
        });

        describe('on focus out', () => {
            it('fires propertyChanged event if changed', () => {
                const newValue = 'newValue';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const descriptionLightningInput = labelDescription.querySelector(selectors.description);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    descriptionLightningInput.mockUserInput(newValue);

                    descriptionLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({propertyName: 'description', value: newValue});
                });
            });

            it('does not fire propertyChanged event if unchanged', () => {
                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const descriptionLightningInput = labelDescription.querySelector(selectors.description);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    descriptionLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback).not.toHaveBeenCalled();
                });
            });
        });

        it('is not included when hideDescription = true', () => {
            const labelDescription = createComponentUnderTest();
            labelDescription.hideDescription = true;

            return Promise.resolve().then(() => {
                const descriptionLightningInput = labelDescription.querySelector(selectors.description);

                expect(descriptionLightningInput).toBeNull();
            });
        });

        // TODO: Blocked by https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000002scNkIAI/view
        // describe('error', () => {
        //     it('is displayed if present', () => {
        //         const errorMsg = 'an error';
        //         const labelDescription = createComponentUnderTest();
        //         labelDescription.description = {
        //             value: '',
        //             error:  errorMsg
        //         };
        //
        //         return Promise.resolve().then(() => {
        //             const descriptionLightningTextArea = labelDescription.querySelector(selectors.description);
        //
        //             expect(descriptionLightningTextArea.setCustomValidity).toHaveBeenCalledWith(errorMsg);
        //             expect(descriptionLightningTextArea.showHelpMessageIfInvalid).toHaveBeenCalled();
        //         });
        //     });
        //
        //     it('is not displayed if not present', () => {
        //         const labelDescription = createComponentUnderTest();
        //         labelDescription.devName = {
        //             value: '',
        //             error:  null
        //         };
        //
        //         return Promise.resolve().then(() => {
        //             const descriptionLightningTextArea = labelDescription.querySelector(selectors.description);
        //
        //             expect(descriptionLightningTextArea.setCustomValidity).toHaveBeenCalledWith(null);
        //             expect(descriptionLightningTextArea.showHelpMessageIfInvalid).toHaveBeenCalled();
        //         });
        //     });
        // });
    });
});
