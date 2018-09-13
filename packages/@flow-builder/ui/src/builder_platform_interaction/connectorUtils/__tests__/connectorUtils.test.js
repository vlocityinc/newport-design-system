import {
    getFlowBounds,
    sortConnectorPickerComboboxOptions,
    getLabelAndValueForConnectorPickerOptions,
    createNewConnector
} from "builder_platform_interaction/connectorUtils";
import { ELEMENT_TYPE, CONNECTOR_TYPE } from "builder_platform_interaction/flowMetadata";
import { LABELS } from "../connectorUtilsLabels";

jest.mock('builder_platform_interaction/storeLib', () => {
    return {
        generateGuid: () => {
            return 'CONNECTOR_1';
        }
    };
});

describe('Connector Utils', () => {
    it('Gets min and max x,y coordinates and flow width and height of the flow on canvas', () => {
        const elements = [
            { locationX: 2, locationY: 101 },
            { locationX: -1, locationY: 100 },
            { locationX: 100, locationY: 2 }
        ];

        expect(
            getFlowBounds(elements)
        ).toEqual({ minX: -1, minY: 2, maxX: 100, maxY: 101, flowWidth: 149, flowHeight: 195 });
    });

    describe('Connector Picker', () => {
        it('Sorting options in connector picker for Loop Element', () => {
            const sourceElement = {
                elementType: ELEMENT_TYPE.LOOP
            };
            const comboboxOptions = [{
                label: LABELS.loopEndComboBoxOption,
                value: CONNECTOR_TYPE.LOOP_END
            }, {
                label: LABELS.loopNextComboBoxOption,
                value: CONNECTOR_TYPE.LOOP_NEXT
            }];

            const sortedOptions = sortConnectorPickerComboboxOptions(sourceElement, comboboxOptions);

            expect(sortedOptions).toEqual([{
                label: LABELS.loopNextComboBoxOption,
                value: CONNECTOR_TYPE.LOOP_NEXT
            }, {
                label: LABELS.loopEndComboBoxOption,
                value: CONNECTOR_TYPE.LOOP_END
            }]);
        });

        it('Sorting options in connector picker for Decision Element', () => {
            const sourceElement = {
                elementType: ELEMENT_TYPE.DECISION,
                outcomeReferences: [{outcomeReference: 'outcome1'}, {outcomeReference: 'outcome2'}],
            };
            const comboboxOptions = [{
                label: 'outcome 2',
                value: 'outcome2'
            }, {
                label: 'Default',
                value: CONNECTOR_TYPE.DEFAULT
            }, {
                label: 'outcome 1',
                value: 'outcome1'
            }];

            const sortedOptions = sortConnectorPickerComboboxOptions(sourceElement, comboboxOptions);

            expect(sortedOptions).toEqual([{
                label: 'outcome 1',
                value: 'outcome1'
            }, {
                label: 'outcome 2',
                value: 'outcome2'
            }, {
                label: 'Default',
                value: CONNECTOR_TYPE.DEFAULT
            }]);
        });

        it('Getting connector label and value for connector-picker combobox', () => {
            const elements = {
                'outcome_1': {
                    label: 'Outcome 1'
                }
            };
            const sourceElement = {
                defaultConnectorLabel: 'Default'
            };

            expect(getLabelAndValueForConnectorPickerOptions(elements, sourceElement, 'outcome_1', CONNECTOR_TYPE.REGULAR)).toEqual({
                label: 'Outcome 1',
                value: 'outcome_1'
            });
            expect(getLabelAndValueForConnectorPickerOptions(elements, sourceElement, null, CONNECTOR_TYPE.DEFAULT)).toEqual({
                label: 'Default',
                value: CONNECTOR_TYPE.DEFAULT
            });
            expect(getLabelAndValueForConnectorPickerOptions(elements, sourceElement, null, CONNECTOR_TYPE.FAULT)).toEqual({
                label: LABELS.faultConnectorLabel,
                value: CONNECTOR_TYPE.FAULT
            });
            expect(getLabelAndValueForConnectorPickerOptions(elements, sourceElement, null, CONNECTOR_TYPE.LOOP_NEXT)).toEqual({
                label: LABELS.loopNextComboBoxOption,
                value: CONNECTOR_TYPE.LOOP_NEXT
            });
            expect(getLabelAndValueForConnectorPickerOptions(elements, sourceElement, null, CONNECTOR_TYPE.LOOP_END)).toEqual({
                label: LABELS.loopEndComboBoxOption,
                value: CONNECTOR_TYPE.LOOP_END
            });
        });

        it('Creating new connector object from connector-picker combobox', () => {
            const elements = {
                'decision_1': {
                    defaultConnectorLabel: 'Default'
                },
                'outcome_1': {
                    label: 'Outcome 1'
                }
            };

            expect(createNewConnector(elements, 'start_1', 'assignment_1', CONNECTOR_TYPE.START)).toEqual({
                'guid': 'CONNECTOR_1',
                'source': 'start_1',
                'target': 'assignment_1',
                'type': CONNECTOR_TYPE.START,
                'label': null,
                'childSource': undefined,
                'config': {
                    'isSelected': false,
                }
            });
            expect(createNewConnector(elements, 'assignment_1', 'assignment_2', CONNECTOR_TYPE.REGULAR)).toEqual({
                'guid': 'CONNECTOR_1',
                'source': 'assignment_1',
                'target': 'assignment_2',
                'type': CONNECTOR_TYPE.REGULAR,
                'label': null,
                'childSource': undefined,
                'config': {
                    'isSelected': false,
                }
            });
            expect(createNewConnector(elements, 'decision_1', 'assignment_2', CONNECTOR_TYPE.DEFAULT)).toEqual({
                'guid': 'CONNECTOR_1',
                'source': 'decision_1',
                'target': 'assignment_2',
                'type': CONNECTOR_TYPE.DEFAULT,
                'label': 'Default',
                'childSource': undefined,
                'config': {
                    'isSelected': false,
                }
            });
            expect(createNewConnector(elements, 'action_1', 'assignment_1', CONNECTOR_TYPE.FAULT)).toEqual({
                'guid': 'CONNECTOR_1',
                'source': 'action_1',
                'target': 'assignment_1',
                'type': CONNECTOR_TYPE.FAULT,
                'label': LABELS.faultConnectorLabel,
                'childSource': undefined,
                'config': {
                    'isSelected': false,
                }
            });
            expect(createNewConnector(elements, 'loop_1', 'assignment_1', CONNECTOR_TYPE.LOOP_NEXT)).toEqual({
                'guid': 'CONNECTOR_1',
                'source': 'loop_1',
                'target': 'assignment_1',
                'type': CONNECTOR_TYPE.LOOP_NEXT,
                'label': LABELS.loopNextConnectorLabel,
                'childSource': undefined,
                'config': {
                    'isSelected': false,
                }
            });
            expect(createNewConnector(elements, 'loop_1', 'assignment_2', CONNECTOR_TYPE.LOOP_END)).toEqual({
                'guid': 'CONNECTOR_1',
                'source': 'loop_1',
                'target': 'assignment_2',
                'type': CONNECTOR_TYPE.LOOP_END,
                'label': LABELS.loopEndConnectorLabel,
                'childSource': undefined,
                'config': {
                    'isSelected': false,
                }
            });
            expect(createNewConnector(elements, 'decision_1', 'loop_1', 'outcome_1')).toEqual({
                'guid': 'CONNECTOR_1',
                'source': 'decision_1',
                'target': 'loop_1',
                'type': CONNECTOR_TYPE.REGULAR,
                'label': 'Outcome 1',
                'childSource': 'outcome_1',
                'config': {
                    'isSelected': false,
                }
            });
        });
    });
});