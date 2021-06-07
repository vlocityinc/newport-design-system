// @ts-nocheck
import { ELEMENT_TYPE, FOOTER_LABEL_TYPE, PAUSE_MESSAGE_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElement,
    createPastedCanvasElement,
    duplicateCanvasElementWithChildElements,
    baseCanvasElementsArrayToMap
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import {
    createDuplicateNestedScreenFields,
    createScreenFieldWithFields,
    createScreenFieldWithFieldReferences,
    createScreenFieldMetadataObject
} from './screenField';
import { createConnectorObjects } from './connector';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { isRegionContainerField } from 'builder_platform_interaction/screenEditorUtils';

const elementType = ELEMENT_TYPE.SCREEN;
const maxConnections = 1;

/**
 * Called when opening a property editor or copying a screen element
 * @param {screenInStore} screen
 * @return {screenInPropertyEditor} Screen in the shape expected by a property editor
 */
export function createScreenWithFields(screen = {}) {
    const newScreen = createScreenElement(screen);
    const { childReferences = [] } = screen;

    let { fields = [] } = screen;

    for (let i = 0; i < childReferences.length; i++) {
        const childReference = childReferences[i];
        const field = getElementByGuid(childReference.childReference);
        const newScreenField = createScreenFieldWithFields(field);
        fields = [...fields, newScreenField];
    }

    return Object.assign(newScreen, {
        fields,
        maxConnections,
        elementType
    });
}

/**
 * Function to create the pasted Screen element
 *
 * @param {Object} dataForPasting - Data required to create the pasted element
 */
export function createPastedScreen({
    canvasElementToPaste,
    newGuid,
    newName,
    canvasElementGuidMap,
    childElementGuidMap,
    childElementNameMap,
    cutOrCopiedChildElements,
    topCutOrCopiedGuid,
    bottomCutOrCopiedGuid,
    prev,
    next,
    parent,
    childIndex
}) {
    const { duplicatedElement, duplicatedChildElements } = createDuplicateScreen(
        canvasElementToPaste,
        newGuid,
        newName,
        childElementGuidMap,
        childElementNameMap,
        cutOrCopiedChildElements
    );

    const pastedCanvasElement = createPastedCanvasElement(
        duplicatedElement,
        canvasElementGuidMap,
        topCutOrCopiedGuid,
        bottomCutOrCopiedGuid,
        prev,
        next,
        parent,
        childIndex
    );

    return {
        pastedCanvasElement,
        pastedChildElements: duplicatedChildElements
    };
}

/**
 * Function to create the duplicate Screen element
 *
 * @param {Object} screen - Screen element being copied
 * @param {String} newGuid - Guid for the new duplicated screen element
 * @param {String} newName - Name for the new duplicated screen element
 * @param {Object} childElementGuidMap - Map of child element guids to newly generated guids that will be used for
 * the duplicated child elements
 * @param {Object} childElementNameMap - Map of child element names to newly generated unique names that will be used for
 * the duplicated child elements
 * @param {Object} cutOrCopiedChildElements - Local copy of the cut ot copied canvas elements. Undefined in the case of duplication on Free Form Canvas
 * @return {Object} Returns an object containing the duplicated element and the duplicated childElements
 */
export function createDuplicateScreen(
    screen,
    newGuid,
    newName,
    childElementGuidMap,
    childElementNameMap,
    cutOrCopiedChildElements
) {
    const duplicateScreen = createScreenElement(screen);
    const {
        duplicatedElement,
        duplicatedChildElements,
        updatedChildReferences
    } = duplicateCanvasElementWithChildElements(
        screen,
        newGuid,
        newName,
        childElementGuidMap,
        childElementNameMap,
        cutOrCopiedChildElements,
        createDuplicateNestedScreenFields
    );

    const updatedDuplicatedElement = Object.assign(duplicateScreen, duplicatedElement, {
        childReferences: updatedChildReferences
    });

    return {
        duplicatedElement: updatedDuplicatedElement,
        duplicatedChildElements
    };
}

/**
 * Given a screen element in a property editor, create a screen element in the shape expected by the store
 * @param {screen} screen - screen in the shape of the property editor
 * @return {
 *   {
 *     screen: screen,
 *     deletedFields: screenField[] , fields: Array, elementType: string}
 * }
 */
export function createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor(screen) {
    const newScreen = createScreenElement(screen);
    const { fields } = screen;

    let childReferences = [],
        newFields = [],
        regionContainerCount = 0;

    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        if (isRegionContainerField(field)) {
            regionContainerCount++;
        }
        const newField = createScreenFieldWithFieldReferences(field, newFields, newScreen.name, regionContainerCount);
        childReferences = updateScreenFieldReferences(childReferences, newField);
        newFields = [...newFields, newField];
    }

    if (newScreen.nextOrFinishLabelType !== FOOTER_LABEL_TYPE.CUSTOM) {
        newScreen.nextOrFinishLabel = null;
    }
    if (newScreen.pauseLabelType !== FOOTER_LABEL_TYPE.CUSTOM) {
        newScreen.pauseLabel = null;
    }
    if (newScreen.backLabelType !== FOOTER_LABEL_TYPE.CUSTOM) {
        newScreen.backLabel = null;
    }

    if (
        newScreen.pauseLabelType === FOOTER_LABEL_TYPE.HIDE ||
        newScreen.pauseMessageType === PAUSE_MESSAGE_TYPE.STANDARD
    ) {
        newScreen.pausedText = '';
        newScreen.pauseMessageType = PAUSE_MESSAGE_TYPE.STANDARD;
    }
    if (!newScreen.allowHelp) {
        newScreen.helpText = '';
    }

    const deletedFields = getDeletedScreenFieldsUsingStore(screen, newFields);
    Object.assign(newScreen, {
        childReferences,
        elementType,
        maxConnections
    });
    return {
        screen: newScreen,
        deletedFields,
        fields: newFields,
        elementType: ELEMENT_TYPE.SCREEN_WITH_MODIFIED_AND_DELETED_SCREEN_FIELDS
    };
}

