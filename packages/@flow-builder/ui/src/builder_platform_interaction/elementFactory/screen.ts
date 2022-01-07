import { ELEMENT_TYPE, FOOTER_LABEL_TYPE, PAUSE_MESSAGE_TYPE } from 'builder_platform_interaction/flowMetadata';
import { isRegionContainerField } from 'builder_platform_interaction/screenEditorUtils';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap,
    duplicateCanvasElementWithChildElements
} from './base/baseElement';
import { baseCanvasElementMetadataObject } from './base/baseMetadata';
import { createConnectorObjects } from './connector';
import {
    createDuplicateNestedScreenFields,
    createScreenFieldMetadataObject,
    createScreenFieldWithFieldReferences,
    createScreenFieldWithFields
} from './screenField';

const elementType = ELEMENT_TYPE.SCREEN;
const maxConnections = 1;

/**
 * Called when opening a property editor or copying a screen element
 *
 * @param screen - The screen elemnent
 * @returns The screen element in the shape expected by a property editor
 */
export function createScreenWithFields(screen: UI.Screen = {} as UI.Screen): UI.Screen {
    const newScreen: UI.Screen = createScreenElement(screen);
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
 * Function to create the duplicate Screen element
 *
 * @param {Object} screen - Screen element being copied
 * @param {string} newGuid - Guid for the new duplicated screen element
 * @param {string} newName - Name for the new duplicated screen element
 * @param {Object} childElementGuidMap - Map of child element guids to newly generated guids that will be used for
 * the duplicated child elements
 * @param {Object} childElementNameMap - Map of child element names to newly generated unique names that will be used for
 * the duplicated child elements
 * @param {Object} cutOrCopiedChildElements - Local copy of the cut ot copied canvas elements. Undefined in the case of duplication on Free Form Canvas
 * @returns {Object} Returns an object containing the duplicated element and the duplicated childElements
 */
export function createDuplicateScreen( // TODO: refactor the duplication code. The duplicate wait and other elements' code is very similar
    screen: UI.Screen,
    newGuid: UI.Guid,
    newName: string,
    childElementGuidMap: UI.Guid[],
    childElementNameMap: string[],
    cutOrCopiedChildElements: UI.Screen[]
) {
    const duplicateScreen = createScreenElement(screen);
    const { duplicatedElement, duplicatedChildElements, updatedChildReferences } =
        duplicateCanvasElementWithChildElements(
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
 *
 * @param {screen} screen - screen in the shape of the property editor
 * @returns Object containing the screen Element and an array with the deleted screen fields
 */
export function createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor(screen: UI.Screen) {
    const newScreen = createScreenElement(screen);
    const { fields } = screen;

    let childReferences: UI.ChildReference[] = [],
        newFields: UI.ScreenField[] = [],
        regionContainerCount = 0;

    for (let i = 0; i < fields!.length; i++) {
        const field = fields![i];
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
 * This function is used in the FlowToUi convertion
 * It create a screen in the shape of the store (with field references). This is used when taking a flow element and
 * converting it for use in the store.
 *
 * @param screen - screen from metadata
 * @returns screen in the shape used by the store
 */
export function createScreenWithFieldReferences(screen: Metadata.Screen): UI.StoreState {
    const newScreen = createScreenElement(screen);
    const {
        fields = [],
        nextOrFinishButtonLabel: nextOrFinishLabel,
        allowFinish,
        backButtonLabel: backLabel,
        allowBack,
        pauseButtonLabel: pauseLabel,
        allowPause
    } = screen;

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

    const connectors = createConnectorObjects(screen, newScreen.guid, null, false);
    const connectorCount = connectors ? connectors.length : 0;

    let screenFields: UI.ScreenField[] = [],
        childReferences: UI.ChildReference[] = [],
        regionContainerCount = 0;

    for (let i = 0; i < fields.length; i++) {
        const field: Metadata.ScreenField = fields[i];
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
 *
 * @param screen - screen from the store
 * @param config - configuration for converting screen
 * @returns screen in the shape for the metadata
 */
export function createScreenMetadataObject(screen: UI.Screen, config = {}): Metadata.Screen {
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
        nextOrFinishLabel,
        pauseLabel,
        backLabel,
        nextOrFinishLabelType,
        pauseLabelType,
        backLabelType
    } = screen;
    const allowFinish = nextOrFinishLabelType !== FOOTER_LABEL_TYPE.HIDE;
    const nextOrFinishButtonLabel =
        nextOrFinishLabelType === FOOTER_LABEL_TYPE.CUSTOM && nextOrFinishLabel ? nextOrFinishLabel : null;
    const allowPause = pauseLabelType !== FOOTER_LABEL_TYPE.HIDE;
    const pauseButtonLabel = pauseLabelType === FOOTER_LABEL_TYPE.CUSTOM && pauseLabel ? pauseLabel : null;
    const allowBack = backLabelType !== FOOTER_LABEL_TYPE.HIDE;
    const backButtonLabel = backLabelType === FOOTER_LABEL_TYPE.CUSTOM && backLabel ? backLabel : null;

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
        nextOrFinishButtonLabel,
        pauseButtonLabel,
        backButtonLabel
    });
}

/**
 * @param screen - The screen element
 * @returns the screen element updated
 */
export function createScreenElement(screen: UI.Screen | Metadata.Screen): UI.Screen {
    const newScreen = baseCanvasElement(screen) as UI.Screen;
    const {
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
    } = { ...screen };

    const getFieldByGUID = function (this: UI.Screen, guid): UI.ScreenField | undefined {
        if (this.findFieldByGUID) {
            return this.findFieldByGUID(this.fields, guid);
        }
        return undefined;
    };

    const findFieldByGUID = function (
        this: UI.Screen,
        fields: UI.ScreenField[] = [],
        guid: UI.Guid
    ): UI.ScreenField | undefined {
        let foundField = fields.find((field) => {
            return field.guid === guid;
        });
        if (foundField) {
            return foundField;
        }
        for (const field of fields) {
            if (field.fields) {
                if (this.findFieldByGUID) {
                    foundField = this.findFieldByGUID(field.fields, guid);
                    if (foundField) {
                        return foundField;
                    }
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
    const getFieldIndexesByGUID = function (this: UI.Screen, guid: UI.Guid): number[] {
        if (this.findFieldIndexByGUID) {
            const indexes = this.findFieldIndexByGUID(this.fields, guid);
            return indexes || -1;
        }
        return [];
    };

    const findFieldIndexByGUID = function (
        this: UI.Screen,
        fields: UI.ScreenField[] = [],
        guid: UI.Guid
    ): number[] | undefined {
        const foundIndex = fields.findIndex((field) => {
            return field.guid === guid;
        });
        if (foundIndex >= 0) {
            return [foundIndex];
        }
        let foundIndexes: number[];
        for (let i = 0; i < fields.length; i++) {
            if (fields[i].fields) {
                if (this.findFieldIndexByGUID) {
                    foundIndexes = this.findFieldIndexByGUID(fields[i].fields, guid);
                    if (foundIndexes) {
                        return foundIndexes.concat(i);
                    }
                }
            }
        }
        return undefined;
    };

    const screenObject: UI.Screen = Object.assign(newScreen, {
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
 *
 * @param parentElementFromStore - screen or screen field object in the store
 * @returns list of Guid of associated Screen Field References
 */
function getAssociatedScreenFieldReferencesFromStore(parentElementFromStore: UI.Screen): UI.Guid[] {
    const screenFieldReferencesFromStore: UI.Guid[] = [];
    if (parentElementFromStore.childReferences) {
        for (let i = 0; i < parentElementFromStore.childReferences.length; i++) {
            screenFieldReferencesFromStore.push(parentElementFromStore.childReferences[i].childReference);
            screenFieldReferencesFromStore.push(
                ...getAssociatedScreenFieldReferencesFromStore(
                    getElementByGuid(parentElementFromStore.childReferences[i].childReference) as UI.Screen
                )
            );
        }
    }

    return screenFieldReferencesFromStore;
}

/**
 * @param originalScreen -
 * @param newFields - New fields
 * @returns List of deleted screenFields
 */
function getDeletedScreenFieldsUsingStore(originalScreen, newFields: UI.ScreenField[] = []): UI.ScreenField[] {
    if (!originalScreen) {
        throw new Error('Either screen or newFields is not defined');
    }
    const { guid } = originalScreen;
    const screenFromStore = getElementByGuid(guid) as UI.Screen;
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

/**
 * @param childReferences - Array of chield references
 * @param field - Screen Field
 * @returns Updated screen fields
 */
function updateScreenFieldReferences(
    childReferences: UI.ChildReference[] = [],
    field: UI.ScreenField
): UI.ChildReference[] {
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
