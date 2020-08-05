// @ts-nocheck
import { createElement } from 'lwc';
import { invokeModal } from 'builder_platform_interaction/builderUtils';
import RecordLookupVariableAndFieldMapping from '../recordLookupVariableAndFieldMapping';
import { LABELS } from '../recordLookupVariableAndFieldMappingLabels';
import { VARIABLE_AND_FIELD_MAPPING_VALUES } from 'builder_platform_interaction/recordEditorLib';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

function createComponentForTest(variableAndFieldMapping) {
    const el = createElement('builder_platform_interaction-record-lookup-variable-and-field-mapping', {
        is: RecordLookupVariableAndFieldMapping
    });
    Object.assign(el, { variableAndFieldMapping });
    document.body.appendChild(el);
    return el;
}

jest.mock('builder_platform_interaction/builderUtils', () => {
    return {
        invokeModal: jest.fn()
    };
});

class OnChangeEvent extends CustomEvent {
    constructor(value) {
        super('change', { detail: { value } });
    }
}

const selectors = {
    lightningRadioGroup: 'lightning-radio-group'
};

const getRadioGroup = (variableAndFieldMappingElement) => {
    return variableAndFieldMappingElement.shadowRoot.querySelector(selectors.lightningRadioGroup);
};

describe('record-lookup-variable-and-field-mapping', () => {
    let variableAndFieldMappingElement;
    describe('Automatic with assign fields manually is selected', () => {
        beforeEach(() => {
            variableAndFieldMappingElement = createComponentForTest(
                VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC_WITH_FIELDS
            );
        });
        it('should display an alert when user select automatic', async () => {
            const variableAndFieldMappingRadioGroup = getRadioGroup(variableAndFieldMappingElement);
            variableAndFieldMappingRadioGroup.dispatchEvent(
                new OnChangeEvent(VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC)
            );
            await ticks(1);
            expect(invokeModal).toBeCalledWith({
                bodyData: {
                    bodyTextOne: LABELS.clearVariableConfirmation
                },
                footerData: {
                    buttonOne: {
                        buttonLabel: LABELS.cancelButton
                    },
                    buttonTwo: {
                        buttonCallback: expect.any(Function),
                        buttonLabel: LABELS.confirm,
                        buttonVariant: LABELS.confirm
                    }
                },
                headerData: {
                    headerTitle: LABELS.areYouSure
                }
            });
        });
        it('should not display an alert when the user select manual', async () => {
            const variableAndFieldMappingRadioGroup = getRadioGroup(variableAndFieldMappingElement);
            variableAndFieldMappingRadioGroup.dispatchEvent(
                new OnChangeEvent(VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL)
            );
            await ticks(1);
            expect(invokeModal).not.toHaveBeenCalled();
        });
    });
    describe('Manual is selected', () => {
        beforeEach(() => {
            variableAndFieldMappingElement = createComponentForTest(VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL);
        });
        it('should display an alert when the user select automatic', async () => {
            const variableAndFieldMappingRadioGroup = getRadioGroup(variableAndFieldMappingElement);
            variableAndFieldMappingRadioGroup.dispatchEvent(
                new OnChangeEvent(VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC)
            );
            await ticks(1);
            expect(invokeModal).toBeCalledWith({
                bodyData: {
                    bodyTextOne: LABELS.clearVariableConfirmation
                },
                footerData: {
                    buttonOne: {
                        buttonLabel: LABELS.cancelButton
                    },
                    buttonTwo: {
                        buttonCallback: expect.any(Function),
                        buttonLabel: LABELS.confirm,
                        buttonVariant: LABELS.confirm
                    }
                },
                headerData: {
                    headerTitle: LABELS.areYouSure
                }
            });
        });
        it('should not display an alert when user select automatic with fields', async () => {
            const variableAndFieldMappingRadioGroup = getRadioGroup(variableAndFieldMappingElement);
            variableAndFieldMappingRadioGroup.dispatchEvent(
                new OnChangeEvent(VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC_WITH_FIELDS)
            );
            await ticks(1);
            expect(invokeModal).not.toHaveBeenCalled();
        });
    });
    describe('Automatic is selected', () => {
        beforeEach(() => {
            variableAndFieldMappingElement = createComponentForTest(VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC);
        });
        it('should not display an alert when the user select manual', async () => {
            const variableAndFieldMappingRadioGroup = getRadioGroup(variableAndFieldMappingElement);
            variableAndFieldMappingRadioGroup.dispatchEvent(
                new OnChangeEvent(VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL)
            );
            await ticks(1);
            expect(invokeModal).not.toHaveBeenCalled();
        });
        it('should not display an alert when the user select automatic with fields', async () => {
            const variableAndFieldMappingRadioGroup = getRadioGroup(variableAndFieldMappingElement);
            variableAndFieldMappingRadioGroup.dispatchEvent(
                new OnChangeEvent(VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC_WITH_FIELDS)
            );
            await ticks(1);
            expect(invokeModal).not.toHaveBeenCalled();
        });
    });
});
