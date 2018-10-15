import {
    ELEMENT_TYPE
} from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap,
    createAvailableConnection
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import { createConnectorObjects } from './connector';
import { removeFromAvailableConnections } from 'builder_platform_interaction/connectorUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { NUMBER_RECORDS_TO_STORE } from "builder_platform_interaction/recordEditorLib";

import { getNonElementResource } from "builder_platform_interaction/systemLib";
import { getElementByGuid } from "builder_platform_interaction/storeUtils";
import { createFlowInputFieldAssignmentMetadataObject, createFlowInputFieldAssignment, getDefaultAvailableConnections }  from "./base/baseRecordElement";
import { createFEROV } from './ferov';

const elementType = ELEMENT_TYPE.RECORD_CREATE;
const maxConnections = 2;

export function createRecordCreate(recordCreate = {}) {
    const newRecordCreate = baseCanvasElement(recordCreate);
    const { inputReference = '', object = '' } = recordCreate;
    let { inputAssignments = [], availableConnections = getDefaultAvailableConnections(), assignRecordIdToReference = ''} = recordCreate;
    availableConnections = availableConnections.map(availableConnection => createAvailableConnection(availableConnection));

    let recordCreateObject = null;

    let numberRecordsToStore = NUMBER_RECORDS_TO_STORE.FIRST_RECORD;

    if (object) {
        inputAssignments = inputAssignments.map(item => createFlowInputFieldAssignment(item, object));

        if (assignRecordIdToReference && !assignRecordIdToReference.value) {
            assignRecordIdToReference = createFEROV({stringValue:assignRecordIdToReference},
                    'value', 'valueDataType');
        }
        recordCreateObject = Object.assign(newRecordCreate, {
            object,
            inputAssignments,
            numberRecordsToStore,
            availableConnections,
            maxConnections,
            elementType,
            assignRecordIdToReference,
            dataType: FLOW_DATA_TYPE.BOOLEAN.value,

        });
    } else {
        if (inputReference) {
         // When the builder is loaded the store does not yet contain the variables
            // numberRecordsToStore can only be calculated at the opening on the element
            const variable  = getElementByGuid(inputReference) || getNonElementResource(inputReference);
            if (variable) {
                numberRecordsToStore = variable.dataType === FLOW_DATA_TYPE.SOBJECT.value && variable.isCollection ? NUMBER_RECORDS_TO_STORE.ALL_RECORDS : NUMBER_RECORDS_TO_STORE.FIRST_RECORD;
            }
        }

        recordCreateObject = Object.assign(newRecordCreate, {
            object,
            numberRecordsToStore,
            inputReference,
            availableConnections,
            maxConnections,
            elementType,
            dataType: FLOW_DATA_TYPE.BOOLEAN.value,
        });
    }

    return recordCreateObject;
}

export function createRecordCreateWithConnectors(recordCreate) {
    const newRecordCreate = createRecordCreate(recordCreate);

    const connectors = createConnectorObjects(
        recordCreate,
        newRecordCreate.guid
    );
    const defaultAvailableConnections = getDefaultAvailableConnections();
    const availableConnections = removeFromAvailableConnections(defaultAvailableConnections, connectors);
    const connectorCount = connectors ? connectors.length : 0;

    const recordCreateObject = Object.assign(newRecordCreate, {
        availableConnections,
        connectorCount
    });

    return baseCanvasElementsArrayToMap([recordCreateObject], connectors);
}

export function createRecordCreateMetadataObject(recordCreate, config) {
    if (!recordCreate) {
        throw new Error('recordCreate is not defined');
    }

    const recordCreateMetadata = baseCanvasElementMetadataObject(recordCreate, config);
    const { inputReference, object, numberRecordsToStore } = recordCreate;

    if (numberRecordsToStore === NUMBER_RECORDS_TO_STORE.FIRST_RECORD && recordCreate.object !== '') {
        let { assignRecordIdToReference, inputAssignments = [] } = recordCreate;
        inputAssignments = inputAssignments.map(input => createFlowInputFieldAssignmentMetadataObject(input));

        assignRecordIdToReference = assignRecordIdToReference.value;
        return Object.assign(recordCreateMetadata, {
            object,
            inputAssignments,
            assignRecordIdToReference,
        });
    }

    return Object.assign(recordCreateMetadata, {
        inputReference
    });
}
