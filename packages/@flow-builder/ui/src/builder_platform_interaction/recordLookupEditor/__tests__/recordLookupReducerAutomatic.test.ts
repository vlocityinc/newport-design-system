// @ts-nocheck
import { createElement } from 'lwc';
import RecordLookupEditor from '../recordLookupEditor';
import { recordLookupReducer } from '../recordLookupReducer';
import {
    EditElementEvent,
    PropertyChangedEvent,
    VariableAndFieldMappingChangedEvent,
    UpdateRecordLookupFieldEvent
} from 'builder_platform_interaction/events';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { lookupRecordAutomaticOutput } from 'mock/storeData';
import { VARIABLE_AND_FIELD_MAPPING_VALUES } from 'builder_platform_interaction/recordEditorLib';

const mockGuid = 'mockGuid';

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/fieldPicker', () => require('builder_platform_interaction_mocks/fieldPicker'));

jest.mock('builder_platform_interaction/storeLib', () => {
    const getCurrentState = function () {
        return {
            properties: {
                processType: 'flow'
            },
            elements: {}
        };
    };
    const getStore = function () {
        return {
            getCurrentState
        };
    };

    const storeLib = require('builder_platform_interaction_mocks/storeLib');

    return Object.assign({}, storeLib, {
        Store: {
            getStore
        }
    });
});

function createComponentForTest(node, mode = EditElementEvent.EVENT_NAME, processType = 'Flow') {
    const el = createElement('builder_platform_interaction-record-lookup-editor', { is: RecordLookupEditor });
    Object.assign(el, { node, processType, mode });
    document.body.appendChild(el);
    return el;
}

jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/processTypeLib');
    const FLOW_AUTOMATIC_OUTPUT_HANDLING = actual.FLOW_AUTOMATIC_OUTPUT_HANDLING;
    return {
        FLOW_AUTOMATIC_OUTPUT_HANDLING,
        getProcessTypeAutomaticOutPutHandlingSupport: jest
            .fn()
            .mockReturnValue(FLOW_AUTOMATIC_OUTPUT_HANDLING.SUPPORTED)
    };
});