/**
 * Create a screen in the shape of the store (with field references).  This is used when taking a flow element and
 * converting it for use in the store
 * @param {Object} screen - screen from metadata
 * @return {screenInStore} screen in the shape used by the store
 */
export function createScreenWithFieldReferences(screen = {}) {
    const newScreen = createScreenElement(screen);
    const { fields = [], nextOrFinishLabel, allowFinish, backLabel, allowBack, pauseLabel, allowPause } = screen;
    const nextOrFinishLabelType = allowFinish
        ? nextOrFinishLabel
            ? FOOTER_LABEL_TYPE.CUSTOM
            : FOOTER_LABEL_TYPE.STANDARD
        : FOOTER_LABEL_TYPE.HIDE;
    const backLabelType = allowBack
        ? backLabel
            ? FOOTER_LABEL_TYPE.CUSTOM
            : FOOTER_LABEL_TYPE.STANDARD
        : FOOTER_LABEL_TYPE.HIDE;
    const pauseLabelType = allowPause
        ? pauseLabel
            ? FOOTER_LABEL_TYPE.CUSTOM
            : FOOTER_LABEL_TYPE.STANDARD
        : FOOTER_LABEL_TYPE.HIDE;

    const allowHelp = !!newScreen.helpText;
    const pauseMessageType = newScreen.pausedText ? PAUSE_MESSAGE_TYPE.CUSTOM : PAUSE_MESSAGE_TYPE.STANDARD;

    const connectors = createConnectorObjects(screen, newScreen.guid);
    const connectorCount = connectors ? connectors.length : 0;

    let screenFields = [],
        childReferences = [],
        regionContainerCount = 0;

    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        if (isRegionContainerField(field)) {
            regionContainerCount++;
        }
        const screenField = createScreenFieldWithFieldReferences(
            field,
            screenFields,
            newScreen.name,
            regionContainerCount
        );

        screenFields = [...screenFields, screenField];
        // updating childReferences
        childReferences = updateScreenFieldReferences(childReferences, screenField);
    }

    Object.assign(newScreen, {
        childReferences,
        elementType,
        connectorCount,
        maxConnections,
        allowHelp,
        pauseMessageType,
        nextOrFinishLabel,
        nextOrFinishLabelType,
        backLabel,
        backLabelType,
        pauseLabel,
        pauseLabelType
    });

    return baseCanvasElementsArrayToMap([newScreen, ...screenFields], connectors);
}

/**
 * Create a screen in the shape needed by the flow metadata
 * @param {screenInStore} screen - screen from the store
 * @param {Object} config - configuration for converting screen
 * @return {Object} screen in the shape for the metadata
 */
export function createScreenMetadataObject(screen, config = {}) {
    if (!screen) {
        throw new Error('screen is not defined');
    }

    const newScreen = baseCanvasElementMetadataObject(screen, config);

    // Flow MD does not allow for pausedText if allowPause is false
    if (!newScreen.allowPause) {
        newScreen.pausedText = '';
    }

    const {
        helpText,
        pausedText,
        showFooter,
        showHeader,
        nextOrFinishLabelType,
        pauseLabelType,
        backLabelType
    } = screen;
    let { nextOrFinishLabel, pauseLabel, backLabel } = screen;
    const allowFinish = nextOrFinishLabelType !== FOOTER_LABEL_TYPE.HIDE;
    nextOrFinishLabel =
        nextOrFinishLabelType === FOOTER_LABEL_TYPE.CUSTOM && nextOrFinishLabel ? nextOrFinishLabel : null;
    const allowPause = pauseLabelType !== FOOTER_LABEL_TYPE.HIDE;
    pauseLabel = pauseLabelType === FOOTER_LABEL_TYPE.CUSTOM && pauseLabel ? pauseLabel : null;
    const allowBack = backLabelType !== FOOTER_LABEL_TYPE.HIDE;
    backLabel = backLabelType === FOOTER_LABEL_TYPE.CUSTOM && backLabel ? backLabel : null;

    let { fields = [] } = screen;
    const { childReferences } = screen;
    if (childReferences && childReferences.length > 0) {
        fields = childReferences.map((childReference) => {
            return createScreenFieldMetadataObject(getElementByGuid(childReference.childReference));
        });
    }

    return Object.assign(newScreen, {
        fields,
        allowBack,
        allowFinish,
        allowPause,
        helpText,
        pausedText,
        showFooter,
        showHeader,
        nextOrFinishLabel,
        pauseLabel,
        backLabel
    });
}

