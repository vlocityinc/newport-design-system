import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { isRecordTriggeredFlow } from 'builder_platform_interaction/processTypeLib';
import {
    choiceSelector,
    isOrCanContainSelector,
    readableElementsSelector,
    RetrieveOptions,
    writableElementsSelector
} from 'builder_platform_interaction/selectors';
import { getStartElement, getTriggerType } from 'builder_platform_interaction/storeUtils';
import { getScreenElement } from './resourceUtils';

export type ElementFilterConfig = {
    allowedParamTypes?: object;
    shouldBeWritable?: boolean; // if this is set, only writable elements will be returned
    elementType?: ELEMENT_TYPE; // the element type this expression builder lives in
    selectorConfig?: RetrieveOptions; // configuration of the selector (e.g. dataType, entityName, isCollection etc...)
    choices?: boolean;
    staticChoiceGuids?: UI.Guid[];
    dataType?: string;
    allowsApexCollAnonymousAutoOutput?: boolean;
};

// TODO: all of this regarding filtering & selectors will be revisited with W-5462144

/**
 * @param {boolean} shouldBeWritable    if true, only writable elements will be returned
 * @returns the selector
 */
function writableOrReadableElement(shouldBeWritable = false) {
    return shouldBeWritable ? writableElementsSelector : readableElementsSelector;
}

/**
 * @param {boolean} shouldBeWritable    if true, only writable elements will be returned
 * @param {boolean} choices             optional: should this menu data only contain choices
 * @param {Array} staticChoiceGuids     optional: should this menu data only contain the choices specified
 * @param {string} dataType             data type for menu data items
 * @returns the selector to be used when element is a Screen
 */
function screenSelectors(
    shouldBeWritable?: boolean,
    choices?: boolean,
    staticChoiceGuids?: UI.Guid[],
    dataType?: string
) {
    return shouldBeWritable
        ? writableElementsSelector
        : choices
        ? choiceSelector(dataType, staticChoiceGuids)
        : readableElementsSelector;
}

const filterInformationProviderMap = {
    [ELEMENT_TYPE.EXTERNAL_SERVICE]: ({ shouldBeWritable }) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.ACTION_CALL]: ({ shouldBeWritable }) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.APEX_CALL]: ({ shouldBeWritable }) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.APEX_PLUGIN_CALL]: ({ shouldBeWritable }) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.ASSIGNMENT]: ({ shouldBeWritable }) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.EMAIL_ALERT]: ({ shouldBeWritable }) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.SUBFLOW]: ({ shouldBeWritable }) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.VARIABLE]: ({ shouldBeWritable }) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.CHOICE]: ({ shouldBeWritable }) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.RECORD_CHOICE_SET]: ({ shouldBeWritable }) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.DECISION]: () => writableOrReadableElement(),
    [ELEMENT_TYPE.START_ELEMENT]: () => writableOrReadableElement(),
    [ELEMENT_TYPE.STAGE_STEP]: () => writableOrReadableElement(),
    [ELEMENT_TYPE.WAIT]: ({ shouldBeWritable }) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.SCREEN]: ({ shouldBeWritable, dataType, choices, staticChoiceGuids }) =>
        screenSelectors(shouldBeWritable, choices, staticChoiceGuids, dataType),
    [ELEMENT_TYPE.COLLECTION_PROCESSOR]: ({ shouldBeWritable }) => writableOrReadableElement(shouldBeWritable)
};

const CLUD_ELEMENT_TYPES = [
    ELEMENT_TYPE.RECORD_CREATE,
    ELEMENT_TYPE.RECORD_UPDATE,
    ELEMENT_TYPE.RECORD_DELETE,
    ELEMENT_TYPE.RECORD_LOOKUP
];

/**
 * @param config
 */
function getFilterInformation(config: ElementFilterConfig = {}) {
    const { elementType, shouldBeWritable, selectorConfig } = config;

    if (selectorConfig) {
        return isOrCanContainSelector(selectorConfig);
    }

    if (elementType && CLUD_ELEMENT_TYPES.includes(elementType)) {
        return writableOrReadableElement(shouldBeWritable);
    }
    return elementType && filterInformationProviderMap[elementType]
        ? filterInformationProviderMap[elementType](config)
        : undefined;
}

/*
 * Add uncommitted elements to the list of elements retrieved from store
 * */
/**
 * @param elements
 */
