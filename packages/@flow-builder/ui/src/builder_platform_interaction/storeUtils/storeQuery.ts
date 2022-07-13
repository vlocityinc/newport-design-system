import immediateScheduledPathLabel from '@salesforce/label/FlowBuilderStartEditor.immediateScheduledPathLabel';
import {
    CONNECTOR_TYPE,
    ELEMENT_TYPE,
    FLOW_TRIGGER_SAVE_TYPE,
    FLOW_TRIGGER_TYPE,
    SCHEDULED_PATH_TYPE
} from 'builder_platform_interaction/flowMetadata';
import { Store } from 'builder_platform_interaction/storeLib';
import { SYSTEM_VARIABLE_RECORD_PREFIX } from 'builder_platform_interaction/systemVariableConstantsLib';

export const getElementByGuidFromState = ({ elements }, guid: string) => elements[guid];

/**
 * Fetches the element from the store for the input element guid.
 * NOTE: THIS FUNCTION IS NOT MEANT TO BE USED BY THE COMPONENTS.
 *
 * @param {string} guid for the element
 * @returns {*} store element or undefined if the guid does not exists.
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
 *
 * @param {string} devName for the element
 * @param {boolean} caseSensitive true if name comparison is case sensitive (false by default)
 * @returns {*} store element or undefined if the devName does not exists.
 */
export const getElementByDevName = <T extends UI.Element>(devName: string, caseSensitive = false): T | undefined => {
    // Check local variable for startElement first if looking for element corresponding to $Record
    if (devName === SYSTEM_VARIABLE_RECORD_PREFIX && startElement) {
        return startElement;
    }
    return getElementByDevNameFromState(Store.getStore().getCurrentState(), devName, caseSensitive);
};

export const getStartElementFromState = ({ elements }: { elements: UI.Elements }): UI.Start | undefined => {
    const startElement =
        elements &&
        Object.values(elements).find((element) => {
            return element.elementType === ELEMENT_TYPE.START_ELEMENT;
        });
    return startElement as UI.Start | undefined;
};

/**
 * Fetches the Start element from the local variable or the store (in case one is not present in local variable)
 *
 * @param {Object} elements
 * @param elements.elements - All elements in the flow
 * @returns start element
 */
export const getStartElement = ({ elements } = Store.getStore().getCurrentState()): UI.Start | undefined =>
    startElement || getStartElementFromState({ elements });

/* Global variable to hold the current state of the context object in record change trigger editor.
 *  This is being populated by the recordChangeTriggerEditor component and
 *   used for accessing context object added in the current session (which have not yet been committed to the store)
 *   in resource pickers inside the editor.
 * */
let startElement: any = null;

export const setStartElementInLocalStorage = (element) => {
    startElement = element;
};

/**
 * Common function to return duplicate dev name elements
 *
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
 *
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
 * Checks label for uniqueness against other elements in the store
 *
 * @param labelToBeTested The label to be tested for uniqueness
 * @returns Whether or not the label is in the store
 */
export const isLabelInStore = (labelToBeTested: string): boolean => {
    const currentState = Store.getStore().getCurrentState();
    const elements = currentState.elements;
    const match =
        elements &&
        Object.values(elements).find(
            (element) => labelToBeTested !== '' && element.label && labelToBeTested === element.label
        );
    return match !== undefined;
};

/**
 * Checks the uniqueness of the order number amongst the elements present in the store, ignoring the list of guids passed as blacklist to avoid checking against uniqueness.
 * This listOfGuids might be helpful in the future when an element like decision/screen wants to pass a list of outcome guids and checks for uniqueness internally for those guids, since it has the latest data for those guids
 *
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
 * @returns the trigger type for the current flow
 */
export const getTriggerType = (): UI.FlowTriggerType => {
    const startElement = getStartElement();
    return startElement?.triggerType || FLOW_TRIGGER_TYPE.NONE;
};

/**
 * @returns the object type for the current flow.
 * Currently located on the start element.
 */
export const getStartObject = (): string | undefined => {
    const startElement = getStartElement();
    return startElement ? startElement.object : undefined;
};