export function createScreenElement(screen) {
    const newScreen = baseCanvasElement(screen);
    // todo: remove setting allowBack, allowFinish, and allowPause when they are not read in the screen, commit with work item W-9142894(Update Screen Canvas View)
    const {
        allowBack = true,
        allowFinish = true,
        allowPause = true,
        allowHelp = false,
        pauseMessageType = PAUSE_MESSAGE_TYPE.STANDARD,
        helpText = '',
        pausedText = '',
        showFooter = true,
        showHeader = true,
        nextOrFinishLabel = null,
        nextOrFinishLabelType = FOOTER_LABEL_TYPE.STANDARD,
        backLabel = null,
        backLabelType = FOOTER_LABEL_TYPE.STANDARD,
        pauseLabel = null,
        pauseLabelType = FOOTER_LABEL_TYPE.STANDARD
    } = screen;

    const getFieldByGUID = function (guid) {
        return this.findFieldByGUID(this.fields, guid);
    };

    const findFieldByGUID = function (fields = [], guid) {
        let foundField = fields.find((field) => {
            return field.guid === guid;
        });
        if (foundField) {
            return foundField;
        }
        for (const field of fields) {
            if (field.fields) {
                foundField = this.findFieldByGUID(field.fields, guid);
                if (foundField) {
                    return foundField;
                }
            }
        }
        return undefined;
    };

    // Returns an array containing a series of indexes that indicate where in the screen's
    // tree of fields a particular field is located. The first item in the array is the
    // index indicating the position of the field with the provided guid within its parent's
    // fields array. The next item is the position of the parent in the grandparent's fields
    // array, etc. etc.
    const getFieldIndexesByGUID = function (guid) {
        const indexes = this.findFieldIndexByGUID(this.fields, guid);
        return indexes || -1;
    };

    const findFieldIndexByGUID = function (fields = [], guid) {
        let foundIndex = fields.findIndex((field) => {
            return field.guid === guid;
        });
        if (foundIndex >= 0) {
            return [foundIndex];
        }
        for (let i = 0; i < fields.length; i++) {
            if (fields[i].fields) {
                foundIndex = this.findFieldIndexByGUID(fields[i].fields, guid);
                if (foundIndex) {
                    return foundIndex.concat(i);
                }
            }
        }
        return undefined;
    };

    const screenObject = Object.assign(newScreen, {
        allowBack,
        allowFinish,
        allowPause,
        allowHelp,
        pauseMessageType,
        helpText,
        pausedText,
        showFooter,
        showHeader,
        getFieldByGUID,
        getFieldIndexesByGUID,
        findFieldByGUID,
        findFieldIndexByGUID,
        nextOrFinishLabel,
        nextOrFinishLabelType,
        backLabel,
        backLabelType,
        pauseLabel,
        pauseLabelType
    });

    return screenObject;
}

/**
 * Helper function to get all the associated screen field references from the store
 * @param {Object} parentElementFromStore - screen or screen field object in the store
 */
function getAssociatedScreenFieldReferencesFromStore(parentElementFromStore) {
    const screenFieldReferencesFromStore = [];
    if (parentElementFromStore.childReferences) {
        for (let i = 0; i < parentElementFromStore.childReferences.length; i++) {
            screenFieldReferencesFromStore.push(parentElementFromStore.childReferences[i].childReference);
            screenFieldReferencesFromStore.push(
                ...getAssociatedScreenFieldReferencesFromStore(
                    getElementByGuid(parentElementFromStore.childReferences[i].childReference)
                )
            );
        }
    }

    return screenFieldReferencesFromStore;
}

function getDeletedScreenFieldsUsingStore(originalScreen, newFields = []) {
    if (!originalScreen) {
        throw new Error('Either screen or newFields is not defined');
    }
    const { guid } = originalScreen;
    const screenFromStore = getElementByGuid(guid);
    let screenFieldReferencesFromStore;
    if (screenFromStore) {
        screenFieldReferencesFromStore = getAssociatedScreenFieldReferencesFromStore(screenFromStore);
    }
    if (screenFieldReferencesFromStore) {
        const newfieldGuids = newFields.map((newField) => newField.guid);
        return screenFieldReferencesFromStore
            .filter((fieldReferenceGuid) => {
                return !newfieldGuids.includes(fieldReferenceGuid);
            })
            .map((childReference) => getElementByGuid(childReference));
    }
    return [];
}

function updateScreenFieldReferences(childReferences = [], field) {
    if (!field || !field.guid) {
        throw new Error('Either field or field.guid is not defined');
    }
    return [
        ...childReferences,
        {
            childReference: field.guid
        }
    ];
}
