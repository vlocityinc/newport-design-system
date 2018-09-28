import { deepCopy, generateGuid } from "builder_platform_interaction/storeLib";
import { ACTION_TYPE, CONDITION_LOGIC, METADATA_KEY, ELEMENT_TYPE, CONNECTOR_TYPE } from "builder_platform_interaction/flowMetadata";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { LABELS } from "./elementConfigLabels";

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
        canvasElement: false
    },
    [ELEMENT_TYPE.START_ELEMENT]: {
        nodeConfig: {
            iconName: 'utility:right',
            maxConnections: 1
        },
        canvasElement: true
    },
    [ELEMENT_TYPE.SUBFLOW]: {
        descriptor: 'builder_platform_interaction:actioncallEditor',
        nodeConfig: {
            iconName: 'standard:flow',
            utilityIconName: 'utility:flow',
            maxConnections: 2
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.SUBFLOWS,
        labels: {
            singular: LABELS.subflowSingularLabel,
            plural: LABELS.subflowPluralLabel
        },
        canvasElement: true,
        canHaveFaultConnector: true,
        template: {
            config: { isSelected: false },
            availableConnections: [
                {
                    type: CONNECTOR_TYPE.REGULAR
                },
                {
                    type: CONNECTOR_TYPE.FAULT
                }
            ],
            connectorCount: 0,
            elementType: ELEMENT_TYPE.SUBFLOW,
            flowName: '',
            guid: '',
            isCanvasElement: true,
            label: '',
            locationX: 0,
            locationY: 0,
            name: ''
        }
    },
    [ELEMENT_TYPE.ACTION_CALL]: {
        descriptor: 'builder_platform_interaction:actioncallEditor',
        nodeConfig: {
            iconName: 'standard:custom_notification',
            utilityIconName: 'utility:fallback',
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
        canHaveFaultConnector: true,
        template: {
            config: { isSelected: false },
            availableConnections: [
                {
                    type: CONNECTOR_TYPE.REGULAR
                },
                {
                    type: CONNECTOR_TYPE.FAULT
                }
            ],
            connectorCount: 0,
            elementType: ELEMENT_TYPE.ACTION_CALL,
            actionName: '',
            actionType: '',
            guid: '',
            isCanvasElement: true,
            label: '',
            locationX: 0,
            locationY: 0,
            name: ''
        }
    },
    [ELEMENT_TYPE.APEX_PLUGIN_CALL]: {
        descriptor: 'builder_platform_interaction:actioncallEditor',
        nodeConfig: {
            iconName: 'standard:apex_plugin',
            utilityIconName: 'utility:apex_plugin',
            maxConnections: 2
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.APEX_PLUGIN_CALLS,
        labels: {
            singular: LABELS.apexPluginSingularLabel,
            plural: LABELS.apexPluginPluralLabel
        },
        canvasElement: true,
        canHaveFaultConnector: true,
        template: {
            config: { isSelected: false },
            availableConnections: [
                {
                    type: CONNECTOR_TYPE.REGULAR
                },
                {
                    type: CONNECTOR_TYPE.FAULT
                }
            ],
            connectorCount: 0,
            elementType: ELEMENT_TYPE.APEX_PLUGIN_CALL,
            apexClass: '',
            guid: '',
            isCanvasElement: true,
            label: '',
            locationX: 0,
            locationY: 0,
            name: ''
        }
    },
    [ELEMENT_TYPE.APEX_CALL]: {
        descriptor: 'builder_platform_interaction:actioncallEditor',
        nodeConfig: {
            iconName: 'standard:apex',
            utilityIconName: 'utility:apex',
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
        canHaveFaultConnector: true,
        template: {
            config: { isSelected: false },
            availableConnections: [
                {
                    type: CONNECTOR_TYPE.REGULAR
                },
                {
                    type: CONNECTOR_TYPE.FAULT
                }
            ],
            connectorCount: 0,
            elementType: ELEMENT_TYPE.APEX_CALL,
            actionName: '',
            actionType: '',
            guid: '',
            isCanvasElement: true,
            label: '',
            locationX: 0,
            locationY: 0,
            name: ''
        }
    },
    [ELEMENT_TYPE.EMAIL_ALERT]: {
        descriptor: 'builder_platform_interaction:actioncallEditor',
        nodeConfig: {
            iconName: 'standard:email',
            utilityIconName: 'utility:email',
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
        canHaveFaultConnector: true,
        template: {
            config: { isSelected: false },
            availableConnections: [
                {
                    type: CONNECTOR_TYPE.REGULAR
                },
                {
                    type: CONNECTOR_TYPE.FAULT
                }
            ],
            connectorCount: 0,
            elementType: ELEMENT_TYPE.EMAIL_ALERT,
            actionName: '',
            actionType: '',
            guid: '',
            isCanvasElement: true,
            label: '',
            locationX: 0,
            locationY: 0,
            name: ''
        }
    },
    [ELEMENT_TYPE.ASSIGNMENT]: {
        descriptor: 'builder_platform_interaction:assignmentEditor',
        nodeConfig: {
            iconName: 'standard:assignment',
            utilityIconName: 'utility:assignment',
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
        template: {
            assignmentItems: [
                {
                    assignToReference: '',
                    operator: ''
                }
            ],
            config: { isSelected: false },
            connectorCount: 0,
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            guid: '',
            isCanvasElement: true,
            label: '',
            locationX: 0,
            locationY: 0,
            name: ''
        }
    },

    [ELEMENT_TYPE.SCREEN]: {
        descriptor: 'builder_platform_interaction:screenEditor',
        nodeConfig: {
            iconName: 'standard:screen',
            utilityIconName: 'utility:screen',
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
            'valueDataType', 'valueGuid', 'assignToReferenceDataType', 'assignToReferenceGuid', 'choiceReferences'],
        bodyCssClass: 'slds-scrollable_none',
        template: {
            guid: '',
            config: { isSelected: false },
            connectorCount: 0,
            elementType: ELEMENT_TYPE.SCREEN,
            isCanvasElement: true,
            label: '',
            locationX: 0,
            locationY: 0,
            name: '',
            allowBack: true,
            allowFinish: true,
            allowPause: true,
            description: '',
            helpText: '',
            pausedText: '',
            showFooter: true,
            showHeader: true,
            rules: [],
            fields: []
        }
    },

    [ELEMENT_TYPE.DECISION]: {
        descriptor: 'builder_platform_interaction:decisionEditor',
        nodeConfig: {
            iconName: 'standard:decision',
            utilityIconName: 'utility:signpost',
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
        template: {
            config: { isSelected: false },
            connectorCount: 0,
            defaultConnectorLabel: LABELS.emptyDefaultOutcomeLabel,
            elementType: ELEMENT_TYPE.DECISION,
            guid: '',
            isCanvasElement: true,
            label: '',
            locationX: 0,
            locationY: 0,
            name: '',
            outcomeReferences: []
        }
    },

    [ELEMENT_TYPE.WAIT]: {
        descriptor: 'builder_platform_interaction:waitEditor',
        nodeConfig: {
            iconName: 'standard:waits',
            utilityIconName: 'utility:waits',
            maxConnections: 1
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
        template: {
            config: { isSelected: false },
            connectorCount: 0,
            defaultConnectorLabel: LABELS.emptyDefaultWaitPathLabel,
            elementType: ELEMENT_TYPE.WAIT,
            guid: '',
            isCanvasElement: true,
            label: '',
            locationX: 0,
            locationY: 0,
            name: '',
            waitEventReferences: []
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
        template: {
            name: '',
            label: '',
            guid: '',
            elementType: ELEMENT_TYPE.WAIT_EVENT,
            dataType: FLOW_DATA_TYPE.BOOLEAN.value,
            conditionLogic: CONDITION_LOGIC.AND,
            conditions: [
                {
                    leftValueReference: '',
                    operator: ''
                }
            ]
        }
    },

    [ELEMENT_TYPE.LOOP]: {
        descriptor: 'builder_platform_interaction:loopEditor',
        nodeConfig: {
            iconName: 'standard:loop',
            utilityIconName: 'utility:loop',
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
        template: {
            config: { isSelected: false },
            availableConnections: [
                {
                    type: CONNECTOR_TYPE.LOOP_NEXT
                },
                {
                    type: CONNECTOR_TYPE.LOOP_END
                }
            ],
            connectorCount: 0,
            elementType: ELEMENT_TYPE.LOOP,
            assignNextValueToReference: null,
            collectionReference: null,
            guid: '',
            isCanvasElement: true,
            label: '',
            locationX: 0,
            locationY: 0,
            name: ''
        }
    },
    [ELEMENT_TYPE.RECORD_CREATE]: {
        descriptor: 'builder_platform_interaction:recordCreateEditor',
        nodeConfig: {
            iconName: 'standard:record_create',
            utilityIconName: 'utility:record_create',
            maxConnections: 2
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.RECORD_CREATES,
        labels: {
            singular: LABELS.recordCreateSingularLabel,
            plural: LABELS.recordCreatePluralLabel
        },
        canvasElement: true,
        canHaveFaultConnector: true
    },
    [ELEMENT_TYPE.RECORD_LOOKUP]: {
        descriptor: 'builder_platform_interaction:recordLookupEditor',
        nodeConfig: {
            iconName: 'standard:record_lookup',
            utilityIconName: 'utility:record_lookup',
            maxConnections: 2
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.RECORD_LOOKUPS,
        labels: {
            singular: LABELS.recordLookupSingularLabel,
            plural: LABELS.recordLookupPluralLabel
        },
        canvasElement: true,
        canHaveFaultConnector: true
    },
    [ELEMENT_TYPE.RECORD_DELETE]: {
        // TODO: recordEditor is only a place holder now.
        descriptor: 'builder_platform_interaction:recordDeleteEditor',
        nodeConfig: {
            iconName: 'standard:record_delete',
            utilityIconName: 'utility:record_delete',
            maxConnections: 2
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.RECORD_DELETES,
        labels: {
            singular: LABELS.recordDeleteSingularLabel,
            plural: LABELS.recordDeletePluralLabel
        },
        canvasElement: true,
        canHaveFaultConnector: true
    },
    [ELEMENT_TYPE.RECORD_UPDATE]: {
        descriptor: 'builder_platform_interaction:recordUpdateEditor',
        nodeConfig: {
            iconName: 'standard:record_update',
            utilityIconName: 'utility:record_update',
            maxConnections: 2
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.RECORD_UPDATES,
        labels: {
            singular: LABELS.recordUpdateSingularLabel,
            plural: LABELS.recordUpdatePluralLabel
        },
        canvasElement: true,
        canHaveFaultConnector: true
    },
    [ELEMENT_TYPE.OUTCOME]: {
        // OUTCOME is not a canvas element, but is a first class element
        nodeConfig: {
            iconName: 'standard:outcome',
            utilityIconName: 'utility:outcome',
        },
        labels: {
            singular: LABELS.outcomeSingularLabel,
            plural: LABELS.outcomePluralLabel
        },
        isChildElement: true,
        template: {
            name: '',
            label: '',
            guid: '',
            elementType: ELEMENT_TYPE.OUTCOME,
            dataType: FLOW_DATA_TYPE.BOOLEAN.value,
            conditionLogic: CONDITION_LOGIC.AND,
            conditions: [
                {
                    leftValueReference: '',
                    operator: ''
                }
            ]
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
        template: {
            name: '',
            label: undefined,
            guid: '',
            elementType: ELEMENT_TYPE.VARIABLE,
            dataType: null,
            isCollection: false,
            isInput: false,
            isOutput: false,
            objectType: null,
            scale: null,
        },
        canvasElement: false
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
        canvasElement: false
    },
    [ELEMENT_TYPE.RECORD_CHOICE_GROUP]: {
        descriptor: 'builder_platform_interaction:choiceEditor',
        nodeConfig: {
            iconName: 'standard:choice',
            utilityIconName: 'utility:choice'
        },
        modalSize: MODAL_SIZE.MEDIUM,
        labels: {
            singular:'Record Choice Group',
            plural: 'Record Choice Groups'
        },
        canvasElement: false,
        metadataKey: METADATA_KEY.DYNAMIC_CHOICE_SETS
    },
    [ELEMENT_TYPE.PICKLIST_CHOICE_GROUP]: {
        descriptor: 'builder_platform_interaction:choiceEditor',
        nodeConfig: {
            iconName: 'standard:choice',
            utilityIconName: 'utility:choice'
        },
        modalSize: MODAL_SIZE.MEDIUM,
        labels: {
            singular: 'Picklist Choice Group',
            plural: 'Picklist Choice Groups'
        },
        canvasElement: false,
        metadataKey: METADATA_KEY.DYNAMIC_CHOICE_SETS
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
        template: {
            name: '',
            label: undefined,
            guid: '',
            elementType: ELEMENT_TYPE.CONSTANT,
            dataType: null
        },
        canvasElement: false
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
        template: {
            name: '',
            label: undefined,
            guid: '',
            elementType: ELEMENT_TYPE.FORMULA,
            dataType: null,
            scale: null,
            expression: ''
        },
        canvasElement: false
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
        template: {
            name: '',
            label: undefined,
            guid: '',
            elementType: ELEMENT_TYPE.TEXT_TEMPLATE,
            text: ''
        },
        canvasElement: false
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
        template: {
            name: '',
            label: '',
            guid: '',
            elementType: ELEMENT_TYPE.STAGE,
            stageOrder: null,
            isActive: false
        },
        canvasElement: false
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
        bodyCssClass: 'slds-p-around_none'
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
 * Gets an empty instance of the given element type.
 *
 * @param {String}
 *            elementType an element type such as 'ASSIGNMENT'
 * @param {Boolean}
 *            hasConnections defaults to true and indicates
 * @returns {Object} an empty element of the given elementType
 */
export function createFlowElement(elementType, hasConnections = true) {
    const config = elementTypeToConfigMap[elementType];
    if (!config) {
        throw new TypeError();
    } else if (!config.template) {
        throw new Error('Template not defined for ' + elementType);
    }
    const template = deepCopy(config.template);
    template.guid = generateGuid(elementType);
    // TODO: is an explicit param necessary or can we just go off the presence of nodeConfig.maxConnections?
    // Would that work for elements with dynamic maxConnection count (like Decisions)?
    if (hasConnections) {
        template.maxConnections = config.nodeConfig.maxConnections;
    }

    return template;
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
