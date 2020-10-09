// @ts-nocheck
import { createElement } from 'lwc';
import LabelDescription from 'builder_platform_interaction/labelDescription';
import { PropertyChangedEvent, AddElementEvent, EditElementEvent } from 'builder_platform_interaction/events';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { focusoutEvent } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const createComponentUnderTest = (
    props = {
        label: '',
        devName: '',
        mode: undefined,
        editorParams: { panelConfig: { isLabelCollapsibleToHeader: false } }
    }
) => {
    const el = createElement('builder_platform_interaction-label-description', {
        is: LabelDescription
    });

    el.label.value = props.label;
    el.devName.value = props.devName;
    el.mode = props.mode;
    el.editorParams = props.editorParams;

    document.body.appendChild(el);
    return el;
};

const selectors = {
    label: '.label',
    devName: '.devName',
    description: '.description',
    container: '.container',
    editButton: '.test-edit-button',
    readOnly: '.test-read-only-info',
    newElementPanelHeader: '.test-new-element-panel-header',
    collapsibleLabelHeader: '.test-collapsible-label-header'
};

describe('label-description', () => {
    describe('element classes', () => {
        it('for vertical should match the layoutMode', async () => {
            const labelDescription = createComponentUnderTest();
            labelDescription.layoutMode = 'vertical';

            await ticks(1);
            const containerDiv = labelDescription.shadowRoot.querySelector(selectors.container);
            const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);
            const nameLightningInput = labelDescription.shadowRoot.querySelector(selectors.devName);
            expect(containerDiv.classList).toContain('slds-grid_vertical');
            expect(labelLightningInput.classList).not.toContain('slds-size_1-of-2');
            expect(nameLightningInput.classList).not.toContain('slds-size_1-of-2');
        });

        it('for horizontal should match the layoutMode', async () => {
            const labelDescription = createComponentUnderTest();

            await ticks(1);
            const containerDiv = labelDescription.shadowRoot.querySelector(selectors.container);
            const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);
            const nameLightningInput = labelDescription.shadowRoot.querySelector(selectors.devName);
            expect(containerDiv.classList).not.toContain('slds-grid_vertical');
            expect(labelLightningInput.classList).toContain('slds-size_1-of-2');
            expect(nameLightningInput.classList).toContain('slds-size_1-of-2');
        });
    });

    describe('label', () => {
        it('input value is set when passed in as attribute', async () => {
            const newValue = 'newValue';

            const labelDescription = createComponentUnderTest();
            labelDescription.label.value = newValue;

            await ticks(1);
            const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

            expect(labelLightningInput.value).toEqual(newValue);
        });
        it('label is required by default', async () => {
            const labelDescription = createComponentUnderTest();

            await ticks(1);
            const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

            expect(labelLightningInput.required).toBeTruthy();
        });
        it('label can be made optional', async () => {
            const labelDescription = createComponentUnderTest();
            labelDescription.labelOptional = true;

            await ticks(1);
            const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

            expect(labelLightningInput.required).toBeFalsy();
        });

        describe('on focus out', () => {
            it('fires propertyChanged event if changed', async () => {
                const newValue = 'newValue';

                const labelDescription = createComponentUnderTest();

                await ticks(1);
                const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                labelLightningInput.value = newValue;

                labelLightningInput.dispatchEvent(focusoutEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: { propertyName: 'label', value: newValue }
                });
            });

            it('fire propertyChanged event if unchanged', async () => {
                const labelDescription = createComponentUnderTest();

                await ticks(1);
                const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                labelLightningInput.dispatchEvent(focusoutEvent);

                expect(eventCallback).toHaveBeenLastCalledWith(eventCallback.mock.calls[0][0]);
            });

            it('strips whitespace', async () => {
                const newValue = ' newValue ';
                const newValueStripped = 'newValue';

                const labelDescription = createComponentUnderTest();

                await ticks(1);
                const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                labelLightningInput.value = newValue;

                labelLightningInput.dispatchEvent(focusoutEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        propertyName: 'label',
                        value: newValueStripped
                    }
                });
            });
        });

        it('is not included when hideLabel = true', async () => {
            const labelDescription = createComponentUnderTest();
            labelDescription.hideLabel = true;

            await ticks(1);
            const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

            expect(labelLightningInput).toBeNull();
        });

        describe('error', () => {
            it('is displayed if present', async () => {
                const errorMsg = 'an error';
                const labelDescription = createComponentUnderTest();
                labelDescription.label = {
                    value: '',
                    error: errorMsg
                };

                await ticks(1);
                const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

                expect(labelLightningInput.setCustomValidity).toHaveBeenCalledWith(errorMsg);
                expect(labelLightningInput.showHelpMessageIfInvalid).toHaveBeenCalled();
            });

            it('is not displayed if not present', async () => {
                const labelDescription = createComponentUnderTest();
                labelDescription.label = {
                    value: '',
                    error: null
                };

                await ticks(1);
                const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

                expect(labelLightningInput.setCustomValidity).toHaveBeenCalledWith('');
                expect(labelLightningInput.showHelpMessageIfInvalid).toHaveBeenCalled();
            });

            it('resets the error when changing the label with no error', async () => {
                const labelDescription = createComponentUnderTest();
                labelDescription.label = {
                    value: 'some new value',
                    error: null
                };

                await ticks(1);
                const labelInput = labelDescription.shadowRoot.querySelector(selectors.label);

                expect(labelInput.setCustomValidity.mock.calls[0][0]).toEqual('');
            });
        });

        describe('dev name population on label focus out', () => {
            it('when DevName present, the DevName field should pre-populate with "UniqueName" text', async () => {
                const newValue = ':)';

                const labelDescription = createComponentUnderTest();

                await ticks(1);
                const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                labelLightningInput.value = newValue;
                labelLightningInput.dispatchEvent(focusoutEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: { propertyName: 'label', value: newValue }
                });
                expect(eventCallback.mock.calls[1][0]).toMatchObject({
                    detail: { propertyName: 'name', value: 'UniqueName' }
                });
            });

            it('when DevName not present, the DevName field does not update', async () => {
                const newValue = ':)';

                const labelDescription = createComponentUnderTest();
                labelDescription.hideDevName = true;

                await ticks(1);
                const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                labelLightningInput.value = newValue;
                labelLightningInput.dispatchEvent(focusoutEvent);

                expect(eventCallback).toHaveBeenCalledTimes(1);
                expect(eventCallback.mock.calls[0][0]).not.toMatchObject({
                    detail: { propertyName: 'name' }
                });
            });

            it('when DevName is disabled, the DevName field does not update', async () => {
                const newValue = ':)';

                const labelDescription = createComponentUnderTest();
                labelDescription.disableDevName = true;

                await ticks(1);
                const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                labelLightningInput.value = newValue;
                labelLightningInput.dispatchEvent(focusoutEvent);

                expect(eventCallback).toHaveBeenCalledTimes(1);
                expect(eventCallback.mock.calls[0][0]).not.toMatchObject({
                    detail: { propertyName: 'name' }
                });
            });
        });
    });
    describe('devName', () => {
        it('input value is set when passed in as attribute', async () => {
            const newValue = 'newValue';

            const labelDescription = createComponentUnderTest();
            labelDescription.devName.value = newValue;

            await ticks(1);
            const devNameLightningInput = labelDescription.shadowRoot.querySelector(selectors.devName);

            expect(devNameLightningInput.value).toEqual(newValue);
        });

        it('default label is set', async () => {
            const labelDescription = createComponentUnderTest();
            const expectedDefaultLabel = 'FlowBuilderLabelDescription.uniqueNameLabel';

            await ticks(1);
            const devName = labelDescription.shadowRoot.querySelector(selectors.devName);
            expect(devName.label).toEqual(expectedDefaultLabel);
        });

        it('nameLabel is set when passed in as attribute', async () => {
            const nameLabel = 'Label';
            const labelDescription = createComponentUnderTest();
            labelDescription.nameLabel = nameLabel;

            await ticks(1);
            const name = labelDescription.shadowRoot.querySelector(selectors.label);
            expect(name.label).toEqual(nameLabel);
        });

        it('devNameLabel is set when passed in as attribute', async () => {
            const devNameLabel = 'API Name';
            const labelDescription = createComponentUnderTest();
            labelDescription.devNameLabel = devNameLabel;

            await ticks(1);
            const devName = labelDescription.shadowRoot.querySelector(selectors.devName);
            expect(devName.label).toEqual(devNameLabel);
        });

        it('expands to full width with hideLabel = true', async () => {
            const labelDescription = createComponentUnderTest();
            labelDescription.hideLabel = true;

            await ticks(1);
            const devNameLightningInput = labelDescription.shadowRoot.querySelector(selectors.devName);
            expect(devNameLightningInput.className).toBe('slds-col devName');
        });

        it('is not included when hideDevName = true', async () => {
            const labelDescription = createComponentUnderTest();
            labelDescription.hideDevName = true;

            await ticks(1);
            const devNameLightningInput = labelDescription.shadowRoot.querySelector(selectors.devName);

            expect(devNameLightningInput).toBeNull();
        });

        describe('on focus out', () => {
            it('fires propertyChanged event if changed', async () => {
                const newValue = 'newValue';

                const labelDescription = createComponentUnderTest();

                await ticks(1);
                const devNameLightningInput = labelDescription.shadowRoot.querySelector(selectors.devName);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                devNameLightningInput.value = newValue;

                devNameLightningInput.dispatchEvent(focusoutEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: { propertyName: 'name', value: newValue }
                });
            });

            it('fires propertyChanged event if unchanged', async () => {
                const labelDescription = createComponentUnderTest();

                await ticks(1);
                const devNameLightningInput = labelDescription.shadowRoot.querySelector(selectors.devName);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                devNameLightningInput.dispatchEvent(focusoutEvent);

                expect(eventCallback).toHaveBeenLastCalledWith(eventCallback.mock.calls[0][0]);
            });

            it('strips whitespace', async () => {
                const newValue = ' new Value ';
                const newValueStripped = 'newValue';

                const labelDescription = createComponentUnderTest();

                await ticks(1);
                const devNameLightningInput = labelDescription.shadowRoot.querySelector(selectors.devName);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                devNameLightningInput.value = newValue;

                devNameLightningInput.dispatchEvent(focusoutEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: {
                        propertyName: 'name',
                        value: newValueStripped
                    }
                });
            });
        });

        describe('error', () => {
            it('is displayed if present', async () => {
                const errorMsg = 'an error';
                const labelDescription = createComponentUnderTest();
                labelDescription.devName = {
                    value: '',
                    error: errorMsg
                };

                await ticks(1);
                const devNameLightningInput = labelDescription.shadowRoot.querySelector(selectors.devName);

                expect(devNameLightningInput.setCustomValidity).toHaveBeenCalledWith(errorMsg);
                expect(devNameLightningInput.showHelpMessageIfInvalid).toHaveBeenCalled();
            });

            it('is not displayed if not present', async () => {
                const labelDescription = createComponentUnderTest();
                labelDescription.devName = {
                    value: '',
                    error: null
                };

                await ticks(1);
                const devNameLightningInput = labelDescription.shadowRoot.querySelector(selectors.devName);

                expect(devNameLightningInput.setCustomValidity).toHaveBeenCalledWith('');
                expect(devNameLightningInput.showHelpMessageIfInvalid).toHaveBeenCalled();
            });

            it('resets the error when changing the devName with no error', async () => {
                const labelDescription = createComponentUnderTest();
                labelDescription.devName = {
                    value: 'some new value',
                    error: null
                };

                await ticks(1);
                const devNameInput = labelDescription.shadowRoot.querySelector(selectors.devName);

                expect(devNameInput.setCustomValidity.mock.calls[0][0]).toEqual('');
            });
        });

        describe('value set from label update', () => {
            it('occurs when devName does not exist and label has changed', async () => {
                const newValue = 'newValue';

                const labelDescription = createComponentUnderTest();

                await ticks(1);
                const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                labelLightningInput.value = newValue;

                labelLightningInput.dispatchEvent(focusoutEvent);

                expect(eventCallback.mock.calls).toHaveLength(2);
                expect(eventCallback.mock.calls[1][0]).toMatchObject({
                    detail: { propertyName: 'name', value: newValue }
                });
            });

            it('occurs when devName does not exist and label has not changed', async () => {
                const newValue = 'newValue';

                const labelDescription = createComponentUnderTest();
                labelDescription.label = {
                    value: newValue
                };

                await ticks(1);
                const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                labelLightningInput.dispatchEvent(focusoutEvent);
                const call = eventCallback.mock.calls[0][0];

                expect(call.detail.propertyName).toEqual('label');
                expect(call.detail.value).toEqual(newValue);
            });

            it('does occur when label was blank and remains blank after focusout', async () => {
                const labelDescription = createComponentUnderTest();
                labelDescription.label = {
                    value: ''
                };

                await ticks(1);
                const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                labelLightningInput.dispatchEvent(focusoutEvent);

                expect(eventCallback).toHaveBeenCalled();
            });

            it('does not occur when devName exists', async () => {
                const newValue = 'newValue';

                const labelDescription = createComponentUnderTest();
                labelDescription.devName = {
                    value: 'TEST',
                    error: ''
                };

                await ticks(1);
                const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                labelLightningInput.value = newValue;

                labelLightningInput.dispatchEvent(focusoutEvent);

                expect(eventCallback.mock.calls).toHaveLength(1);
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: { propertyName: 'label', value: newValue }
                });
            });

            it('should strip off trailing invalid characters', async () => {
                const newValue = 'newValue_!@#@#$';

                const labelDescription = createComponentUnderTest();

                await ticks(1);
                const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                labelLightningInput.value = newValue;

                labelLightningInput.dispatchEvent(focusoutEvent);

                expect(eventCallback.mock.calls).toHaveLength(2);
                expect(eventCallback.mock.calls[1][0]).toMatchObject({
                    detail: { propertyName: 'name', value: 'newValue' }
                });
            });
            it('should strip off preceding invalid characters', async () => {
                const newValue = '$__newValue';

                const labelDescription = createComponentUnderTest();

                await ticks(1);
                const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                labelLightningInput.value = newValue;

                labelLightningInput.dispatchEvent(focusoutEvent);

                expect(eventCallback.mock.calls).toHaveLength(2);
                expect(eventCallback.mock.calls[1][0]).toMatchObject({
                    detail: { propertyName: 'name', value: 'newValue' }
                });
            });
            it('should replace concurrent invalid characters with a single underscore', async () => {
                const newValue = 'new_!@#@#$Value';

                const labelDescription = createComponentUnderTest();

                await ticks(1);
                const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                labelLightningInput.value = newValue;

                labelLightningInput.dispatchEvent(focusoutEvent);

                expect(eventCallback.mock.calls).toHaveLength(2);
                expect(eventCallback.mock.calls[1][0]).toMatchObject({
                    detail: { propertyName: 'name', value: 'new_Value' }
                });
            });

            it('should prepend an "X" if label begins with a number', async () => {
                const newValue = '1b';

                const labelDescription = createComponentUnderTest();

                await ticks(1);
                const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                labelLightningInput.value = newValue;

                labelLightningInput.dispatchEvent(focusoutEvent);

                expect(eventCallback.mock.calls).toHaveLength(2);
                expect(eventCallback.mock.calls[1][0]).toMatchObject({
                    detail: { propertyName: 'name', value: 'X1b' }
                });
            });
            it(
                'should strip preceding invalid characters and prepend an "X" if label begins with invalid characters ' +
                    ' and then a number',
                async () => {
                    const newValue = '_$9b';

                    const labelDescription = createComponentUnderTest();

                    await ticks(1);
                    const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.value = newValue;

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(2);
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({
                        detail: { propertyName: 'name', value: 'X9b' }
                    });
                }
            );
            it(
                'should strip preceding invalid characters and prepend an "X" if label begins with invalid characters ' +
                    ' and then a number' +
                    'and replace concurrent invalid characters with a single underscore ' +
                    'strip off trailing invalid characters',
                async () => {
                    const newValue = '_$9%b_#^';

                    const labelDescription = createComponentUnderTest();

                    await ticks(1);
                    const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

                    const eventCallback = jest.fn();
                    labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                    labelLightningInput.value = newValue;

                    labelLightningInput.dispatchEvent(focusoutEvent);

                    expect(eventCallback.mock.calls).toHaveLength(2);
                    expect(eventCallback.mock.calls[1][0]).toMatchObject({
                        detail: { propertyName: 'name', value: 'X9_b' }
                    });
                }
            );
            it('should truncate label to 80 characters', async () => {
                const newValue = 'a12345678901234567890123456789012345678901234567890123456789012345678901234567890';
                const expectedValue =
                    'a1234567890123456789012345678901234567890123456789012345678901234567890123456789';

                const labelDescription = createComponentUnderTest();

                await ticks(1);
                const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                labelLightningInput.value = newValue;

                labelLightningInput.dispatchEvent(focusoutEvent);

                expect(eventCallback.mock.calls).toHaveLength(2);
                expect(eventCallback.mock.calls[1][0]).toMatchObject({
                    detail: { propertyName: 'name', value: expectedValue }
                });
            });
        });
    });
    describe('description', () => {
        it('input value is set when passed in as attribute', async () => {
            const newValue = 'newValue';

            const labelDescription = createComponentUnderTest();
            labelDescription.description.value = newValue;

            await ticks(1);
            const descriptionLightningInput = labelDescription.shadowRoot.querySelector(selectors.description);

            expect(descriptionLightningInput.value).toEqual(newValue);
        });

        describe('on focus out', () => {
            it('fires propertyChanged event if changed', async () => {
                const newValue = 'newValue';

                const labelDescription = createComponentUnderTest();

                await ticks(1);
                const descriptionLightningInput = labelDescription.shadowRoot.querySelector(selectors.description);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                descriptionLightningInput.value = newValue;

                descriptionLightningInput.dispatchEvent(focusoutEvent);

                expect(eventCallback).toHaveBeenCalled();
                expect(eventCallback.mock.calls[0][0]).toMatchObject({
                    detail: { propertyName: 'description', value: newValue }
                });
            });

            it('does fire propertyChanged event if unchanged', async () => {
                const labelDescription = createComponentUnderTest();

                await ticks(1);
                const descriptionLightningInput = labelDescription.shadowRoot.querySelector(selectors.description);

                const eventCallback = jest.fn();
                labelDescription.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);

                descriptionLightningInput.dispatchEvent(focusoutEvent);

                expect(eventCallback).toHaveBeenCalled();
            });
        });

        it('is not included when hideDescription = true', async () => {
            const labelDescription = createComponentUnderTest();
            labelDescription.hideDescription = true;

            await ticks(1);
            const descriptionLightningInput = labelDescription.shadowRoot.querySelector(selectors.description);

            expect(descriptionLightningInput).toBeNull();
        });

        // TODO: Blocked by https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000002scNkIAI/view
        // describe('error', () => {
        //     it('is displayed if present', async () => {
        //         const errorMsg = 'an error';
        //         const labelDescription = createComponentUnderTest();
        //         labelDescription.description = {
        //             value: '',
        //             error:  errorMsg
        //         };
        //
        //             await ticks(1);
        //             const descriptionLightningTextArea = labelDescription.shadowRoot.querySelector(selectors.description);
        //
        //             expect(descriptionLightningTextArea.setCustomValidity).toHaveBeenCalledWith(errorMsg);
        //             expect(descriptionLightningTextArea.showHelpMessageIfInvalid).toHaveBeenCalled();
        //     });
        //
        //     it('is not displayed if not present', async () => {
        //         const labelDescription = createComponentUnderTest();
        //         labelDescription.devName = {
        //             value: '',
        //             error:  null
        //         };
        //
        //             await ticks(1);
        //             const descriptionLightningTextArea = labelDescription.shadowRoot.querySelector(selectors.description);
        //
        //             expect(descriptionLightningTextArea.setCustomValidity).toHaveBeenCalledWith(null);
        //             expect(descriptionLightningTextArea.showHelpMessageIfInvalid).toHaveBeenCalled();
        //     });
        // });
    });
    it('check if label, devName, Description fields are disabled', async () => {
        const labelDescription = createComponentUnderTest();
        labelDescription.disableDevName = true;
        labelDescription.disableName = true;
        labelDescription.disableDescription = true;

        await ticks(1);
        const labelLightningInput = labelDescription.shadowRoot.querySelector(selectors.label);
        const devNameLightningInput = labelDescription.shadowRoot.querySelector(selectors.devName);
        const descriptionLightningInput = labelDescription.shadowRoot.querySelector(selectors.description);
        expect(labelLightningInput.disabled).toBeTruthy();
        expect(devNameLightningInput.disabled).toBeTruthy();
        expect(descriptionLightningInput.disabled).toBeTruthy();
    });
    describe('Edit Button', () => {
        it('edit button should be present if element is not new', async () => {
            const labelDescription = createComponentUnderTest({
                mode: EditElementEvent.EVENT_NAME
            });
            await ticks(1);
            const editButton = labelDescription.shadowRoot.querySelector(selectors.editButton);
            expect(editButton).not.toBeNull();
        });
        it('edit button should not be present if element is new', async () => {
            const labelDescription = createComponentUnderTest({
                mode: AddElementEvent.EVENT_NAME
            });
            await ticks(1);
            const editButton = labelDescription.shadowRoot.querySelector(selectors.editButton);
            expect(editButton).toBeNull();
        });
        it('edit button should change label description to edit mode when clicked', async () => {
            const labelDescription = createComponentUnderTest({
                mode: EditElementEvent.EVENT_NAME
            });
            await ticks(1);
            const editButton = labelDescription.shadowRoot.querySelector(selectors.editButton);
            editButton.click();
            const readOnly = labelDescription.shadowRoot.querySelector(selectors.readOnly);
            expect(readOnly).not.toBeNull();
        });
    });
    describe('Read only Label', () => {
        it('is not included when hideLabel = true', async () => {
            const labelDescription = createComponentUnderTest({
                label: 'label',
                devName: 'devName',
                mode: EditElementEvent.EVENT_NAME
            });
            labelDescription.hideLabel = true;
            await ticks(1);
            const readOnly = labelDescription.shadowRoot.querySelector(selectors.readOnly);

            expect(readOnly.contains('label')).not.toBeTruthy();
        });
    });
    describe('Read only DevName', () => {
        it('is not included when hideDevName = true', async () => {
            const labelDescription = createComponentUnderTest({
                devName: 'devName',
                mode: EditElementEvent.EVENT_NAME
            });
            labelDescription.hideDevName = true;
            await ticks(1);
            const readOnly = labelDescription.shadowRoot.querySelector(selectors.readOnly);

            expect(readOnly.contains('devName')).not.toBeTruthy();
        });
    });
    describe('Read only Description', () => {
        it('is not included when hideDescription = true', async () => {
            const labelDescription = createComponentUnderTest({
                devName: 'devName',
                mode: EditElementEvent.EVENT_NAME
            });
            labelDescription.hideDescription = true;
            labelDescription.description.value = 'description';
            await ticks(1);
            const readOnly = labelDescription.shadowRoot.querySelector(selectors.readOnly);

            expect(readOnly.contains('description')).not.toBeTruthy();
        });
    });
    describe('Right Panel New Element Header', () => {
        it('Show when isLabelCollapsibleToHeader = true and mode != EditElement', async () => {
            expect.assertions(1);
            const labelDescription = createComponentUnderTest({
                editorParams: { panelConfig: { isLabelCollapsibleToHeader: true } },
                mode: AddElementEvent.EVENT_NAME
            });

            const newElementPanelHeader = labelDescription.shadowRoot.querySelector(selectors.newElementPanelHeader);

            expect(newElementPanelHeader).not.toBeNull();
        });
        it("Don't show when mode = EditElement", async () => {
            expect.assertions(1);
            const labelDescription = createComponentUnderTest({
                editorParams: {
                    panelConfig: { isLabelCollapsibleToHeader: true, elementType: ELEMENT_TYPE.ASSIGNMENT }
                },
                mode: EditElementEvent.EVENT_NAME
            });

            const newElementPanelHeader = labelDescription.shadowRoot.querySelector(selectors.newElementPanelHeader);

            expect(newElementPanelHeader).toBeNull();
        });
        it("Don't show when isLabelCollapsibleToHeader = false", async () => {
            expect.assertions(1);
            const labelDescription = createComponentUnderTest({
                mode: AddElementEvent.EVENT_NAME
            });

            const newElementPanelHeader = labelDescription.shadowRoot.querySelector(selectors.newElementPanelHeader);

            expect(newElementPanelHeader).toBeNull();
        });
    });
    describe('Right Panel Label Description Collapsed into Header', () => {
        it('Show when isLabelCollapsibleToHeader = true and mode = EditElement', async () => {
            expect.assertions(1);
            const labelDescription = createComponentUnderTest({
                editorParams: {
                    panelConfig: { isLabelCollapsibleToHeader: true, elementType: ELEMENT_TYPE.ASSIGNMENT }
                },
                mode: EditElementEvent.EVENT_NAME
            });

            const newElementPanelHeader = labelDescription.shadowRoot.querySelector(selectors.collapsibleLabelHeader);

            expect(newElementPanelHeader).not.toBeNull();
        });
        it("Don't show when isLabelCollapsibleToHeader = true and mode != EditElement", async () => {
            expect.assertions(1);
            const labelDescription = createComponentUnderTest({
                editorParams: {
                    panelConfig: { isLabelCollapsibleToHeader: true, elementType: ELEMENT_TYPE.ASSIGNMENT }
                },
                mode: AddElementEvent.EVENT_NAME
            });

            const newElementPanelHeader = labelDescription.shadowRoot.querySelector(selectors.collapsibleLabelHeader);

            expect(newElementPanelHeader).toBeNull();
        });
        it("Don't show when isLabelCollapsibleToHeader = false", async () => {
            expect.assertions(1);
            const labelDescription = createComponentUnderTest({
                editorParams: {
                    panelConfig: { isLabelCollapsibleToHeader: false, elementType: ELEMENT_TYPE.ASSIGNMENT }
                },
                mode: AddElementEvent.EVENT_NAME
            });

            const newElementPanelHeader = labelDescription.shadowRoot.querySelector(selectors.collapsibleLabelHeader);

            expect(newElementPanelHeader).toBeNull();
        });
    });
});
