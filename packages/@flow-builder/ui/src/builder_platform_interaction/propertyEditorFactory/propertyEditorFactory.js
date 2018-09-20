import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { Store } from "builder_platform_interaction/storeLib";
import {
    swapUidsForDevNames,
    swapDevNamesToGuids
} from "builder_platform_interaction/translatorLib";
import {
    createActionCall,
    createApexPlugin,
    createAssignment,
    createConstant,
    createFlowProperties,
    createFormula,
    createLoop,
    createDecisionWithOutcomes,
    createWaitWithWaitEvents,
    createVariable,
    createTextTemplate,
    createRecordCreate,
    createRecordUpdate,
    createRecordLookup,
    createRecordDelete,
    createScreen,
    createSubflow,
    FACTORY_CONFIG,
    createDecisionWithOutcomeReferencesWhenClosingPropertyEditor,
    createStage
} from "builder_platform_interaction/elementFactory";

/**
 * Element factory to create new objects for each element type for the property editors
 *
 * @param {Object} element        Element to be used as the base for copying information
 * @param {Object} config         Config for element creation
 * @return {Object} newElement    New element object with all relevant data
 */
export const propertyEditorFactory = (element, config = {}) => {
    let newElement = {};

    const funcs = {
        'ACTION_CALL': createActionCall,
        'APEX_CALL': createActionCall,
        'APEX_PLUGIN_CALL': createApexPlugin,
        'ASSIGNMENT': createAssignment,
        'CONSTANT': createConstant,
        'EMAIL_ALERT': createActionCall,
        'FLOW_PROPERTIES': createFlowProperties,
        'FORMULA': createFormula,
        'LOOP': createLoop,
        'RECORD_CREATE': createRecordCreate,
        'RECORD_UPDATE': createRecordUpdate,
        'RECORD_LOOKUP': createRecordLookup,
        'RECORD_DELETE': createRecordDelete,
        'SCREEN': createScreen,
        'SUBFLOW': createSubflow,
        'VARIABLE': createVariable,
        'TEXT_TEMPLATE': createTextTemplate,
        'STAGE': createStage
    };

    const options = [element];

    switch (element.elementType) {
        case ELEMENT_TYPE.APEX_CALL:
            options.push(ELEMENT_TYPE.APEX_CALL);
            break;
        case ELEMENT_TYPE.EMAIL_ALERT:
            options.push(ELEMENT_TYPE.EMAIL_ALERT);
            break;
        default:
            break;
    }

    switch (element.elementType) {
        case ELEMENT_TYPE.DECISION:
            if (config[FACTORY_CONFIG.SWAP_DEV_NAME_TO_GUID]) {
                funcs[ELEMENT_TYPE.DECISION] = createDecisionWithOutcomeReferencesWhenClosingPropertyEditor;
            } else {
                funcs[ELEMENT_TYPE.DECISION] = createDecisionWithOutcomes;
            }
            break;
        case ELEMENT_TYPE.WAIT:
            if (config[FACTORY_CONFIG.SWAP_DEV_NAME_TO_GUID]) {
                // TODO: https://gus.my.salesforce.com/a07B0000005YnL5IAK (W-5395888)
                // newElement = createDecisionWithOutcomeReferencesWhenClosingPropertyEditor(element);
            } else {
                funcs[ELEMENT_TYPE.WAIT] = createWaitWithWaitEvents;
            }
            break;
        default:
            break;
    }

    const func = funcs[ELEMENT_TYPE[element.elementType]] || null;

    if (typeof func === 'function') {
        newElement = func(...options);
    }

    if (config[FACTORY_CONFIG.SWAP_GUID_TO_DEV_NAME]) {
        const elements = Store.getStore().getCurrentState().elements;
        swapUidsForDevNames(elements, { [newElement.guid]: newElement }, {enableGuidToDevnameSwappingForReferenceFields: false});
    } else if (config[FACTORY_CONFIG.SWAP_DEV_NAME_TO_GUID]) {
        const elements = Store.getStore().getCurrentState().elements;
        swapDevNamesToGuids(elements, { [newElement.guid]: newElement });
    }

    return newElement;
};