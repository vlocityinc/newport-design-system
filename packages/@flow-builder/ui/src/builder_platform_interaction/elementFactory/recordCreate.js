import {
    ELEMENT_TYPE
} from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap,
    duplicateCanvasElement,
    createAvailableConnection
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import { createConnectorObjects } from './connector';
import { removeFromAvailableConnections } from 'builder_platform_interaction/connectorUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

import { getGlobalConstantOrSystemVariable } from "builder_platform_interaction/systemLib";
import { getElementByGuid } from "builder_platform_interaction/storeUtils";
import { createFlowInputFieldAssignmentMetadataObject, createFlowInputFieldAssignment, getDefaultAvailableConnections, createEmptyAssignmentMetadata }  from "./base/baseRecordElement";
import { generateGuid } from 'builder_platform_interaction/storeLib';

const elementType = ELEMENT_TYPE.RECORD_CREATE;
const maxConnections = 2;

export function createRecordCreate(recordCreate = {}) {
    const newRecordCreate = baseCanvasElement(recordCreate);
    const { inputReference = '', inputReferenceIndex = generateGuid(), object = '', objectIndex = generateGuid(), assignRecordIdToReference = '', assignRecordIdToReferenceIndex = generateGuid() } = recordCreate;
    let { inputAssignments = [], availableConnections = getDefaultAvailableConnections()} = recordCreate;
    availableConnections = availableConnections.map(availableConnection => createAvailableConnection(availableConnection));

    let getFirstRecordOnly = true;

    let recordCreateObject;
    if (object) {
        inputAssignments = inputAssignments.map(item => createFlowInputFieldAssignment(item, object));

        recordCreateObject = Object.assign(newRecordCreate, {
            object,
            objectIndex,
            inputAssignments,
            getFirstRecordOnly,
            inputReference,
            inputReferenceIndex,
            availableConnections,
            maxConnections,
            elementType,
            assignRecordIdToReference,
            assignRecordIdToReferenceIndex,
            dataType: FLOW_DATA_TYPE.BOOLEAN.value,

        });
    } else {
        if (inputReference) {
            // When the builder is loaded the store does not yet contain the variables
            // getFirstRecordOnly can only be calculated at the opening on the element
            const variable  = getElementByGuid(inputReference) || getGlobalConstantOrSystemVariable(inputReference);
            if (variable) {
                getFirstRecordOnly = variable.dataType !== FLOW_DATA_TYPE.SOBJECT.value || !variable.isCollection;
            }
        }

        recordCreateObject = Object.assign(newRecordCreate, {
            object,
            objectIndex,
            getFirstRecordOnly,
            inputReference,
            inputReferenceIndex,
            availableConnections,
            maxConnections,
            elementType,
            assignRecordIdToReferenceIndex,
            dataType: FLOW_DATA_TYPE.BOOLEAN.value,
        });
    }

    return recordCreateObject;
}

export function createDuplicateRecordCreate(recordCreate, newGuid, newName) {
    const newRecordCreate = createRecordCreate(recordCreate);
    Object.assign(newRecordCreate, { availableConnections: getDefaultAvailableConnections() });
    const duplicateRecordCreate = duplicateCanvasElement(newRecordCreate, newGuid, newName);

    return duplicateRecordCreate;
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
    const { inputReference, object, getFirstRecordOnly } = recordCreate;

    if (getFirstRecordOnly && recordCreate.object !== '') {
        const {assignRecordIdToReference } = recordCreate;
        let { inputAssignments = [] } = recordCreate;
        inputAssignments = inputAssignments.map(input => createFlowInputFieldAssignmentMetadataObject(input));

        inputAssignments = createEmptyAssignmentMetadata(inputAssignments);

        const newRecordCreateMetadata = Object.assign(recordCreateMetadata, {
            object,
            inputAssignments,
        });
        if (assignRecordIdToReference !== '') {
            newRecordCreateMetadata.assignRecordIdToReference = assignRecordIdToReference;
        }
        return newRecordCreateMetadata;
    }
    return Object.assign(recordCreateMetadata, {
        inputReference
    });
}
