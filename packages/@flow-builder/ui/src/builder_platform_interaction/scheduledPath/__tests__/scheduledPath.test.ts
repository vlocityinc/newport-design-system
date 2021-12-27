import {
    INTERACTION_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { DeleteScheduledPathEvent, PropertyChangedEvent } from 'builder_platform_interaction/events';
import { TIME_OPTION } from 'builder_platform_interaction/flowMetadata';
import ScheduledPath from 'builder_platform_interaction/scheduledPath';
import { createElement } from 'lwc';

const scheduledPathMock = {
    label: { value: 'My scheduled path element', error: null },
    name: { value: 'Some_time_trigger_name', error: null },
    timeSource: { value: 'ClosedDate', error: null },
    guid: 'some guid',
    offsetNumber: { value: 2, error: null },
    offsetUnit: { value: TIME_OPTION.HOURS_BEFORE, error: null },
    maxBatchSize: { value: 100, error: null }
};

const selectors = {
    labelAndName: INTERACTION_COMPONENTS_SELECTORS.LABEL_DESCRIPTION,
    timeSource: '.timeSourceCombobox',
    offsetNumber: '.offsetNumberInput',
    offsetUnitAndDirection: '.offsetUnitAndDirectionCombobox',
    deletePathButton: '.delete-scheduled-path-btn',
    batchSizeInput: '.batchSizeInput'
};

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-scheduled-path', {
        is: ScheduledPath
    });
    el.scheduledPath = scheduledPathMock;
    setDocumentBodyChildren(el);
    return el;
};

describe('ScheduledPath', () => {
    let element;
    beforeEach(() => {
        element = createComponentUnderTest();
        element.scheduledPath = scheduledPathMock;
    });
    describe('field component presence verification', () => {
        it('has name and api name component', () => {
            const labelAndNameComponents = element.shadowRoot.querySelectorAll(selectors.labelAndName);
            expect(labelAndNameComponents).toHaveLength(1);
            expect(labelAndNameComponents[0].devName.value).toBe(scheduledPathMock.name.value);
            expect(labelAndNameComponents[0].label.value).toBe(scheduledPathMock.label.value);
        });
        it('has required time source field component', () => {
            const timeSourceComponent = element.shadowRoot.querySelectorAll(selectors.timeSource);
            expect(timeSourceComponent).toHaveLength(1);
            expect(timeSourceComponent[0].value).toBe(scheduledPathMock.timeSource.value);
            expect(timeSourceComponent[0].required).toBeTruthy();
        });
        it('has required offset number field component', () => {
            const offsetNumberComponent = element.shadowRoot.querySelectorAll(selectors.offsetNumber);
            expect(offsetNumberComponent).toHaveLength(1);
            expect(offsetNumberComponent[0].value).toBe(scheduledPathMock.offsetNumber.value);
            expect(offsetNumberComponent[0].required).toBeTruthy();
        });
        it('has required offset unit field component', () => {
            const offsetUnitAndDirectionComponent = element.shadowRoot.querySelectorAll(
                selectors.offsetUnitAndDirection
            );
            expect(offsetUnitAndDirectionComponent).toHaveLength(1);
            expect(offsetUnitAndDirectionComponent[0].value).toBe(scheduledPathMock.offsetUnit.value);
            expect(offsetUnitAndDirectionComponent[0].required).toBeTruthy();
        });
        it('has batch size input component which is not required', () => {
            const batchSizeInputComponent = element.shadowRoot.querySelectorAll(selectors.batchSizeInput);
            expect(batchSizeInputComponent).toHaveLength(1);
            expect(batchSizeInputComponent[0].value).toBe(scheduledPathMock.maxBatchSize.value);
            expect(batchSizeInputComponent[0].required).toBeFalsy();
        });
    });

    describe('handle scheduled path property change', () => {
        let eventCallback;
        beforeEach(() => {
            eventCallback = jest.fn();
            element.addEventListener(PropertyChangedEvent.EVENT_NAME, eventCallback);
        });
        it('fires the property changed event when time source is changed', () => {
            expect.assertions(2);
            const timeSourceComboBox = element.shadowRoot.querySelector(selectors.timeSource);
            timeSourceComboBox.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: 'CreatedDate'
                    }
                })
            );
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    guid: 'some guid',
                    propertyName: 'timeSource',
                    value: 'CreatedDate',
                    error: null
                }
            });
        });
        it('fires the property changed event when offset unit is changed', () => {
            expect.assertions(2);
            const offsetUnitComboBox = element.shadowRoot.querySelector(selectors.offsetUnitAndDirection);
            offsetUnitComboBox.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        value: TIME_OPTION.DAYS_AFTER
                    }
                })
            );
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    guid: 'some guid',
                    propertyName: 'offsetUnit',
                    value: 'DaysAfter',
                    error: null
                }
            });
        });
        it('fires the property changed event when offset number is changed', () => {
            expect.assertions(2);
            const offsetNumberInput = element.shadowRoot.querySelector(selectors.offsetNumber);
            offsetNumberInput.dispatchEvent(new CustomEvent('focusout'));
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    guid: 'some guid',
                    propertyName: 'offsetNumber',
                    error: null
                }
            });
        });
        it('fires the property changed event when batch size number is changed', () => {
            expect.assertions(2);
            const batchSizeInputComponent = element.shadowRoot.querySelector(selectors.batchSizeInput);
            batchSizeInputComponent.dispatchEvent(new CustomEvent('focusout'));
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    guid: 'some guid',
                    propertyName: 'maxBatchSize',
                    error: null
                }
            });
        });
    });

    describe('handleDelete', () => {
        it('fires deleteScheduledPathEvent with scheduled path guid', async () => {
            expect.assertions(1);
            const eventCallback = jest.fn();
            element.addEventListener(DeleteScheduledPathEvent.EVENT_NAME, eventCallback);
            const removeButton = element.shadowRoot.querySelector(selectors.deletePathButton);
            removeButton.click();
            await ticks(1);
            expect(eventCallback).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: { guid: element.scheduledPath.guid }
                })
            );
        });
    });
});
