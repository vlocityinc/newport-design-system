// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElementWithFault,
    baseCanvasElementsArrayToMap,
    createPastedCanvasElement,
    duplicateCanvasElement,
    createAvailableConnection,
    automaticOutputHandlingSupport,
    INCOMPLETE_ELEMENT
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import { createConnectorObjects } from './connector';
import { removeFromAvailableConnections } from 'builder_platform_interaction/connectorUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

import {
    createFlowInputFieldAssignmentMetadataObject,
    createFlowInputFieldAssignment,
    getDefaultAvailableConnections,
    createEmptyAssignmentMetadata
} from './base/baseRecordElement';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { getVariableOrField } from 'builder_platform_interaction/referenceToVariableUtil';

const elementType = ELEMENT_TYPE.RECORD_CREATE;
const maxConnections = 2;

/**
 * @param recordCreate
 * @param root0
 * @param root0.elements
 */
export function createRecordCreate(recordCreate = {}, { elements } = Store.getStore().getCurrentState()) {
    const newRecordCreate = baseCanvasElementWithFault(recordCreate);
    const {
        inputReference = '',
        inputReferenceIndex = generateGuid(),
        object = '',
        objectIndex = generateGuid(),
        assignRecordIdToReference = '',
        assignRecordIdToReferenceIndex = generateGuid(),
        storeOutputAutomatically
    } = recordCreate;
    let { inputAssignments = [], availableConnections = getDefaultAvailableConnections() } = recordCreate;
    availableConnections = availableConnections.map((availableConnection) =>
        createAvailableConnection(availableConnection)
    );

    let getFirstRecordOnly = true;
    const dataType = storeOutputAutomatically ? FLOW_DATA_TYPE.STRING.value : FLOW_DATA_TYPE.BOOLEAN.value;

    let recordCreateObject;
    if (object) {
        inputAssignments = inputAssignments.map((item) => createFlowInputFieldAssignment(item, object));

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
            dataType,
            storeOutputAutomatically
        });
    } else {
        let complete = true;
        if (inputReference) {
            // When the flow is loaded, this factory is called twice. In the first phase, elements is empty. In the second phase, elements contain variables and
            // we can calculate getFirstRecordOnly
            const variableOrField = getVariableOrField(inputReference, elements);
            if (variableOrField) {
                getFirstRecordOnly = !variableOrField.isCollection;
            } else {
                complete = false;
            }
        }

        recordCreateObject = Object.assign(
            newRecordCreate,
            {
                object,
                objectIndex,
                getFirstRecordOnly,
                inputReference,
                inputReferenceIndex,
                availableConnections,
                maxConnections,
                elementType,
                assignRecordIdToReferenceIndex,
                dataType
            },
            complete ? {} : { [INCOMPLETE_ELEMENT]: true }
        );
    }

    return recordCreateObject;
}

/**
 * @param root0
 * @param root0.canvasElementToPaste
 * @param root0.newGuid
 * @param root0.newName
 * @param root0.canvasElementGuidMap
 * @param root0.topCutOrCopiedGuid
 * @param root0.bottomCutOrCopiedGuid
 * @param root0.prev
 * @param root0.next
 * @param root0.parent
 * @param root0.childIndex
 * @param root0.source
 */
export function createPastedRecordCreate({
    canvasElementToPaste,
    newGuid,
    newName,
    canvasElementGuidMap,
    topCutOrCopiedGuid,
    bottomCutOrCopiedGuid,
    source,
    next
}) {
    const { duplicatedElement } = createDuplicateRecordCreate(canvasElementToPaste, newGuid, newName);

    const pastedCanvasElement = createPastedCanvasElement(
        duplicatedElement,
        canvasElementGuidMap,
        topCutOrCopiedGuid,
        bottomCutOrCopiedGuid,
        source,
        next
    );

    return {
        pastedCanvasElement
    };
}

/**
 * @param recordCreate
 * @param newGuid
 * @param newName
 */
export function createDuplicateRecordCreate(recordCreate, newGuid, newName) {
    const newRecordCreate = createRecordCreate(recordCreate);
    Object.assign(newRecordCreate, {
        availableConnections: getDefaultAvailableConnections()
    });
    const duplicateRecordCreate = duplicateCanvasElement(newRecordCreate, newGuid, newName);

    return duplicateRecordCreate;
}

/**
 * @param recordCreate
 * @param root0
 * @param root0.elements
 */
export function createRecordCreateWithConnectors(recordCreate, { elements } = Store.getStore().getCurrentState()) {
    const newRecordCreate = createRecordCreate(recordCreate, { elements });

    const connectors = createConnectorObjects(recordCreate, newRecordCreate.guid);
    const defaultAvailableConnections = getDefaultAvailableConnections();
    const availableConnections = removeFromAvailableConnections(defaultAvailableConnections, connectors);
    const connectorCount = connectors ? connectors.length : 0;

    const recordCreateObject = Object.assign(newRecordCreate, {
        availableConnections,
        connectorCount
    });

    return baseCanvasElementsArrayToMap([recordCreateObject], connectors);
}

/**
 * @param recordCreate
 * @param config
 */
export function createRecordCreateMetadataObject(recordCreate, config) {
    if (!recordCreate) {
        throw new Error('recordCreate is not defined');
    }

    const recordCreateMetadata = baseCanvasElementMetadataObject(recordCreate, config);
    let { storeOutputAutomatically } = recordCreate;
    const { inputReference, object, getFirstRecordOnly } = recordCreate;

    if (getFirstRecordOnly && recordCreate.object !== '') {
        const { assignRecordIdToReference } = recordCreate;
        let { inputAssignments = [] } = recordCreate;
        inputAssignments = inputAssignments.map((input) => createFlowInputFieldAssignmentMetadataObject(input));

        inputAssignments = createEmptyAssignmentMetadata(inputAssignments);

        if (!automaticOutputHandlingSupport()) {
            // automaticOutputHandlingSupport To be able to save the flow if the user change the process type on the save as.
            storeOutputAutomatically = undefined;
        }

        const newRecordCreateMetadata = Object.assign(
            recordCreateMetadata,
            {
                object,
                inputAssignments
            },
            storeOutputAutomatically !== undefined ? { storeOutputAutomatically } : {}
        );
        if (assignRecordIdToReference !== '') {
            newRecordCreateMetadata.assignRecordIdToReference = assignRecordIdToReference;
        }
        return newRecordCreateMetadata;
    }
    return Object.assign(recordCreateMetadata, {
        inputReference
    });
}
