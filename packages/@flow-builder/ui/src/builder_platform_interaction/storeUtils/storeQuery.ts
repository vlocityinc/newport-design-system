import { Store } from 'builder_platform_interaction/storeLib';
import { ELEMENT_TYPE, FLOW_TRIGGER_TYPE, FLOW_TRIGGER_SAVE_TYPE } from 'builder_platform_interaction/flowMetadata';

export const getElementByGuidFromState = ({ elements }, guid: string) => elements[guid];

/**
 * Fetches the element from the store for the input element guid.
 * NOTE: THIS FUNCTION IS NOT MEANT TO BE USED BY THE COMPONENTS.
 * @param {string} guid for the element
 * @return {*} store element or undefined if the guid does not exists.
 */
export const getElementByGuid = <T extends UI.Element>(guid: UI.Guid): T | undefined =>
    getElementByGuidFromState(Store.getStore().getCurrentState(), guid);

export const getElementByDevNameFromState = <T extends UI.Element>(
    { elements }: { elements: UI.Elements },
    devName: string,
    caseSensitive = false
): T | undefined => {
    // TODO : add a devName => guid mapping in the store to improve perfs
    if (!caseSensitive) {
        devName = devName.toLowerCase();
    }
    for (const guid in elements) {
        if (elements.hasOwnProperty(guid)) {
            let elementName = elements[guid].name;
            if (elementName && !caseSensitive) {
                elementName = elementName.toLowerCase();
            }
            if (elementName === devName) {
                return elements[guid] as T;
            }
        }
    }
    return undefined;
};

/**
 * Fetches the element from the store for the input element devName.
 * Note : this function iterates over all the elements to find one with the given devName. This may have a big performance impact.
 * @param {string} devName for the element
 * @param {boolean} caseSensitive true if name comparison is case sensitive (false by default)
 * @return {*} store element or undefined if the devName does not exists.
 */
export const getElementByDevName = <T extends UI.Element>(devName: string, caseSensitive = false): T | undefined =>
    getElementByDevNameFromState(Store.getStore().getCurrentState(), devName, caseSensitive);

export const getStartElementFromState = ({ elements }: { elements: UI.Elements }): UI.Start | undefined => {
    const startElement = Object.values(elements).find((element) => {
        return element.elementType === ELEMENT_TYPE.START_ELEMENT;
    });
    return startElement as UI.Start | undefined;
};

/**
 * Fetches the Start element from the store
 */
export const getStartElement = (): UI.Start | undefined => getStartElementFromState(Store.getStore().getCurrentState());

/**
 * Common function to return duplicate dev name elements
 * @param {Object[]} elements
 * @param {string} nameToBeTested
 * @param {string[]} listOfGuidsToSkip
 * @returns {Object[]} matchingElements Object list
 */
export const getDuplicateDevNameElements = (
    elements: UI.Elements = {},
    nameToBeTested: string,
    listOfGuidsToSkip: string[] = []
) => {
    return (
        elements &&
        Object.values(elements).filter(
            (element) =>
                !listOfGuidsToSkip.includes(element.guid) &&
                nameToBeTested !== '' && // no need to run the validation in case of empty string
                (element.name && element.name.toLowerCase()) === (nameToBeTested && nameToBeTested.toLowerCase())
        )
    );
};

/**
 * Checks the uniqueness of the devName string amongst the elements present in the store, ignoring the list of guids passed as blacklist to avoid checking against uniqueness.
 * This listOfGuids might be helpful in the future when an element like decision/screen wants to pass a list of outcome guids and checks for uniqueness internally for those guids, since it has the latest data for those guids
 * @param {string} nameToBeTested - for uniqueness in store
 * @param {string[]} listOfGuidsToSkip - for checking against uniqueness
 * @returns {boolean}
 */
export const isDevNameInStore = (nameToBeTested: string, listOfGuidsToSkip: UI.Guid[] = []) => {
    const currentState = Store.getStore().getCurrentState();
    const elements = currentState.elements;
    const matches = getDuplicateDevNameElements(elements, nameToBeTested, listOfGuidsToSkip) || [];
    return matches.length > 0;
};

/**
 * Checks the uniqueness of the order number amongst the elements present in the store, ignoring the list of guids passed as blacklist to avoid checking against uniqueness.
 * This listOfGuids might be helpful in the future when an element like decision/screen wants to pass a list of outcome guids and checks for uniqueness internally for those guids, since it has the latest data for those guids
 * @param {number} orderNumberToBeTested - for uniqueness in store
 * @param {string[]} listOfGuidsToSkip - for checking against uniqueness
 * @returns {boolean}
 */
export const isOrderNumberInStore = (orderNumberToBeTested: number, listOfGuidsToSkip: UI.Guid[] = []) => {
    const currentState = Store.getStore().getCurrentState();
    const elements = currentState.elements;
    const matches = Object.values(elements).filter(
        (element) => !listOfGuidsToSkip.includes(element.guid) && (element as any).stageOrder === orderNumberToBeTested
    );
    return matches.length > 0;
};

/**
 * Returns the trigger type for the current flow
 * @returns {String}
 */
export const getTriggerType = () => {
    const startElement = getStartElement();
    return startElement ? startElement.triggerType : undefined;
};

/**
 * Returns the record trigger type for the current flow
 * @returns Create, CreateOrUpdate, Update, Delete
 */
export const getRecordTriggerType = () => {
    const startElement = getStartElement();

    return startElement ? startElement.recordTriggerType : undefined;
};

/**
 * Evaluates if the outcome execution options should be displayed in
 * Start Element or Decision element.
 */
export const isExecuteOnlyWhenChangeMatchesConditionsPossible = () => {
    const triggerType = getTriggerType();
    const saveType = getRecordTriggerType();
    return (
        ((triggerType && triggerType === FLOW_TRIGGER_TYPE.BEFORE_SAVE) ||
            triggerType === FLOW_TRIGGER_TYPE.AFTER_SAVE) &&
        ((saveType && saveType === FLOW_TRIGGER_SAVE_TYPE.CREATE_AND_UPDATE) ||
            saveType === FLOW_TRIGGER_SAVE_TYPE.UPDATE)
    );
};

/**
 * Returns the process type for the current flow
 * @returns {String}
 */
export const getProcessType = () => Store.getStore().getCurrentState().properties.processType;

/**
 * Returns the value of isAutoLayoutCanvas as in the store. Returns false if the store has not been initialized
 * @returns true if isAutoLayoutCanvas is set to true in the store. Returns false otherwise
 */
export const shouldUseAutoLayoutCanvas = (): boolean => {
    const currentStoreState = Store.getStore().getCurrentState();
    if (currentStoreState && currentStoreState.properties) {
        return currentStoreState.properties.isAutoLayoutCanvas;
    }
    return false;
};

/**
 * Fetches all elements of a given element type
 */
export const getElementsForElementType = (elementType: UI.ElementType): UI.Element[] => {
    return <UI.Element[]>Object.values(Store.getStore().getCurrentState().elements).reduce(
        (elements: UI.Element[], element: UI.Element): UI.Element[] => {
            if (element.elementType === elementType) {
                elements.push(element);
            }

            return elements;
        },
        []
    );
};
