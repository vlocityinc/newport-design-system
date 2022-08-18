import { CONDITION_LOGIC, RECORD_UPDATE_WAY_TO_FIND_RECORDS } from 'builder_platform_interaction/flowMetadata';

export const mockNewTriggeringRecordUpdateElement = {
    guid: '574474cf-2e90-43e4-8f04-95a03e87dd8d',
    name: {
        value: '',
        error: null
    },
    description: {
        value: '',
        error: null
    },
    label: {
        value: '',
        error: null
    },
    locationX: 444,
    locationY: 63.3125,
    isCanvasElement: true,
    connectorCount: 0,
    config: {
        isSelected: false,
        isHighlighted: false,
        isSelectable: true
    },
    elementSubtype: {
        value: null,
        error: null
    },
    inputReference: {
        value: '',
        error: null
    },
    inputReferenceIndex: {
        value: '8fd8d550-7478-4411-93ab-3c844fb93cfc',
        error: null
    },
    maxConnections: 2,
    availableConnections: [
        {
            type: 'REGULAR'
        },
        {
            type: 'FAULT'
        }
    ],
    elementType: 'RecordUpdate',
    inputAssignments: [],
    filters: [],
    filterLogic: {
        value: CONDITION_LOGIC.NO_CONDITIONS,
        error: null
    },
    object: {
        value: '',
        error: null
    },
    objectIndex: {
        value: '0d5629a2-48b2-4ea0-9603-a7a43e0a0ca6',
        error: null
    },
    wayToFindRecords: {
        value: RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD,
        error: null
    }
};
