import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElement,
    duplicateCanvasElementWithChildElements,
    baseCanvasElementsArrayToMap
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import {
    createScreenField,
    createScreenFieldMetadataObject
} from './screenField';
import { createConnectorObjects } from './connector';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';

const elementType = ELEMENT_TYPE.SCREEN;
const maxConnections = 1;

const childReferenceKeys = {
    childReferencesKey: 'fieldReferences',
    childReferenceKey: 'fieldReference'
};

/**
 * Called when opening a property editor or copying a screen element
 * @param {screenInStore} screen
 * @return {screenInPropertyEditor} Screen in the shape expected by a property editor
 */
export function createScreenWithFields(screen = {}) {
    const newScreen = createScreenElement(screen);
    const { fieldReferences } = screen;

    let { fields = [] } = screen;

    if (fieldReferences && fieldReferences.length > 0) {
        // screen with field references
        // Decouple field from store.
        fields = fieldReferences.map(fieldReference =>
            createScreenField(getElementByGuid(fieldReference.fieldReference))
        );
    }

    return Object.assign(newScreen, {
        fields,
        maxConnections,
        elementType
    });
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
 * @return {Object} Returns an object containing the duplicated element and the duplicated childElements
 */
export function createDuplicateScreen(
    screen,
    newGuid,
    newName,
    childElementGuidMap,
    childElementNameMap
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
        createScreenField,
        childReferenceKeys.childReferencesKey,
        childReferenceKeys.childReferenceKey
    );

    const updatedDuplicatedElement = Object.assign(
        duplicateScreen,
        duplicatedElement,
        {
            [childReferenceKeys.childReferencesKey]: updatedChildReferences
        }
    );
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
export function createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor(
    screen
) {
    const newScreen = createScreenElement(screen);
    const { fields } = screen;

    let fieldReferences = [];
    let newFields = [];

    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const newField = createScreenField(field);
        fieldReferences = updateScreenFieldReferences(
            fieldReferences,
            newField
        );
        newFields = [...newFields, newField];
    }

    const deletedFields = getDeletedScreenFieldsUsingStore(screen, newFields);
    Object.assign(newScreen, {
        fieldReferences,
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
    const { fields = [] } = screen;
    const connectors = createConnectorObjects(screen, newScreen.guid);
    const connectorCount = connectors ? connectors.length : 0;

    let screenFields = [],
        fieldReferences = [];

    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const screenField = createScreenField(field);
        screenFields = [...screenFields, screenField];
        // updating fieldReferences
        fieldReferences = updateScreenFieldReferences(
            fieldReferences,
            screenField
        );
    }

    Object.assign(newScreen, {
        fieldReferences,
        elementType,
        connectorCount,
        maxConnections
    });

    return baseCanvasElementsArrayToMap(
        [newScreen, ...screenFields],
        connectors
    );
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
        allowBack,
        allowFinish,
        allowPause,
        helpText,
        pausedText,
        showFooter,
        showHeader
    } = screen;

    let { fields = [] } = screen;
    const { fieldReferences } = screen;
    if (fieldReferences && fieldReferences.length > 0) {
        fields = fieldReferences.map(fieldReference => {
            return createScreenFieldMetadataObject(
                getElementByGuid(fieldReference.fieldReference)
            );
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
        showHeader
    });
}

export function createScreenElement(screen) {
    const newScreen = baseCanvasElement(screen);
    const {
        allowBack = true,
        allowFinish = true,
        allowPause = true,
        helpText = '',
        pausedText = '',
        showFooter = true,
        showHeader = true
    } = screen;

    const getFieldIndex = function (field) {
        if (this.fields) {
            return this.fields.findIndex(sfield => {
                return sfield.guid === field.guid;
            });
        }
        return -1;
    };
    const getFieldByGUID = function (guid) {
        if (this.fields) {
            return this.fields.find(field => {
                return field.guid === guid;
            });
        }
        return undefined;
    };
    const getFieldIndexByGUID = function (guid) {
        if (this.fields) {
            return this.fields.findIndex(field => {
                return field.guid === guid;
            });
        }
        return -1;
    };
    const screenObject = Object.assign(newScreen, {
        allowBack,
        allowFinish,
        allowPause,
        helpText,
        pausedText,
        showFooter,
        showHeader,
        getFieldIndexByGUID,
        getFieldByGUID,
        getFieldIndex
    });
    return screenObject;
}

function getDeletedScreenFieldsUsingStore(originalScreen, newFields = []) {
    if (!originalScreen) {
        throw new Error('Either screen or newFields is not defined');
    }
    const { guid } = originalScreen;
    const screenFromStore = getElementByGuid(guid);
    let screenFieldReferencesFromStore;
    if (screenFromStore) {
        screenFieldReferencesFromStore = screenFromStore.fieldReferences.map(
            fieldReference => fieldReference.fieldReference
        );
    }
    if (screenFieldReferencesFromStore) {
        const newfieldGuids = newFields.map(newField => newField.guid);
        return screenFieldReferencesFromStore
            .filter(fieldReferenceGuid => {
                return !newfieldGuids.includes(fieldReferenceGuid);
            })
            .map(fieldReference => getElementByGuid(fieldReference));
    }
    return [];
}

function updateScreenFieldReferences(fieldReferences = [], field) {
    if (!field || !field.guid) {
        throw new Error('Either field or field.guid is not defined');
    }
    return [
        ...fieldReferences,
        {
            fieldReference: field.guid
        }
    ];
}
