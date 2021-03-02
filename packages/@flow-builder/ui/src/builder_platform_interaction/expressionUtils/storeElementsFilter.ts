import {
    writableElementsSelector,
    readableElementsSelector,
    choiceSelector,
    isOrCanContainSelector
} from 'builder_platform_interaction/selectors';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getScreenElement } from './resourceUtils';
import { RetrieveOptions } from 'builder_platform_interaction/selectors';

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
 * @param {Boolean} shouldBeWritable    if true, only writable elements will be returned
 * @returns the selector
 */
function writableOrReadableElement(shouldBeWritable = false) {
    return shouldBeWritable ? writableElementsSelector : readableElementsSelector;
}

/**
 * @param {Boolean} shouldBeWritable    if true, only writable elements will be returned
 * @param {Boolean} choices             optional: should this menu data only contain choices
 * @param {Array} staticChoiceGuids     optional: should this menu data only contain the choices specified
 * @param {String} dataType             data type for menu data items
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
    [ELEMENT_TYPE.STAGE_STEP]: () => writableOrReadableElement(),
    [ELEMENT_TYPE.WAIT]: ({ shouldBeWritable }) => writableOrReadableElement(shouldBeWritable),
    [ELEMENT_TYPE.SCREEN]: ({ shouldBeWritable, dataType, choices, staticChoiceGuids }) =>
        screenSelectors(shouldBeWritable, choices, staticChoiceGuids, dataType)
};

const CLUD_ELEMENT_TYPES = [
    ELEMENT_TYPE.RECORD_CREATE,
    ELEMENT_TYPE.RECORD_UPDATE,
    ELEMENT_TYPE.RECORD_DELETE,
    ELEMENT_TYPE.RECORD_LOOKUP
];

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
function addUncommittedElementsFromLocalStorage(elements) {
    const screenElements = flattenElements(getScreenElement());
    if (screenElements && screenElements.length > 0) {
        elements = elements.concat(screenElements);
    }
    return elements;
}

/**
 * Flatten and retrieve all the nested screen field elements from the screen element
 * @param {Object} screenElement screen element from store
 * @returns {array} all nested screen field elements
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
 * @param {Object} storeInstance reference to the storeInstance
 * @param {ElementFilterConfig} config contains necessary context to return the filterInformation
 * @returns {array} retrieves elements from store
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
