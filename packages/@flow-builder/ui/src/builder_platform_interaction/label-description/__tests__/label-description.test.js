import {createElement} from 'engine';
import LabelDescription from 'builder_platform_interaction-label-description';
import {PropertyChangedEvent} from 'builder_platform_interaction-events';
import { getShadowRoot } from 'lwc-test-utils';

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
    container: '.container',
};

const focusoutEvent = new FocusEvent('focusout', {
    'bubbles'   : true,
    'cancelable': true,
});

describe('label-description', () => {
    describe('element classes', () => {
        it('for vertical should match the layoutMode', () => {
            const labelDescription = createComponentUnderTest();
            labelDescription.layoutMode = 'vertical';

            return Promise.resolve().then(() => {
                const containerDiv = getShadowRoot(labelDescription).querySelector(selectors.container);
                const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);
                const nameLightningInput = getShadowRoot(labelDescription).querySelector(selectors.devName);
                expect(containerDiv.classList).toContain('slds-grid_vertical');
                expect(labelLightningInput.classList).not.toContain('slds-size_1-of-2');
                expect(nameLightningInput.classList).not.toContain('slds-size_1-of-2');
            });
        });

        it('for horizontal should match the layoutMode', () => {
            const labelDescription = createComponentUnderTest();

            return Promise.resolve().then(() => {
                const containerDiv = getShadowRoot(labelDescription).querySelector(selectors.container);
                const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);
                const nameLightningInput = getShadowRoot(labelDescription).querySelector(selectors.devName);
                expect(containerDiv.classList).not.toContain('slds-grid_vertical');
                expect(labelLightningInput.classList).toContain('slds-size_1-of-2');
                expect(nameLightningInput.classList).toContain('slds-size_1-of-2');
            });
        });
    });

    describe('label', () => {
        it('input value is set when passed in as attribute', () => {
            const newValue = 'newValue';

            const labelDescription = createComponentUnderTest();
            labelDescription.label.value = newValue;

            return Promise.resolve().then(() => {
                const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

                expect(labelLightningInput.value).toEqual(newValue);
            });
        });
        it('label is required by default', () => {
            const labelDescription = createComponentUnderTest();

            return Promise.resolve().then(() => {
                const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

                expect(labelLightningInput.required).toBeTruthy();
            });
        });
        it('label can be made optional', () => {
            const labelDescription = createComponentUnderTest();
            labelDescription.labelOptional = true;

            return Promise.resolve().then(() => {
                const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

                expect(labelLightningInput.required).toBeFalsy();
            });
        });

        describe('on focus out', () => {
            it('fires propertyChanged event if changed', () => {
                const newValue = 'newValue';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({detail:{propertyName: 'label', value: newValue}});
                });
            });

            it('does not fire propertyChanged event if unchanged', () => {
                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const devNameLightningInput = getShadowRoot(labelDescription).querySelector(selectors.devName);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    devNameLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback).not.toHaveBeenCalled();
                });
            });

            it('strips whitespace', () => {
                const newValue = ' newValue ';
                const newValueStripped = 'newValue';

                const labelDescription = createComponentUnderTest();


                return Promise.resolve().then(() => {
                    const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {propertyName: 'label', value: newValueStripped}});
                });
            });
        });

        it('is not included when hideLabel = true', () => {
            const labelDescription = createComponentUnderTest();
            labelDescription.hideLabel = true;

            return Promise.resolve().then(() => {
                const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

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
                    const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

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
                    const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

                    expect(labelLightningInput.setCustomValidity).toHaveBeenCalledWith('');
                    expect(labelLightningInput.showHelpMessageIfInvalid).toHaveBeenCalled();
                });
            });
        });

        describe('dev name population on label focus out', () => {
            it('when DevName present, the DevName field should pre-populate with "UniqueName" text', () => {
                const newValue = ':)';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);
                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {propertyName: 'label', value: newValue}});
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({detail: {propertyName: 'name', value: 'UniqueName'}});
                });
            });

            it('when DevName not present, the DevName field does not update', () => {
                const newValue = ':)';

                const labelDescription = createComponentUnderTest();
                labelDescription.hideDevName = true;

                return Promise.resolve().then(() => {
                    const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);
                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback).toHaveBeenCalledTimes(1);
                    expect(eventCallback.mock.calls[0][0]).not.toMatchObject({detail: {propertyName: 'name'}});
                });
            });

            it('when DevName is disabled, the DevName field does not update', () => {
                const newValue = ':)';

                const labelDescription = createComponentUnderTest();
                labelDescription.disableDevName = true;

                return Promise.resolve().then(() => {
                    const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);
                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback).toHaveBeenCalledTimes(1);
                    expect(eventCallback.mock.calls[0][0]).not.toMatchObject({detail: {propertyName: 'name'}});
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
                const devNameLightningInput = getShadowRoot(labelDescription).querySelector(selectors.devName);

                expect(devNameLightningInput.value).toEqual(newValue);
            });
        });

        it('default label is set', () => {
            const labelDescription = createComponentUnderTest();
            const expectedDefaultLabel = 'FlowBuilderLabelDescription.uniqueNameLabel';

            return Promise.resolve().then(() => {
                const devName = getShadowRoot(labelDescription).querySelector(selectors.devName);
                expect(devName.label).toEqual(expectedDefaultLabel);
            });
        });

        it('nameLabel is set when passed in as attribute', () => {
            const nameLabel = 'Label';
            const labelDescription = createComponentUnderTest();
            labelDescription.nameLabel = nameLabel;

            return Promise.resolve().then(() => {
                const name = getShadowRoot(labelDescription).querySelector(selectors.label);
                expect(name.label).toEqual(nameLabel);
            });
        });

        it('devNameLabel is set when passed in as attribute', () => {
            const devNameLabel = 'API Name';
            const labelDescription = createComponentUnderTest();
            labelDescription.devNameLabel = devNameLabel;

            return Promise.resolve().then(() => {
                const devName = getShadowRoot(labelDescription).querySelector(selectors.devName);
                expect(devName.label).toEqual(devNameLabel);
            });
        });

        it('expands to full width with hideLabel = true', () => {
            const labelDescription = createComponentUnderTest();
            labelDescription.hideLabel = true;

            return Promise.resolve().then(() => {
                const devNameLightningInput = getShadowRoot(labelDescription).querySelector(selectors.devName);
                expect(devNameLightningInput.className).toBe('slds-col devName');
            });
        });

        it('is not included when hideDevName = true', () => {
            const labelDescription = createComponentUnderTest();
            labelDescription.hideDevName = true;

            return Promise.resolve().then(() => {
                const devNameLightningInput = getShadowRoot(labelDescription).querySelector(selectors.devName);

                expect(devNameLightningInput).toBeNull();
            });
        });

        describe('on focus out', () => {
            it('fires propertyChanged event if changed', () => {
                const newValue = 'newValue';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const devNameLightningInput = getShadowRoot(labelDescription).querySelector(selectors.devName);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    devNameLightningInput.mockUserInput(newValue);

                    devNameLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {propertyName: 'name', value: newValue}});
                });
            });

            it('does not fire propertyChanged event if unchanged', () => {
                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const devNameLightningInput = getShadowRoot(labelDescription).querySelector(selectors.devName);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    devNameLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback).not.toHaveBeenCalled();
                });
            });

            it('strips whitespace', () => {
                const newValue = ' new Value ';
                const newValueStripped = 'newValue';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const devNameLightningInput = getShadowRoot(labelDescription).querySelector(selectors.devName);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    devNameLightningInput.mockUserInput(newValue);

                    devNameLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {propertyName: 'name', value: newValueStripped}});
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
                    const devNameLightningInput = getShadowRoot(labelDescription).querySelector(selectors.devName);

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
                    const devNameLightningInput = getShadowRoot(labelDescription).querySelector(selectors.devName);

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
                    const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(2);
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({detail: {propertyName: 'name', value: newValue}});
                });
            });

            it('occurs when devName does not exist and label has not changed', () => {
                const newValue = 'newValue';

                const labelDescription = createComponentUnderTest();
                labelDescription.label = {
                    value: newValue,
                };

                return Promise.resolve().then(() => {
                    const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(1);
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {propertyName: 'name', value: newValue}});
                });
            });

            it('does not occur when label was blank and remains blank after focusout', () => {
                const labelDescription = createComponentUnderTest();
                labelDescription.label = {
                    value: ''
                };

                return Promise.resolve().then(() => {
                    const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

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
                    const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(1);
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {propertyName: 'label', value: newValue}});
                });
            });

            it('should strip off trailing invalid characters', () => {
                const newValue = 'newValue_!@#@#$';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(2);
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({detail: {propertyName: 'name', value: 'newValue'}});
                });
            });
            it('should strip off preceding invalid characters', () => {
                const newValue = '$__newValue';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(2);
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({detail: {propertyName: 'name', value: 'newValue'}});
                });
            });
            it('should replace concurrent invalid characters with a single underscore', () => {
                const newValue = 'new_!@#@#$Value';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(2);
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({detail: {propertyName: 'name', value: 'new_Value'}});
                });
            });

            it('should prepend an "X" if label begins with a number', () => {
                const newValue = '1b';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(2);
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({detail: {propertyName: 'name', value: 'X1b'}});
                });
            });
            it('should strip preceding invalid characters and prepend an "X" if label begins with invalid characters ' +
                ' and then a number', () => {
                const newValue = '_$9b';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(2);
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({detail: {propertyName: 'name', value: 'X9b'}});
                });
            });
            it('should strip preceding invalid characters and prepend an "X" if label begins with invalid characters ' +
                ' and then a number' +
                'and replace concurrent invalid characters with a single underscore ' +
                'strip off trailing invalid characters', () => {
                const newValue = '_$9%b_#^';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(2);
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({detail: {propertyName: 'name', value: 'X9_b'}});
                });
            });
            it('should truncate label to 80 characters', () => {
                const newValue = 'a12345678901234567890123456789012345678901234567890123456789012345678901234567890';
                const expectedValue = 'a1234567890123456789012345678901234567890123456789012345678901234567890123456789';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const labelLightningInput = getShadowRoot(labelDescription).querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.mockUserInput(newValue);

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(2);
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({detail: {propertyName: 'name', value: expectedValue}});
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
                const descriptionLightningInput = getShadowRoot(labelDescription).querySelector(selectors.description);

                expect(descriptionLightningInput.value).toEqual(newValue);
            });
        });

        describe('on focus out', () => {
            it('fires propertyChanged event if changed', () => {
                const newValue = 'newValue';

                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const descriptionLightningInput = getShadowRoot(labelDescription).querySelector(selectors.description);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    descriptionLightningInput.mockUserInput(newValue);

                    descriptionLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback).toHaveBeenCalled();
                    expect(eventCallback.mock.calls[0][0]).toMatchObject({detail: {propertyName: 'description', value: newValue}});
                });
            });

            it('does not fire propertyChanged event if unchanged', () => {
                const labelDescription = createComponentUnderTest();

                return Promise.resolve().then(() => {
                    const descriptionLightningInput = getShadowRoot(labelDescription).querySelector(selectors.description);

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
                const descriptionLightningInput = getShadowRoot(labelDescription).querySelector(selectors.description);

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
        //             const descriptionLightningTextArea = getShadowRoot(labelDescription).querySelector(selectors.description);
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
        //             const descriptionLightningTextArea = getShadowRoot(labelDescription).querySelector(selectors.description);
        //
        //             expect(descriptionLightningTextArea.setCustomValidity).toHaveBeenCalledWith(null);
        //             expect(descriptionLightningTextArea.showHelpMessageIfInvalid).toHaveBeenCalled();
        //         });
        //     });
        // });
    });
});