function addUncommittedElementsFromLocalStorage(elements) {
    const currentScreen: any = getScreenElement();
    const screenElements = flattenElements(currentScreen);
    const existingGuids = elements?.length > 0 ? elements.map((element) => element?.guid) : [];
    if (screenElements?.length > 0) {
        for (let x = 0; x < screenElements.length; x++) {
            if (!existingGuids.includes(screenElements[x].guid)) {
                elements.push(screenElements[x]);
            }
        }
    }

    elements = removeUncommittedDeletedElementsFromLocalStorage(elements, currentScreen);

    if (isRecordTriggeredFlow(getTriggerType())) {
        const startElementIndex = elements.findIndex((el) => el.elementType === ELEMENT_TYPE.START_ELEMENT);
        const startElement: UI.Start | undefined = getStartElement();
        if (startElementIndex < 0) {
            // new flow: add the start element from current session to the array
            if (startElement) {
                elements.unshift(startElement);
            }
        } else {
            // reopened  property editor: update the context object with value from current session
            elements[startElementIndex] = Object.assign({}, elements[startElementIndex], {
                object: startElement?.object,
                subtype: startElement?.object
            });
        }
    }

    return elements;
}

/*
 * Find and remove elements that have been deleted from local storage
 */
/**
 * @param elements
 * @param currentScreen
 */
function removeUncommittedDeletedElementsFromLocalStorage(elements: UI.ScreenField[], currentScreen: UI.CanvasElement) {
    if (currentScreen) {
        // Get all guids from current screen
        const screenElementsGuids = getAllGuids(currentScreen);
        const ccurrentScreenGuid = currentScreen.guid;
        // get current screen from store
        const currentScreenInStore = elements.find((el) => el?.guid === ccurrentScreenGuid);
        const guidsInScreenFromStore: UI.Guid[] = getAllGuidsFromChildRef(currentScreenInStore, elements);
        // Compare length of Guids arrays
        if (guidsInScreenFromStore.length !== screenElementsGuids.length) {
            const filteredArray = guidsInScreenFromStore.filter((guid) => !screenElementsGuids.includes(guid));
            // Remove elements deleted from local storage
            filteredArray.forEach((guid) => {
                const elementToRemove = guidsInScreenFromStore.find((element) => element === guid);
                const index = elements.findIndex((el) => el.guid === elementToRemove);
                if (index > 0) {
                    elements.splice(index, 1);
                }
            });
        }
    }
    return elements;
}

/**
 * @param screenElement
 */
function getAllGuids(screenElement) {
    if (!screenElement) {
        return [];
    }
    const screenElementsGuids: any[] = [];
    const fields = screenElement.fields;
    if (fields) {
        fields.forEach((field) => {
            if (field?.name?.value !== '') {
                screenElementsGuids.push(field.guid);
            }
            screenElementsGuids.push(...getAllGuids(field));
        });
    }
    return screenElementsGuids;
}

/**
 * @param screenElement
 * @param elements
 */
function getAllGuidsFromChildRef(screenElement, elements) {
    const guids: UI.Guid[] = [];
    screenElement?.childReferences.forEach((child) => {
        if (child) {
            const childElement = elements.find((el) => el.guid === child?.childReference);
            guids.push(child?.childReference, ...getAllGuidsFromChildRef(childElement, elements));
        }
    });
    return guids;
}

/**
 * Flatten and retrieve all the nested screen field elements from the screen element
 *
 * @param {Object} screenElement screen element from store
 * @returns {Array} all nested screen field elements
 */
export function flattenElements(screenElement) {
    if (!screenElement) {
        return [];
    }
    const screenElements: any[] = [];
    const fields = screenElement.fields;
    if (fields) {
        fields.forEach((field) => {
            if (field && field.isNewField && field.name.value !== '') {
                screenElements.push(field);
            }
            screenElements.push(...flattenElements(field));
        });
    }
    return screenElements;
}

/**
 * This method returns the selector that should be used to find elements for the menuData
 *
 * @param {Object} storeInstance reference to the storeInstance
 * @param {ElementFilterConfig} config contains necessary context to return the filterInformation
 * @returns {Array} retrieves elements from store
 */
export function getStoreElements(storeInstance: UI.StoreState, config: ElementFilterConfig) {
    let elements = [];

    const selector = getFilterInformation(config);
    if (selector) {
        elements = selector(storeInstance);
    }
    if (config.choices) {
        return elements;
    }
    return addUncommittedElementsFromLocalStorage(elements);
}