/**
 * Returns the record trigger type for the current flow
 *
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
        (triggerType === FLOW_TRIGGER_TYPE.BEFORE_SAVE || triggerType === FLOW_TRIGGER_TYPE.AFTER_SAVE) &&
        (saveType === FLOW_TRIGGER_SAVE_TYPE.CREATE_AND_UPDATE || saveType === FLOW_TRIGGER_SAVE_TYPE.UPDATE)
    );
};

/**
 * @returns the process type for the current flow
 */
export const getProcessType = () => Store.getStore().getCurrentState().properties.processType;

/**
 * Returns the environments for the current flow
 *
 * @returns Environments for the current flow
 */
export const getEnvironments = (): string[] => Store.getStore().getCurrentState().properties.environments;

/**
 * Returns the value of isAutoLayoutCanvas as in the store. Returns false if the store has not been initialized
 *
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
 *
 * @param elementType
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

/**
 *  @returns the list of paths displayed on the canvas
 */
export const getScheduledPathsList = (): any[] => {
    const scheduledPathsList: any[] = [];

    if (shouldUseAutoLayoutCanvas()) {
        const startElement = getStartElement();
        const elements = Store.getStore().getCurrentState().elements;

        scheduledPathsList.push({
            label: immediateScheduledPathLabel,
            value: SCHEDULED_PATH_TYPE.IMMEDIATE_SCHEDULED_PATH,
            pathType: null
        });

        if (startElement?.childReferences) {
            Object.keys(startElement.childReferences).forEach((key) => {
                const child = getChildElementInfo(elements, startElement.childReferences[key].childReference);
                if (child && child.elementType === ELEMENT_TYPE.SCHEDULED_PATH) {
                    scheduledPathsList.push({
                        label: child.label,
                        value: child.name,
                        pathType: child.pathType
                    });
                }
            });
        }
    } else {
        const connectors = Store.getStore().getCurrentState().connectors;
        const scheduledPathElements = getElementsForElementType(ELEMENT_TYPE.SCHEDULED_PATH);
        if (connectors) {
            Object.keys(connectors).forEach((key) => {
                if (connectors[key].type && connectors[key].type === CONNECTOR_TYPE.IMMEDIATE) {
                    scheduledPathsList.push({
                        label: immediateScheduledPathLabel,
                        value: SCHEDULED_PATH_TYPE.IMMEDIATE_SCHEDULED_PATH,
                        pathType: null
                    });
                }
            });
        }

        if (scheduledPathElements) {
            Object.keys(scheduledPathElements).forEach((key) => {
                if (isGuidConnected(connectors, scheduledPathElements[key].guid)) {
                    if (scheduledPathElements[key].elementType === ELEMENT_TYPE.SCHEDULED_PATH) {
                        scheduledPathsList.push({
                            label: scheduledPathElements[key].label,
                            value: scheduledPathElements[key].name,
                            pathType: scheduledPathElements[key].pathType
                        });
                    }
                }
            });
        }
    }
    return scheduledPathsList;
};

/**
 * Checks whether a path is connected or not
 *
 * @returns {boolean}
 * @param object
 * @param id
 */
export const isGuidConnected = (object, id): boolean => {
    if (object == null) {
        return false;
    }
    return object.some((val) => {
        return id === val?.childSource;
    });
};

/**
 * fetches the child element info by id and returns it
 *
 * @param object parent object
 * @param id child object id
 * @returns child element info
 */
export const getChildElementInfo = (object, id): any => {
    let child = null;
    Object.keys(object).forEach((key) => {
        if (key === id) {
            child = object[key];
        }
    });
    return child;
};

/**
 * Helper function to get unique dev name that is not in the store or in the passed in blacklist
 *
 * @param {string} name - existing dev name to make unique
 * @param {string[]} blacklistNames - blacklisted list of names to check against in addition to store
 * @returns {string} new unique dev name
 */
export const getUniqueDuplicateElementName = (name: string, blacklistNames: string[] = []) => {
    if (isDevNameInStore(name) || blacklistNames.includes(name)) {
        return getUniqueDuplicateElementName(name + '_0', blacklistNames);
    }

    return name;
};