describe('record-lookup-reducerAutomatic Mode', () => {
    let recordLookupEditor, recordLookupNode, newState;
    const storeLib = require('builder_platform_interaction/storeLib');
    storeLib.generateGuid = jest.fn().mockReturnValue(mockGuid);
    beforeAll(() => {
        recordLookupNode = getElementForPropertyEditor(lookupRecordAutomaticOutput);
        recordLookupEditor = createComponentForTest(recordLookupNode, EditElementEvent.EVENT_NAME);
    });
    describe('handle property object changed event', () => {
        beforeEach(() => {
            const event = {
                type: PropertyChangedEvent.EVENT_NAME,
                detail: {
                    propertyName: 'object',
                    value: 'Account History'
                }
            };
            newState = recordLookupReducer(recordLookupEditor.node, event);
        });
        it('not change', () => {
            expect(newState.queriedFields).toBeNull();
        });
    });
    describe('handle property variableAndFieldMapping changed event', () => {
        describe('From automatic to automatic with fields', () => {
            beforeEach(() => {
                const event = {
                    type: VariableAndFieldMappingChangedEvent.EVENT_NAME,
                    detail: {
                        variableAndFieldMapping: VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC_WITH_FIELDS
                    }
                };
                newState = recordLookupReducer(recordLookupEditor.node, event);
            });
            it('it reset the queriedFields to an array with 2 values Id and empty', () => {
                expect(newState.queriedFields).toMatchObject([
                    { field: { error: null, value: 'Id' }, rowIndex: mockGuid },
                    { field: { error: null, value: '' }, rowIndex: mockGuid }
                ]);
            });
            it('storeOutputAutomatically should be true', () => {
                expect(newState.storeOutputAutomatically).toBe(true);
            });
            describe('From automatic with fields to automatic', () => {
                let stateAutoWithFieldsToAuto;
                beforeEach(() => {
                    const event = {
                        type: VariableAndFieldMappingChangedEvent.EVENT_NAME,
                        detail: {
                            variableAndFieldMapping: VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC
                        }
                    };
                    stateAutoWithFieldsToAuto = recordLookupReducer(newState, event);
                });
                it('it reset the queriedFields to null', () => {
                    expect(stateAutoWithFieldsToAuto.queriedFields).toBeNull();
                });
                it('storeOutputAutomatically should be true', () => {
                    expect(stateAutoWithFieldsToAuto.storeOutputAutomatically).toBe(true);
                });
            });
            describe('From automatic with fields to manual', () => {
                let stateAutoWithFieldsToManual;
                beforeEach(() => {
                    // 1nd update the new Field
                    const eventUpdateField = {
                        type: UpdateRecordLookupFieldEvent.EVENT_NAME,
                        detail: {
                            value: 'billingCity',
                            error: null,
                            index: 1
                        }
                    };
                    stateAutoWithFieldsToManual = recordLookupReducer(newState, eventUpdateField);
                    // 2nd change the VariableAndFieldMapping to manual
                    const event = {
                        type: VariableAndFieldMappingChangedEvent.EVENT_NAME,
                        detail: {
                            variableAndFieldMapping: VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL
                        }
                    };
                    stateAutoWithFieldsToManual = recordLookupReducer(stateAutoWithFieldsToManual, event);
                });
                it('it should not reset the queriedFields to null', () => {
                    expect(stateAutoWithFieldsToManual.queriedFields).toMatchObject([
                        {
                            field: { error: null, value: 'Id' },
                            rowIndex: mockGuid
                        },
                        {
                            field: { error: null, value: 'billingCity' },
                            rowIndex: mockGuid
                        }
                    ]);
                });
                it('storeOutputAutomatically should be false', () => {
                    expect(stateAutoWithFieldsToManual.storeOutputAutomatically).toBe(false);
                });
            });
        });
        describe('From automatic to manual', () => {
            beforeEach(() => {
                const event = {
                    type: VariableAndFieldMappingChangedEvent.EVENT_NAME,
                    detail: {
                        variableAndFieldMapping: VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL
                    }
                };
                newState = recordLookupReducer(recordLookupEditor.node, event);
            });
            it('it reset the queriedFields to an array with 2 values Id and empty', () => {
                expect(newState.queriedFields).toMatchObject([
                    { field: { error: null, value: 'Id' }, rowIndex: mockGuid },
                    { field: { error: null, value: '' }, rowIndex: mockGuid }
                ]);
            });
            it('storeOutputAutomatically should be false', () => {
                expect(newState.storeOutputAutomatically).toBe(false);
            });
            describe('From manual to automatic with fields', () => {
                let stateManualToAutoWithFields;
                beforeEach(() => {
                    // 1nd update the new Field
                    const eventUpdateField = {
                        type: UpdateRecordLookupFieldEvent.EVENT_NAME,
                        detail: {
                            value: 'billingCity',
                            error: null,
                            index: 1
                        }
                    };
                    stateManualToAutoWithFields = recordLookupReducer(newState, eventUpdateField);
                    // 2nd change the VariableAndFieldMapping to automatic with fields
                    const event = {
                        type: VariableAndFieldMappingChangedEvent.EVENT_NAME,
                        detail: {
                            variableAndFieldMapping: VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC_WITH_FIELDS
                        }
                    };
                    stateManualToAutoWithFields = recordLookupReducer(stateManualToAutoWithFields, event);
                });
                it('it should not reset the queriedFields to null', () => {
                    expect(stateManualToAutoWithFields.queriedFields).toMatchObject([
                        {
                            field: { error: null, value: 'Id' },
                            rowIndex: mockGuid
                        },
                        {
                            field: { error: null, value: 'billingCity' },
                            rowIndex: mockGuid
                        }
                    ]);
                });
                it('storeOutputAutomatically should be true', () => {
                    expect(stateManualToAutoWithFields.storeOutputAutomatically).toBe(true);
                });
            });
            describe('From manual to automatic', () => {
                let stateManualToAuto;
                beforeEach(() => {
                    const event = {
                        type: VariableAndFieldMappingChangedEvent.EVENT_NAME,
                        detail: {
                            variableAndFieldMapping: VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC
                        }
                    };
                    stateManualToAuto = recordLookupReducer(newState, event);
                });
                it('it reset the queriedFields to null', () => {
                    expect(stateManualToAuto.queriedFields).toBeNull();
                });
                it('storeOutputAutomatically should be true', () => {
                    expect(stateManualToAuto.storeOutputAutomatically).toBe(true);
                });
            });
        });
    });
});
