import { ACTION_TYPE, METADATA_KEY, ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { ICONS_LARGE } from 'builder_platform_interaction/imageLib';
import { LABELS } from "./elementConfigLabels";
import { AddElementEvent, EditElementEvent } from 'builder_platform_interaction/events';
import {
    createActionCall,
    createApexPlugin,
    createAssignment,
    createChoice,
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
    createSubflow,
    createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor,
    createWaitWithWaitEventReferencesWhenUpdatingFromPropertyEditor,
    createStage,
    createStep,
    createPicklistChoiceSet,
    createRecordChoiceSet,
    createStartElement,
    createApexCall,
    createEmailAlert,
    createOutcome,
    createWaitEvent,
    createWaitMetadataObject,
    createActionCallMetadataObject,
    createApexPluginMetadataObject,
    createAssignmentMetadataObject,
    createChoiceMetadataObject,
    createConstantMetadataObject,
    createDecisionMetadataObject,
    createFlowPropertiesMetadataObject,
    createFormulaMetadataObject,
    createLoopMetadataObject,
    createPicklistChoiceSetMetadataObject,
    createRecordCreateMetadataObject,
    createRecordUpdateMetadataObject,
    createRecordLookupMetadataObject,
    createRecordDeleteMetadataObject,
    createRecordChoiceSetMetadataObject,
    createScreenMetadataObject,
    createSubflowMetadataObject,
    createVariableMetadataObject,
    createTextTemplateMetadataObject,
    createStageMetadataObject,
    createStepMetadataObject,
    createStartElementWithConnectors,
    createApexPluginWithConnectors,
    createAssignmentWithConnectors,
    createConstantForStore,
    createDecisionWithOutcomeReferences,
    createFlowPropertiesForEditor,
    createFormulaForStore,
    createLoopWithConnectors,
    createWaitWithWaitEventReferences,
    createRecordCreateWithConnectors,
    createRecordUpdateWithConnectors,
    createRecordLookupWithConnectors,
    createRecordDeleteWithConnectors,
    createSubflowWithConnectors,
    createVariableForStore,
    createTextTemplateForStore,
    createStageForStore,
    createChoiceForStore,
    createStepWithConnectorsForStore,
    createActionCallForStore,
    dynamicChoiceSetForStore,
    createScreenWithFields,
    createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor,
    createScreenWithFieldReferences,
    createScreenField
} from "builder_platform_interaction/elementFactory";


const SOBJECT_TYPE = FLOW_DATA_TYPE.SOBJECT.value;

/**
 * @constant
 * @type {string} MODAL_SIZE large or medium (default)
 */
export const MODAL_SIZE = {
    LARGE: 'large restrictWidthToSldsMedium', // To be used by screen and decision elementType
    MEDIUM: 'medium slds-modal_medium',
    SMALL: 'small'
};

/**
 * @constant elementTypeToComponentMap - Map of different element types to their
 *                                       respective components
 * @type {object}
 */
export const elementTypeToConfigMap = {
    [ELEMENT_TYPE.FLOW_PROPERTIES]: {
        descriptor: 'builder_platform_interaction:flowPropertiesEditor',
        modalSize: MODAL_SIZE.MEDIUM,
        labels: {
            singular: LABELS.flowPropertiesSingularLabel
        },
        canvasElement: false,
        factory: {
            propertyEditor: createFlowPropertiesForEditor,
            uiToFlow: createFlowPropertiesMetadataObject,
            flowToUi: createFlowProperties
        }
    },
    [ELEMENT_TYPE.START_ELEMENT]: {
        nodeConfig: {
            iconName: 'utility:right',
            maxConnections: 1
        },
        canvasElement: true,
        factory: {
            propertyEditor: createStartElement,
            flowToUi: createStartElementWithConnectors
        }
    },
    [ELEMENT_TYPE.SUBFLOW]: {
        descriptor: {
            [EditElementEvent.EVENT_NAME] : 'builder_platform_interaction:subflowEditor',
            [AddElementEvent.EVENT_NAME]: 'builder_platform_interaction:callOutEditor'
        },
        nodeConfig: {
            iconName: 'standard:flow',
            utilityIconName: 'utility:flow',
            dragImageSrc: ICONS_LARGE.SUBFLOW,
            maxConnections: 2
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.SUBFLOWS,
        labels: {
            singular: LABELS.subflowSingularLabel,
            plural: LABELS.subflowPluralLabel
        },
        canvasElement: true,
        nonHydratableProperties: ['valueDataType'],
        canHaveFaultConnector: false,
        factory: {
            propertyEditor: createSubflow,
            uiToFlow: createSubflowMetadataObject,
            flowToUi: createSubflowWithConnectors
        }
    },
    [ELEMENT_TYPE.ACTION_CALL]: {
        descriptor: {
            [EditElementEvent.EVENT_NAME] : 'builder_platform_interaction:invocableActionEditor',
            [AddElementEvent.EVENT_NAME]: 'builder_platform_interaction:callOutEditor'
        },
        nodeConfig: {
            iconName: 'standard:custom_notification',
            utilityIconName: 'utility:fallback',
            dragImageSrc: ICONS_LARGE.ACTION_CALL,
            maxConnections: 2
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.ACTION_CALLS,
        // action call : standard actions and quickactions
        metadataFilter : element => element.actionType !== ACTION_TYPE.EMAIL_ALERT &&
                                    element.actionType !== ACTION_TYPE.APEX &&
                                    element.actionType !== ACTION_TYPE.FLOW,
        labels: {
            singular: LABELS.actionSingularLabel,
            plural: LABELS.actionPluralLabel
        },
        canvasElement: true,
        nonHydratableProperties: ['valueDataType'],
        canHaveFaultConnector: true,
        factory: {
            propertyEditor: createActionCall,
            uiToFlow: createActionCallMetadataObject,
            flowToUi: createActionCallForStore
        }
    },
    [ELEMENT_TYPE.APEX_PLUGIN_CALL]: {
        descriptor: {
            [EditElementEvent.EVENT_NAME] : 'builder_platform_interaction:apexPluginEditor',
            [AddElementEvent.EVENT_NAME]: 'builder_platform_interaction:callOutEditor'
        },
        nodeConfig: {
            iconName: 'standard:apex_plugin',
            utilityIconName: 'utility:apex_plugin',
            dragImageSrc: ICONS_LARGE.APEX_PLUGIN_CALL,
            maxConnections: 2
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.APEX_PLUGIN_CALLS,
        labels: {
            singular: LABELS.apexPluginSingularLabel,
            plural: LABELS.apexPluginPluralLabel
        },
        canvasElement: true,
        nonHydratableProperties: ['valueDataType'],
        canHaveFaultConnector: true,
        factory: {
            propertyEditor: createApexPlugin,
            uiToFlow: createApexPluginMetadataObject,
            flowToUi: createApexPluginWithConnectors
        }
    },
    [ELEMENT_TYPE.APEX_CALL]: {
        descriptor: {
            [EditElementEvent.EVENT_NAME] : 'builder_platform_interaction:invocableActionEditor',
            [AddElementEvent.EVENT_NAME]: 'builder_platform_interaction:callOutEditor'
        },
        nodeConfig: {
            iconName: 'standard:apex',
            utilityIconName: 'utility:apex',
            dragImageSrc: ICONS_LARGE.APEX_CALL,
            maxConnections: 1
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.ACTION_CALLS,
        metadataFilter : element => element.actionType === ACTION_TYPE.APEX,
        labels: {
            singular: LABELS.apexSingularLabel,
            plural: LABELS.apexPluralLabel
        },
        canvasElement: true,
        nonHydratableProperties: ['valueDataType'],
        canHaveFaultConnector: true,
        factory: {
            propertyEditor: createApexCall,
            uiToFlow: createActionCallMetadataObject,
            flowToUi: createActionCallForStore
        }
    },
    [ELEMENT_TYPE.EMAIL_ALERT]: {
        descriptor: {
            [EditElementEvent.EVENT_NAME] : 'builder_platform_interaction:invocableActionEditor',
            [AddElementEvent.EVENT_NAME]: 'builder_platform_interaction:callOutEditor'
        },
        nodeConfig: {
            iconName: 'standard:email',
            utilityIconName: 'utility:email',
            dragImageSrc: ICONS_LARGE.EMAIL_ALERT,
            maxConnections: 1
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.ACTION_CALLS,
        metadataFilter : element => element.actionType === ACTION_TYPE.EMAIL_ALERT,
        labels: {
            singular: LABELS.emailAlertSingularLabel,
            plural: LABELS.emailAlertPluralLabel
        },
        canvasElement: true,
        nonHydratableProperties: ['valueDataType'],
        canHaveFaultConnector: true,
        factory: {
            propertyEditor: createEmailAlert,
            uiToFlow: createActionCallMetadataObject,
            flowToUi: createActionCallForStore
        }
    },
    [ELEMENT_TYPE.ASSIGNMENT]: {
        descriptor: 'builder_platform_interaction:assignmentEditor',
        nodeConfig: {
            iconName: 'standard:assignment',
            utilityIconName: 'utility:assignment',
            dragImageSrc: ICONS_LARGE.ASSIGNMENT,
            maxConnections: 1
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.ASSIGNMENTS,
        labels: {
            singular: LABELS.assignmentSingularLabel,
            plural: LABELS.assignmentPluralLabel
        },
        canvasElement: true,
        bodyCssClass: 'slds-p-around_none',
        factory: {
            propertyEditor: createAssignment,
            uiToFlow: createAssignmentMetadataObject,
            flowToUi: createAssignmentWithConnectors
        }
    },

    [ELEMENT_TYPE.SCREEN]: {
        descriptor: 'builder_platform_interaction:screenEditor',
        nodeConfig: {
            iconName: 'standard:screen',
            utilityIconName: 'utility:screen',
            dragImageSrc: ICONS_LARGE.SCREEN,
            maxConnections: 1
        },
        modalSize: MODAL_SIZE.LARGE,
        metadataKey: METADATA_KEY.SCREENS,
        labels: {
            singular: LABELS.screenSingularLabel,
            plural: LABELS.screenPluralLabel
        },
        canvasElement: true,
        nonHydratableProperties: ['fieldType', 'dataType', 'type', 'defaultValueDataType', 'defaultValueGuid',
            'valueDataType', 'valueGuid'],
        bodyCssClass: 'slds-scrollable_none',
        factory: {
            propertyEditor: createScreenWithFields,
            closePropertyEditor: createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor,
            uiToFlow: createScreenMetadataObject,
            flowToUi: createScreenWithFieldReferences
        }
    },

    [ELEMENT_TYPE.DECISION]: {
        descriptor: 'builder_platform_interaction:decisionEditor',
        nodeConfig: {
            iconName: 'standard:decision',
            utilityIconName: 'utility:signpost',
            dragImageSrc: ICONS_LARGE.DECISION,
            maxConnections: 1
        },
        modalSize: MODAL_SIZE.LARGE,
        metadataKey: METADATA_KEY.DECISIONS,
        labels: {
            singular: LABELS.decisionSingularLabel,
            plural: LABELS.decisionPluralLabel,
            connectorPickerHeaderSuffix: LABELS.decisionConnectorPickerHeaderSuffix,
            connectorPickerBodyText: LABELS.decisionConnectorPickerBodyText,
            comboBoxLabel: LABELS.decisionConnectorPickerComboBoxLabel
        },
        canvasElement: true,
        canHaveDefaultConnector: true,
        factory: {
            propertyEditor: createDecisionWithOutcomes,
            closePropertyEditor: createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor,
            uiToFlow: createDecisionMetadataObject,
            flowToUi: createDecisionWithOutcomeReferences
        }
    },

    [ELEMENT_TYPE.WAIT]: {
        descriptor: 'builder_platform_interaction:waitEditor',
        nodeConfig: {
            iconName: 'standard:waits',
            utilityIconName: 'utility:waits',
            dragImageSrc: ICONS_LARGE.WAIT
        },
        modalSize: MODAL_SIZE.LARGE,
        metadataKey: METADATA_KEY.WAITS,
        labels: {
            singular: LABELS.waitSingularLabel,
            plural: LABELS.waitPluralLabel,
            connectorPickerHeaderSuffix: LABELS.waitConnectorPickerHeaderSuffix,
            connectorPickerBodyText: LABELS.waitConnectorPickerBodyText,
            comboBoxLabel: LABELS.waitConnectorPickerComboBoxLabel
        },
        canvasElement: true,
        canHaveDefaultConnector: true,
        factory: {
            propertyEditor: createWaitWithWaitEvents,
            closePropertyEditor: createWaitWithWaitEventReferencesWhenUpdatingFromPropertyEditor,
            uiToFlow: createWaitMetadataObject,
            flowToUi: createWaitWithWaitEventReferences
        }
    },

    [ELEMENT_TYPE.WAIT_EVENT]: {
        // WAIT_EVENT is not a canvas element, but is a first class element
        nodeConfig: {
            iconName: 'standard:waits',
            utilityIconName: 'utility:waits',
        },
        labels: {
            singular: LABELS.waitEventSingularLabel,
            plural: LABELS.waitEventPluralLabel
        },
        isChildElement: true,
        factory: {
            propertyEditor: createWaitEvent
        }
    },

    [ELEMENT_TYPE.LOOP]: {
        descriptor: 'builder_platform_interaction:loopEditor',
        nodeConfig: {
            iconName: 'standard:loop',
            utilityIconName: 'utility:loop',
            dragImageSrc: ICONS_LARGE.LOOP,
            maxConnections: 2
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.LOOPS,
        labels: {
            singular: LABELS.loopSingularLabel,
            plural: LABELS.loopPluralLabel,
            connectorPickerHeaderSuffix: LABELS.loopConnectorPickerHeaderSuffix,
            connectorPickerBodyText: LABELS.loopConnectorPickerBodyText,
            comboBoxLabel: LABELS.loopConnectorPickerComboBoxLabel
        },
        canvasElement: true,
        factory: {
            propertyEditor: createLoop,
            uiToFlow: createLoopMetadataObject,
            flowToUi: createLoopWithConnectors
        }
    },
    [ELEMENT_TYPE.RECORD_CREATE]: {
        descriptor: 'builder_platform_interaction:recordCreateEditor',
        nodeConfig: {
            iconName: 'standard:record_create',
            utilityIconName: 'utility:record_create',
            dragImageSrc: ICONS_LARGE.RECORD_CREATE,
            maxConnections: 2
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.RECORD_CREATES,
        labels: {
            singular: LABELS.recordCreateSingularLabel,
            plural: LABELS.recordCreatePluralLabel
        },
        canvasElement: true,
        canHaveFaultConnector: true,
        nonHydratableProperties: ['numberRecordsToStore'],
        factory: {
            propertyEditor: createRecordCreate,
            uiToFlow: createRecordCreateMetadataObject,
            flowToUi: createRecordCreateWithConnectors
        }
    },
    [ELEMENT_TYPE.RECORD_LOOKUP]: {
        descriptor: 'builder_platform_interaction:recordLookupEditor',
        nodeConfig: {
            iconName: 'standard:record_lookup',
            utilityIconName: 'utility:record_lookup',
            dragImageSrc: ICONS_LARGE.RECORD_LOOKUP,
            maxConnections: 2
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.RECORD_LOOKUPS,
        labels: {
            singular: LABELS.recordLookupSingularLabel,
            plural: LABELS.recordLookupPluralLabel
        },
        canvasElement: true,
        canHaveFaultConnector: true,
        nonHydratableProperties: ['numberRecordsToStore'],
        factory: {
            propertyEditor: createRecordLookup,
            uiToFlow: createRecordLookupMetadataObject,
            flowToUi: createRecordLookupWithConnectors
        }
    },
    [ELEMENT_TYPE.RECORD_DELETE]: {
        // TODO: recordEditor is only a place holder now.
        descriptor: 'builder_platform_interaction:recordDeleteEditor',
        nodeConfig: {
            iconName: 'standard:record_delete',
            utilityIconName: 'utility:record_delete',
            dragImageSrc: ICONS_LARGE.RECORD_DELETE,
            maxConnections: 2
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.RECORD_DELETES,
        labels: {
            singular: LABELS.recordDeleteSingularLabel,
            plural: LABELS.recordDeletePluralLabel
        },
        canvasElement: true,
        canHaveFaultConnector: true,
        factory: {
            propertyEditor: createRecordDelete,
            uiToFlow: createRecordDeleteMetadataObject,
            flowToUi: createRecordDeleteWithConnectors
        }
    },
    [ELEMENT_TYPE.RECORD_UPDATE]: {
        descriptor: 'builder_platform_interaction:recordUpdateEditor',
        nodeConfig: {
            iconName: 'standard:record_update',
            utilityIconName: 'utility:record_update',
            dragImageSrc: ICONS_LARGE.RECORD_UPDATE,
            maxConnections: 2
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.RECORD_UPDATES,
        labels: {
            singular: LABELS.recordUpdateSingularLabel,
            plural: LABELS.recordUpdatePluralLabel
        },
        canvasElement: true,
        canHaveFaultConnector: true,
        factory: {
            propertyEditor: createRecordUpdate,
            uiToFlow: createRecordUpdateMetadataObject,
            flowToUi: createRecordUpdateWithConnectors
        }
    },
    [ELEMENT_TYPE.OUTCOME]: {
        // OUTCOME is not a canvas element, but is a first class element
        nodeConfig: {
            iconName: 'standard:outcome',
            utilityIconName: 'utility:outcome'
        },
        labels: {
            singular: LABELS.outcomeSingularLabel,
            plural: LABELS.outcomePluralLabel
        },
        isChildElement: true,
        factory: {
            propertyEditor: createOutcome
        }
    },
    [ELEMENT_TYPE.VARIABLE]: {
        descriptor: 'builder_platform_interaction:variableConstantEditor',
        nodeConfig: {
            iconName: 'standard:variable',
            utilityIconName: 'utility:variable'
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.VARIABLES,
        labels: {
            singular: LABELS.variableSingularLabel,
            plural: LABELS.variablePluralLabel
        },
        canvasElement: false,
        factory: {
            propertyEditor: createVariable,
            uiToFlow: createVariableMetadataObject,
            flowToUi: createVariableForStore
        }
    },
    [ELEMENT_TYPE.CHOICE]: {
        descriptor: 'builder_platform_interaction:choiceEditor',
        nodeConfig: {
            iconName: 'standard:choice',
            utilityIconName: 'utility:choice'
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.CHOICES,
        labels: {
            singular: LABELS.choiceSingularLabel,
            plural: LABELS.choicePluralLabel
        },
        canvasElement: false,
        factory: {
            propertyEditor: createChoice,
            uiToFlow: createChoiceMetadataObject,
            flowToUi: createChoiceForStore
        }
    },
    [ELEMENT_TYPE.RECORD_CHOICE_SET]: {
        descriptor: 'builder_platform_interaction:recordChoiceSetEditor',
        nodeConfig: {
            iconName: 'standard:dynamic_record_choice',
            utilityIconName: 'utility:dynamic_record_choice'
        },
        modalSize: MODAL_SIZE.MEDIUM,
        labels: {
            singular: LABELS.recordChoiceSetSingularLabel,
            plural: LABELS.recordChoiceSetPluralLabel
        },
        canvasElement: false,
        metadataKey: METADATA_KEY.DYNAMIC_CHOICE_SETS,
        factory: {
            propertyEditor: createRecordChoiceSet,
            uiToFlow: createRecordChoiceSetMetadataObject,
            flowToUi: dynamicChoiceSetForStore
        }
    },
    [ELEMENT_TYPE.PICKLIST_CHOICE_SET]: {
        descriptor: 'builder_platform_interaction:picklistChoiceSetEditor',
        nodeConfig: {
            iconName: 'standard:picklist_choice',
            utilityIconName: 'utility:picklist_choice'
        },
        modalSize: MODAL_SIZE.MEDIUM,
        labels: {
            singular: LABELS.picklistChoiceSetSingularLabel,
            plural: LABELS.picklistChoiceSetPluralLabel
        },
        canvasElement: false,
        metadataKey: METADATA_KEY.DYNAMIC_CHOICE_SETS,
        factory: {
            propertyEditor: createPicklistChoiceSet,
            uiToFlow: createPicklistChoiceSetMetadataObject,
            flowToUi: dynamicChoiceSetForStore
        }
    },
    [ELEMENT_TYPE.CONSTANT]: {
        descriptor: 'builder_platform_interaction:variableConstantEditor',
        nodeConfig: {
            iconName: 'standard:constant',
            utilityIconName: 'utility:constant'
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.CONSTANTS,
        labels: {
            singular: LABELS.constantSingularLabel,
            plural: LABELS.constantPluralLabel
        },
        canvasElement: false,
        factory: {
            propertyEditor: createConstant,
            uiToFlow: createConstantMetadataObject,
            flowToUi: createConstantForStore
        }
    },
    [ELEMENT_TYPE.FORMULA]: {
        descriptor: 'builder_platform_interaction:formulaEditor',
        nodeConfig: {
            iconName: 'standard:formula',
            utilityIconName: 'utility:formula'
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.FORMULAS,
        labels: {
            singular: LABELS.formulaSingularLabel,
            plural: LABELS.formulaPluralLabel
        },
        canvasElement: false,
        factory: {
            propertyEditor: createFormula,
            uiToFlow: createFormulaMetadataObject,
            flowToUi: createFormulaForStore
        }
    },
    [ELEMENT_TYPE.TEXT_TEMPLATE]: {
        descriptor: 'builder_platform_interaction:textTemplateEditor',
        nodeConfig: {
            iconName: 'standard:text_template',
            utilityIconName: 'utility:text_template'
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.TEXT_TEMPLATES,
        labels: {
            singular: LABELS.textTemplateSingularLabel,
            plural: LABELS.textTemplatePluralLabel
        },
        canvasElement: false,
        factory: {
            propertyEditor: createTextTemplate,
            uiToFlow: createTextTemplateMetadataObject,
            flowToUi: createTextTemplateForStore
        }
    },
    [ELEMENT_TYPE.STAGE]: {
        descriptor: 'builder_platform_interaction:stageEditor',
        nodeConfig: {
            iconName: 'standard:stage',
            utilityIconName: 'utility:stage'
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.STAGES,
        labels: {
            singular: LABELS.stageSingularLabel,
            plural: LABELS.stagePluralLabel
        },
        canvasElement: false,
        factory: {
            propertyEditor: createStage,
            uiToFlow: createStageMetadataObject,
            flowToUi: createStageForStore
        }
    },
    [ELEMENT_TYPE.STEP]: {
        descriptor: 'builder_platform_interaction:stepEditor',
        nodeConfig: {
            iconName: 'standard:steps',
            utilityIconName: 'utility:steps',
            maxConnections: -1
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.STEPS,
        labels: {
            singular: LABELS.stepSingularLabel,
            plural: LABELS.stepPluralLabel
        },
        canvasElement: true,
        bodyCssClass: 'slds-p-around_none',
        factory: {
            propertyEditor: createStep,
            uiToFlow: createStepMetadataObject,
            flowToUi: createStepWithConnectorsForStore
        }
    },
    [ELEMENT_TYPE.SCREEN_FIELD]: {
        // SCREEN FIELD is not a canvas element, but is a first class element
        nodeConfig: {
            iconName: 'standard:display_text',
            utilityIconName: 'utility:display_text'
        },
        labels: {
            singular: LABELS.screenFieldSingularLabel,
            plural: LABELS.screenFieldPluralLabel
        },
        isChildElement: true,
        factory: {
            propertyEditor: createScreenField
        }
    },
    [ELEMENT_TYPE.DEFAULT]: {
        // defaultEditor doesn't exist but should lead here making it easier to debug the issue
        descriptor: 'builder_platform_interaction:defaultEditor',
        nodeConfig: {
            iconName: 'standard:custom',
            maxConnections: 1
        },
        bodyCssClass: '',
    }
};


/**
 * @param {string}
 *            elementType - String value to choose the actual component from the
 *            map, if empty, default element is chosen
 * @returns {object} Object containing component config
 */
export function getConfigForElementType(elementType) {
    if (
        elementType === null ||
        elementType === undefined ||
        !elementTypeToConfigMap[elementType]
    ) {
        elementType = ELEMENT_TYPE.DEFAULT;
    }
    return elementTypeToConfigMap[elementType];
}

/**
 * Checks if the given element type is an element that is visible on the canvas.
 *
 * @param {String}
 *            elementType one of the values defined in ELEMENT_TYPE
 * @returns {boolean} true if the given element type is a canvas element
 */
export function isCanvasElement(elementType) {
    return !!getConfigForElementType(elementType).canvasElement;
}

/**
 * Checks if the given element type is an top level element or not
 *
 * @param {String}
 *            elementType one of the values defined in ELEMENT_TYPE
 * @returns {boolean} true if the given element type is a top level element or not.
 */
export function isChildElement(elementType) {
    return !!getConfigForElementType(elementType).isChildElement;
}

/**
 * Determines category for display.
 *
 * @param {String}
 *            elementType the element type of an element
 * @param {String}
 *            dataType the datatype of an element
 * @param {Boolean}
 *            isCollection whether or not that element is a collection
 * @returns {String} the full category label for this element
 */
export function getElementCategory(elementType, dataType, isCollection) {
    let categoryLabel;
    if (dataType !== SOBJECT_TYPE && !isCollection) {
        const config = getConfigForElementType(elementType);
        if (config && config.labels && config.labels.plural) {
            categoryLabel = config.labels.plural;
        }
    } else {
        categoryLabel = (dataType === SOBJECT_TYPE) ? (isCollection ? LABELS.sObjectCollectionVariablePluralLabel
            : LABELS.sObjectVariablePluralLabel)
            : LABELS.collectionVariablePluralLabel;
    }

    return categoryLabel;
}
