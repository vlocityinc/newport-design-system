import {
    ACTION_TYPE,
    METADATA_KEY,
    ELEMENT_TYPE,
    COLLECTION_PROCESSOR_SUB_TYPE,
    FLOW_TRIGGER_TYPE
} from 'builder_platform_interaction/flowMetadata';
import { ICONS_LARGE } from 'builder_platform_interaction/imageLib';
import { LABELS } from './elementConfigLabels';
import { AddElementEvent, EditElementEvent } from 'builder_platform_interaction/events';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import {
    createActionCall,
    createDuplicateActionCall,
    createApexPlugin,
    createDuplicateApexPlugin,
    createAssignment,
    createDuplicateAssignment,
    createChoice,
    createConstant,
    createFlowProperties,
    createFormula,
    createLoop,
    createDuplicateLoop,
    createDecisionWithOutcomes,
    createWaitWithWaitEvents,
    createVariable,
    createTextTemplate,
    createRecordCreate,
    createDuplicateRecordCreate,
    createRecordUpdate,
    createDuplicateRecordUpdate,
    createRecordLookup,
    createDuplicateRecordLookup,
    createRecordDelete,
    createDuplicateRecordDelete,
    createSubflow,
    createDuplicateSubflow,
    createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor,
    createDuplicateDecision,
    createWaitWithWaitEventReferencesWhenUpdatingFromPropertyEditor,
    createDuplicateWait,
    createStage,
    createStep,
    createPicklistChoiceSet,
    createRecordChoiceSet,
    createStartElementForPropertyEditor,
    createStartElement,
    createApexCall,
    createDuplicateApexCall,
    createEmailAlert,
    createDuplicateEmailAlert,
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
    createStartElementWhenUpdatingFromPropertyEditor,
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
    createDuplicateScreen,
    createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor,
    createScreenWithFieldReferences,
    createScreenField,
    createStartElementMetadataObject,
    createPastedScreen,
    createPastedDecision,
    createPastedWait,
    createPastedAssignment,
    createPastedSubflow,
    createPastedRecordCreate,
    createPastedRecordDelete,
    createPastedRecordLookup,
    createPastedRecordUpdate,
    createPastedActionCall,
    createPastedApexCall,
    createPastedApexPlugin,
    createPastedEmailAlert,
    createPastedLoop,
    createCollectionProcessor,
    createPastedCollectionProcessor,
    createDuplicateCollectionProcessor,
    createCollectionProcessorMetadataObject,
    createCollectionProcessorWithConnectors,
    createOrchestratedStageMetadataObject,
    createOrchestratedStageWithItems,
    createOrchestratedStageWithItemReferencesWhenUpdatingFromPropertyEditor,
    createOrchestratedStageWithItemReferences,
    getSteps,
    createStageStep,
    createPastedOrchestratedStage,
    createDuplicateOrchestratedStage
} from 'builder_platform_interaction/elementFactory';

export const EDIT_START_SCHEDULE_CONTEXT = 'editStartScheduleContext';
export const EDIT_START_RECORD_CHANGE_CONTEXT = 'editStartRecordChangeContext';
export const EDIT_START_JOURNEY_CONTEXT = 'editStartJourneyContext';
export const EDIT_START_TIME_TRIGGERS = 'editStartTimeTriggers';

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
 * @constant
 * @type {string} ICON_SHAPE diamond, circle, or square (default)
 */
export const ICON_SHAPE = {
    DIAMOND: 'diamond', // Example, Decision
    CIRCLE: 'circle', // Example, Start Element
    SQUARE: 'square'
};

/**
 * @constant elementTypeToComponentMap - Map of different element types to their
 *                                       respective components
 * @type {object}
 */
export const elementTypeToConfigMap: {
    [p: string]: UI.ElementConfig;
} = {
    [ELEMENT_TYPE.FLOW_PROPERTIES]: {
        descriptor: 'builder_platform_interaction:flowPropertiesEditor',
        modalSize: MODAL_SIZE.MEDIUM,
        nodeConfig: {
            iconName: 'utility:settings'
        },
        labels: {
            singular: LABELS.flowPropertiesSingularLabel,
            editModal: LABELS.editFlowProperties
        },
        canvasElement: false,
        factory: {
            propertyEditor: createFlowPropertiesForEditor,
            uiToFlow: createFlowPropertiesMetadataObject,
            flowToUi: createFlowProperties
        }
    },
    [ELEMENT_TYPE.START_ELEMENT]: {
        descriptor: {
            [FLOW_TRIGGER_TYPE.BEFORE_SAVE]: 'builder_platform_interaction:recordChangeTriggerEditor',
            [FLOW_TRIGGER_TYPE.BEFORE_DELETE]: 'builder_platform_interaction:recordChangeTriggerEditor',
            [FLOW_TRIGGER_TYPE.AFTER_SAVE]: 'builder_platform_interaction:recordChangeTriggerEditor',
            [FLOW_TRIGGER_TYPE.SCHEDULED]: 'builder_platform_interaction:scheduleTriggerEditor',
            [FLOW_TRIGGER_TYPE.SCHEDULED_JOURNEY]: 'builder_platform_interaction:scheduleTriggerEditor',
            [FLOW_TRIGGER_TYPE.PLATFORM_EVENT]: 'builder_platform_interaction:platformEventEditor',
            [EDIT_START_RECORD_CHANGE_CONTEXT]: 'builder_platform_interaction:contextRecordEditor',
            [EDIT_START_SCHEDULE_CONTEXT]: 'builder_platform_interaction:contextRecordEditor',
            [EDIT_START_JOURNEY_CONTEXT]: 'builder_platform_interaction:contextRecordEditor',
            [EDIT_START_TIME_TRIGGERS]: 'builder_platform_interaction:timeTriggersEditor'
        },
        modalSize: MODAL_SIZE.LARGE,
        nodeConfig: {
            iconName: 'utility:right',
            iconShape: ICON_SHAPE.CIRCLE,
            iconSize: 'medium',
            iconBackgroundColor: 'background-green',
            canBeConnectorTarget: false,
            maxConnections: 1
        },
        canvasElement: true,
        nonHydratableProperties: ['childReferences'],
        isDeletable: false,
        canBeDuplicated: false,
        metadataKey: METADATA_KEY.START,
        factory: {
            initialization: createStartElement,
            propertyEditor: createStartElementForPropertyEditor,
            flowToUi: createStartElementWithConnectors,
            uiToFlow: createStartElementMetadataObject,
            closePropertyEditor: createStartElementWhenUpdatingFromPropertyEditor
        },
        labels: {
            singular: LABELS.startElementSingularLabel,
            newModal: LABELS.editStartElementLabel,
            editModal: LABELS.editStartElementLabel,
            editTrigger: LABELS.editTriggerLabel,
            editSchedule: LABELS.editScheduleLabel,
            editPlatform: LABELS.editPlatformLabel,
            editObject: LABELS.editObjectLabel,
            editTriggerObjectLabel: LABELS.editTriggerObjectLabel,
            editObjectAndFiltersLabel: LABELS.editObjectAndFiltersLabel,
            editTimeTrigger: LABELS.editTimeTriggerLabel,
            connectorPickerHeader: LABELS.startConnectorPickerHeader,
            comboBoxLabel: LABELS.startConnectorPickerComboBoxLabel,
            connectorPickerBodyText: LABELS.startConnectorPickerBodyText
        }
    },
    [ELEMENT_TYPE.SUBFLOW]: {
        descriptor: {
            [EditElementEvent.EVENT_NAME]: 'builder_platform_interaction:subflowEditor',
            [AddElementEvent.EVENT_NAME]: 'builder_platform_interaction:callOutEditor'
        },
        nodeConfig: {
            iconName: 'standard:flow',
            utilityIconName: 'utility:flow',
            dragImageSrc: ICONS_LARGE[ELEMENT_TYPE.SUBFLOW],
            iconBackgroundColor: 'background-navy',
            maxConnections: 2,
            section: LABELS.flowInteractionComponentsLabel,
            description: LABELS.subflowFlowComponentDescription
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.SUBFLOWS,
        labels: {
            singular: LABELS.subflowSingularLabel,
            plural: LABELS.subflowPluralLabel,
            leftPanel: LABELS.subflowFlowComponentLabel,
            newModal: LABELS.newSubflowLabel,
            editModal: LABELS.editSubflowLabel
        },
        canvasElement: true,
        nonHydratableProperties: ['valueDataType'],
        factory: {
            propertyEditor: createSubflow,
            pasteElement: createPastedSubflow,
            duplicateElement: createDuplicateSubflow,
            uiToFlow: createSubflowMetadataObject,
            flowToUi: createSubflowWithConnectors
        }
    },
    [ELEMENT_TYPE.ACTION_CALL]: {
        descriptor: {
            [EditElementEvent.EVENT_NAME]: 'builder_platform_interaction:invocableActionEditor',
            [AddElementEvent.EVENT_NAME]: 'builder_platform_interaction:callOutEditor'
        },
        nodeConfig: {
            iconName: 'standard:custom_notification',
            utilityIconName: 'utility:fallback',
            dragImageSrc: ICONS_LARGE[ELEMENT_TYPE.ACTION_CALL],
            iconBackgroundColor: 'background-navy',
            maxConnections: 2,
            section: LABELS.flowInteractionComponentsLabel,
            description: LABELS.actionFlowComponentDescription
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.ACTION_CALLS,
        // action call : standard actions and quickactions
        metadataFilter: (element) =>
            element.actionType !== ACTION_TYPE.EMAIL_ALERT &&
            element.actionType !== ACTION_TYPE.APEX &&
            element.actionType !== ACTION_TYPE.FLOW,
        labels: {
            singular: LABELS.actionSingularLabel,
            plural: LABELS.actionPluralLabel,
            leftPanel: LABELS.actionFlowComponentLabel,
            newModal: LABELS.newActionLabel,
            editModal: LABELS.editActionLabel
        },
        canvasElement: true,
        nonHydratableProperties: ['valueDataType'],
        canHaveFaultConnector: true,
        factory: {
            propertyEditor: createActionCall,
            pasteElement: createPastedActionCall,
            duplicateElement: createDuplicateActionCall,
            uiToFlow: createActionCallMetadataObject,
            flowToUi: createActionCallForStore
        }
    },
    [ELEMENT_TYPE.EXTERNAL_SERVICE]: {
        descriptor: {
            [EditElementEvent.EVENT_NAME]: 'builder_platform_interaction:invocableActionEditor',
            [AddElementEvent.EVENT_NAME]: 'builder_platform_interaction:callOutEditor'
        },
        nodeConfig: {
            iconName: 'standard:custom_notification',
            utilityIconName: 'utility:fallback',
            dragImageSrc: ICONS_LARGE[ELEMENT_TYPE.ACTION_CALL],
            iconBackgroundColor: 'background-navy',
            maxConnections: 2
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.ACTION_CALLS,
        metadataFilter: (element) => element.actionType === ACTION_TYPE.EXTERNAL_SERVICE,
        labels: {
            singular: LABELS.actionSingularLabel,
            plural: LABELS.actionPluralLabel,
            newModal: LABELS.newActionLabel,
            editModal: LABELS.editActionLabel
        },
        canvasElement: true,
        nonHydratableProperties: ['valueDataType'],
        canHaveFaultConnector: true,
        factory: {
            propertyEditor: createActionCall,
            pasteElement: createPastedActionCall,
            duplicateElement: createDuplicateActionCall,
            uiToFlow: createActionCallMetadataObject,
            flowToUi: createActionCallForStore
        }
    },
    [ELEMENT_TYPE.APEX_PLUGIN_CALL]: {
        descriptor: {
            [EditElementEvent.EVENT_NAME]: 'builder_platform_interaction:apexPluginEditor',
            [AddElementEvent.EVENT_NAME]: 'builder_platform_interaction:callOutEditor'
        },
        nodeConfig: {
            iconName: 'standard:apex_plugin',
            utilityIconName: 'utility:apex_plugin',
            dragImageSrc: ICONS_LARGE[ELEMENT_TYPE.APEX_PLUGIN_CALL],
            iconBackgroundColor: 'background-navy',
            maxConnections: 2
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.APEX_PLUGIN_CALLS,
        labels: {
            singular: LABELS.apexPluginSingularLabel,
            plural: LABELS.apexPluginPluralLabel,
            newModal: LABELS.newApexActionPluginLabel,
            editModal: LABELS.editApexActionPluginLabel
        },
        canvasElement: true,
        nonHydratableProperties: ['valueDataType'],
        canHaveFaultConnector: true,
        factory: {
            propertyEditor: createApexPlugin,
            pasteElement: createPastedApexPlugin,
            duplicateElement: createDuplicateApexPlugin,
            uiToFlow: createApexPluginMetadataObject,
            flowToUi: createApexPluginWithConnectors
        }
    },
    [ELEMENT_TYPE.APEX_CALL]: {
        descriptor: {
            [EditElementEvent.EVENT_NAME]: 'builder_platform_interaction:invocableActionEditor',
            [AddElementEvent.EVENT_NAME]: 'builder_platform_interaction:callOutEditor'
        },
        nodeConfig: {
            iconName: 'standard:apex',
            utilityIconName: 'utility:apex',
            dragImageSrc: ICONS_LARGE[ELEMENT_TYPE.APEX_CALL],
            iconBackgroundColor: 'background-navy',
            maxConnections: 1
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.ACTION_CALLS,
        metadataFilter: (element) => element.actionType === ACTION_TYPE.APEX,
        labels: {
            singular: LABELS.apexSingularLabel,
            plural: LABELS.apexPluralLabel,
            newModal: LABELS.newApexActionLabel,
            editModal: LABELS.editApexActionLabel
        },
        canvasElement: true,
        nonHydratableProperties: ['valueDataType'],
        canHaveFaultConnector: true,
        factory: {
            propertyEditor: createApexCall,
            pasteElement: createPastedApexCall,
            duplicateElement: createDuplicateApexCall,
            uiToFlow: createActionCallMetadataObject,
            flowToUi: createActionCallForStore
        }
    },
    [ELEMENT_TYPE.EMAIL_ALERT]: {
        descriptor: {
            [EditElementEvent.EVENT_NAME]: 'builder_platform_interaction:invocableActionEditor',
            [AddElementEvent.EVENT_NAME]: 'builder_platform_interaction:callOutEditor'
        },
        nodeConfig: {
            iconName: 'standard:email',
            utilityIconName: 'utility:email',
            dragImageSrc: ICONS_LARGE[ELEMENT_TYPE.EMAIL_ALERT],
            iconBackgroundColor: 'background-navy',
            maxConnections: 1
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.ACTION_CALLS,
        metadataFilter: (element) => element.actionType === ACTION_TYPE.EMAIL_ALERT,
        labels: {
            singular: LABELS.emailAlertSingularLabel,
            plural: LABELS.emailAlertPluralLabel,
            newModal: LABELS.newEmailAlertLabel,
            editModal: LABELS.editEmailAlertLabel
        },
        canvasElement: true,
        nonHydratableProperties: ['valueDataType'],
        canHaveFaultConnector: true,
        factory: {
            propertyEditor: createEmailAlert,
            pasteElement: createPastedEmailAlert,
            duplicateElement: createDuplicateEmailAlert,
            uiToFlow: createActionCallMetadataObject,
            flowToUi: createActionCallForStore
        }
    },
    [ELEMENT_TYPE.ASSIGNMENT]: {
        descriptor: 'builder_platform_interaction:assignmentEditor',
        nodeConfig: {
            iconName: 'standard:assignment',
            utilityIconName: 'utility:assignment',
            dragImageSrc: ICONS_LARGE[ELEMENT_TYPE.ASSIGNMENT],
            maxConnections: 1,
            section: LABELS.flowControlLogicLabel,
            description: LABELS.assignmentLogicDescription
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.ASSIGNMENTS,
        labels: {
            singular: LABELS.assignmentSingularLabel,
            plural: LABELS.assignmentPluralLabel,
            leftPanel: LABELS.assignmentLogicLabel,
            newModal: LABELS.newAssignmentLabel,
            editModal: LABELS.editAssignmentLabel
        },
        canvasElement: true,
        bodyCssClass: 'slds-p-around_none',
        factory: {
            propertyEditor: createAssignment,
            pasteElement: createPastedAssignment,
            duplicateElement: createDuplicateAssignment,
            uiToFlow: createAssignmentMetadataObject,
            flowToUi: createAssignmentWithConnectors
        }
    },
    [ELEMENT_TYPE.COLLECTION_PROCESSOR]: {
        descriptor: 'builder_platform_interaction:collectionProcessorEditor',
        nodeConfig: {
            iconName: '',
            utilityIconName: '',
            dragImageSrc: ICONS_LARGE[ELEMENT_TYPE.COLLECTION_PROCESSOR],
            maxConnections: 1,
            section: LABELS.flowControlLogicLabel,
            description: ''
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.COLLECTION_PROCESSORS,
        canvasElement: true,
        nonHydratableProperties: ['elementSubtype', 'collectionProcessorType'],
        bodyCssClass: 'slds-p-around_none',
        labels: {
            singular: LABELS.collectionProcessorSingularLabel,
            plural: LABELS.collectionProcessorPluralLabel
        },
        factory: {
            propertyEditor: createCollectionProcessor,
            pasteElement: createPastedCollectionProcessor,
            duplicateElement: createDuplicateCollectionProcessor,
            uiToFlow: createCollectionProcessorMetadataObject,
            flowToUi: createCollectionProcessorWithConnectors
        }
    },
    [ELEMENT_TYPE.SCREEN]: {
        descriptor: 'builder_platform_interaction:screenEditor',
        nodeConfig: {
            iconName: 'standard:screen',
            utilityIconName: 'utility:screen',
            dragImageSrc: ICONS_LARGE[ELEMENT_TYPE.SCREEN],
            maxConnections: 1,
            section: LABELS.flowInteractionComponentsLabel,
            description: LABELS.screenComponentDescription
        },
        modalSize: MODAL_SIZE.LARGE,
        metadataKey: METADATA_KEY.SCREENS,
        labels: {
            singular: LABELS.screenSingularLabel,
            plural: LABELS.screenPluralLabel,
            leftPanel: LABELS.screenComponentLabel,
            newModal: LABELS.newScreenLabel,
            editModal: LABELS.editScreenLabel
        },
        canvasElement: true,
        areChildElementsSupported: true,
        nonHydratableProperties: [
            'fieldType',
            'dataType',
            'type',
            'defaultValueDataType',
            'defaultValueGuid',
            'valueDataType',
            'valueGuid',
            'inputsOnNextNavToAssocScrn',
            'objectFieldReference'
        ],
        bodyCssClass: 'slds-scrollable_none',
        factory: {
            propertyEditor: createScreenWithFields,
            pasteElement: createPastedScreen,
            duplicateElement: createDuplicateScreen,
            closePropertyEditor: createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor,
            uiToFlow: createScreenMetadataObject,
            flowToUi: createScreenWithFieldReferences
        }
    },

    [ELEMENT_TYPE.DECISION]: {
        descriptor: 'builder_platform_interaction:decisionEditor',
        nodeConfig: {
            iconName: 'standard:decision',
            iconShape: ICON_SHAPE.DIAMOND,
            utilityIconName: 'utility:signpost',
            dragImageSrc: ICONS_LARGE[ELEMENT_TYPE.DECISION],
            maxConnections: 1,
            section: LABELS.flowControlLogicLabel,
            description: LABELS.decisionLogicDescription
        },
        modalSize: MODAL_SIZE.LARGE,
        metadataKey: METADATA_KEY.DECISIONS,
        labels: {
            singular: LABELS.decisionSingularLabel,
            plural: LABELS.decisionPluralLabel,
            connectorPickerHeader: LABELS.decisionConnectorPickerHeader,
            connectorPickerBodyText: LABELS.decisionConnectorPickerBodyText,
            comboBoxLabel: LABELS.decisionConnectorPickerComboBoxLabel,
            leftPanel: LABELS.decisionLogicLabel,
            newModal: LABELS.newDecisionLabel,
            editModal: LABELS.editDecisionLabel
        },
        canvasElement: true,
        areChildElementsSupported: true,
        canHaveDefaultConnector: true,
        factory: {
            propertyEditor: createDecisionWithOutcomes,
            closePropertyEditor: createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor,
            pasteElement: createPastedDecision,
            duplicateElement: createDuplicateDecision,
            uiToFlow: createDecisionMetadataObject,
            flowToUi: createDecisionWithOutcomeReferences
        }
    },

    [ELEMENT_TYPE.WAIT]: {
        descriptor: 'builder_platform_interaction:waitEditor',
        nodeConfig: {
            iconName: 'standard:waits',
            utilityIconName: 'utility:waits',
            dragImageSrc: ICONS_LARGE[ELEMENT_TYPE.WAIT],
            section: LABELS.flowControlLogicLabel,
            description: LABELS.waitLogicDescription
        },
        modalSize: MODAL_SIZE.LARGE,
        metadataKey: METADATA_KEY.WAITS,
        labels: {
            singular: LABELS.waitSingularLabel,
            plural: LABELS.waitPluralLabel,
            connectorPickerHeader: LABELS.waitConnectorPickerHeader,
            connectorPickerBodyText: LABELS.waitConnectorPickerBodyText,
            comboBoxLabel: LABELS.waitConnectorPickerComboBoxLabel,
            leftPanel: LABELS.waitLogicLabel,
            newModal: LABELS.newWaitLabel,
            editModal: LABELS.editWaitLabel
        },
        canvasElement: true,
        areChildElementsSupported: true,
        canHaveDefaultConnector: true,
        canHaveFaultConnector: true,
        factory: {
            propertyEditor: createWaitWithWaitEvents,
            closePropertyEditor: createWaitWithWaitEventReferencesWhenUpdatingFromPropertyEditor,
            pasteElement: createPastedWait,
            duplicateElement: createDuplicateWait,
            uiToFlow: createWaitMetadataObject,
            flowToUi: createWaitWithWaitEventReferences
        }
    },

    [ELEMENT_TYPE.WAIT_EVENT]: {
        // WAIT_EVENT is not a canvas element, but is a first class element
        nodeConfig: {
            iconName: 'standard:waits',
            utilityIconName: 'utility:waits'
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
            dragImageSrc: ICONS_LARGE[ELEMENT_TYPE.LOOP],
            maxConnections: 2,
            section: LABELS.flowControlLogicLabel,
            description: LABELS.loopLogicDescription
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.LOOPS,
        labels: {
            singular: LABELS.loopSingularLabel,
            plural: LABELS.loopPluralLabel,
            connectorPickerHeader: LABELS.loopConnectorPickerHeader,
            connectorPickerBodyText: LABELS.loopConnectorPickerBodyText,
            comboBoxLabel: LABELS.loopConnectorPickerComboBoxLabel,
            leftPanel: LABELS.loopLogicLabel,
            newModal: LABELS.newLoopLabel,
            editModal: LABELS.editLoopLabel
        },
        canvasElement: true,
        factory: {
            propertyEditor: createLoop,
            pasteElement: createPastedLoop,
            duplicateElement: createDuplicateLoop,
            uiToFlow: createLoopMetadataObject,
            flowToUi: createLoopWithConnectors
        }
    },
    [ELEMENT_TYPE.RECORD_CREATE]: {
        descriptor: 'builder_platform_interaction:recordCreateEditor',
        nodeConfig: {
            iconName: 'standard:record_create',
            utilityIconName: 'utility:record_create',
            dragImageSrc: ICONS_LARGE[ELEMENT_TYPE.RECORD_CREATE],
            maxConnections: 2,
            section: LABELS.flowControlDataOperationsLabel,
            description: LABELS.createDataOperationDescription
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.RECORD_CREATES,
        labels: {
            singular: LABELS.recordCreateSingularLabel,
            plural: LABELS.recordCreatePluralLabel,
            leftPanel: LABELS.createDataOperationLabel,
            newModal: LABELS.newRecordCreateLabel,
            editModal: LABELS.editRecordCreateLabel
        },
        canvasElement: true,
        canHaveFaultConnector: true,
        nonHydratableProperties: ['numberRecordsToStore'],
        factory: {
            propertyEditor: createRecordCreate,
            pasteElement: createPastedRecordCreate,
            duplicateElement: createDuplicateRecordCreate,
            uiToFlow: createRecordCreateMetadataObject,
            flowToUi: createRecordCreateWithConnectors
        }
    },
    [ELEMENT_TYPE.RECORD_LOOKUP]: {
        descriptor: 'builder_platform_interaction:recordLookupEditor',
        nodeConfig: {
            iconName: 'standard:record_lookup',
            utilityIconName: 'utility:record_lookup',
            dragImageSrc: ICONS_LARGE[ELEMENT_TYPE.RECORD_LOOKUP],
            maxConnections: 2,
            section: LABELS.flowControlDataOperationsLabel,
            description: LABELS.lookupDataOperationDescription
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.RECORD_LOOKUPS,
        labels: {
            singular: LABELS.recordLookupSingularLabel,
            plural: LABELS.recordLookupPluralLabel,
            leftPanel: LABELS.lookupDataOperationLabel,
            newModal: LABELS.newRecordLookupLabel,
            editModal: LABELS.editRecordLookupLabel
        },
        canvasElement: true,
        canHaveFaultConnector: true,
        nonHydratableProperties: [
            'numberRecordsToStore',
            'sortOrder',
            'assignNullValuesIfNoRecordsFound',
            'variableAndFieldMapping'
        ],
        factory: {
            propertyEditor: createRecordLookup,
            pasteElement: createPastedRecordLookup,
            duplicateElement: createDuplicateRecordLookup,
            uiToFlow: createRecordLookupMetadataObject,
            flowToUi: createRecordLookupWithConnectors
        }
    },
    [ELEMENT_TYPE.RECORD_DELETE]: {
        descriptor: 'builder_platform_interaction:recordDeleteEditor',
        nodeConfig: {
            iconName: 'standard:record_delete',
            utilityIconName: 'utility:record_delete',
            dragImageSrc: ICONS_LARGE[ELEMENT_TYPE.RECORD_DELETE],
            maxConnections: 2,
            section: LABELS.flowControlDataOperationsLabel,
            description: LABELS.deleteDataOperationDescription
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.RECORD_DELETES,
        labels: {
            singular: LABELS.recordDeleteSingularLabel,
            plural: LABELS.recordDeletePluralLabel,
            leftPanel: LABELS.deleteDataOperationLabel,
            newModal: LABELS.newRecordDeleteLabel,
            editModal: LABELS.editRecordDeleteLabel
        },
        canvasElement: true,
        canHaveFaultConnector: true,
        factory: {
            propertyEditor: createRecordDelete,
            pasteElement: createPastedRecordDelete,
            duplicateElement: createDuplicateRecordDelete,
            uiToFlow: createRecordDeleteMetadataObject,
            flowToUi: createRecordDeleteWithConnectors
        }
    },
    [ELEMENT_TYPE.RECORD_UPDATE]: {
        descriptor: 'builder_platform_interaction:recordUpdateEditor',
        nodeConfig: {
            iconName: 'standard:record_update',
            utilityIconName: 'utility:record_update',
            dragImageSrc: ICONS_LARGE[ELEMENT_TYPE.RECORD_UPDATE],
            maxConnections: 2,
            section: LABELS.flowControlDataOperationsLabel,
            description: LABELS.updateDataOperationDescription
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.RECORD_UPDATES,
        labels: {
            singular: LABELS.recordUpdateSingularLabel,
            plural: LABELS.recordUpdatePluralLabel,
            leftPanel: LABELS.updateDataOperationLabel,
            newModal: LABELS.newRecordUpdateLabel,
            editModal: LABELS.editRecordUpdateLabel
        },
        canvasElement: true,
        canHaveFaultConnector: true,
        factory: {
            propertyEditor: createRecordUpdate,
            pasteElement: createPastedRecordUpdate,
            duplicateElement: createDuplicateRecordUpdate,
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
    [ELEMENT_TYPE.TIME_TRIGGER]: {
        // Time Trigger is not a canvas element, but is a first class element

        labels: {
            singular: LABELS.timeTriggerSingularLabel,
            plural: LABELS.timeTriggerPluralLabel
        },
        isChildElement: true
    },
    [ELEMENT_TYPE.VARIABLE]: {
        descriptor: 'builder_platform_interaction:variableConstantEditor',
        nodeConfig: {
            iconName: 'standard:variable',
            utilityIconName: 'utility:variable',
            value: 'variable',
            description: LABELS.variableDesc
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.VARIABLES,
        labels: {
            singular: LABELS.variableSingularLabel,
            plural: LABELS.variablePluralLabel,
            menuData: LABELS.variableLabel,
            editModal: LABELS.editVariableLabel
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
            utilityIconName: 'utility:choice',
            value: 'choice',
            description: LABELS.choiceDesc
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.CHOICES,
        labels: {
            singular: LABELS.choiceSingularLabel,
            plural: LABELS.choicePluralLabel,
            menuData: LABELS.choiceLabel,
            editModal: LABELS.editChoiceLabel
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
            utilityIconName: 'utility:dynamic_record_choice',
            value: 'dynamicRecordChoice',
            description: LABELS.dynamicRecordChoiceDesc
        },
        modalSize: MODAL_SIZE.MEDIUM,
        labels: {
            singular: LABELS.recordChoiceSetSingularLabel,
            plural: LABELS.recordChoiceSetPluralLabel,
            menuData: LABELS.dynamicRecordChoiceLabel,
            editModal: LABELS.editRecordChoiceSetLabel
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
            utilityIconName: 'utility:picklist_choice',
            value: 'picklistChoice',
            description: LABELS.picklistChoiceDesc
        },
        modalSize: MODAL_SIZE.MEDIUM,
        labels: {
            singular: LABELS.picklistChoiceSetSingularLabel,
            plural: LABELS.picklistChoiceSetPluralLabel,
            menuData: LABELS.picklistChoiceLabel,
            editModal: LABELS.editPicklistChoiceSetLabel
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
            utilityIconName: 'utility:constant',
            value: 'constant',
            description: LABELS.constantDesc
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.CONSTANTS,
        labels: {
            singular: LABELS.constantSingularLabel,
            plural: LABELS.constantPluralLabel,
            menuData: LABELS.constantLabel,
            editModal: LABELS.editConstantLabel
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
            utilityIconName: 'utility:formula',
            value: 'formula',
            description: LABELS.formulaDesc
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.FORMULAS,
        labels: {
            singular: LABELS.formulaSingularLabel,
            plural: LABELS.formulaPluralLabel,
            menuData: LABELS.formulaLabel,
            editModal: LABELS.editFormulaLabel
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
            utilityIconName: 'utility:text_template',
            value: 'textTemplate',
            description: LABELS.textTemplateDesc
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.TEXT_TEMPLATES,
        labels: {
            singular: LABELS.textTemplateSingularLabel,
            plural: LABELS.textTemplatePluralLabel,
            menuData: LABELS.textTemplateLabel,
            editModal: LABELS.editTextTemplateLabel
        },
        canvasElement: false,
        nonHydratableProperties: ['isViewedAsPlainText'],
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
            utilityIconName: 'utility:stage',
            value: 'stage',
            description: LABELS.stageDesc
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.STAGES,
        labels: {
            singular: LABELS.stageSingularLabel,
            plural: LABELS.stagePluralLabel,
            menuData: LABELS.stageLabel,
            editModal: LABELS.editStageLabel
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
            plural: LABELS.stepPluralLabel,
            newModal: LABELS.newStepLabel,
            editModal: LABELS.editStepLabel
        },
        canvasElement: true,
        canBeDuplicated: false,
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
        },
        nonHydratableProperties: ['inputsOnNextNavToAssocScrn']
    },
    [ELEMENT_TYPE.END_ELEMENT]: {
        nodeConfig: {
            iconBackgroundColor: 'background-red',
            iconName: 'utility:stop',
            iconShape: ICON_SHAPE.CIRCLE,
            iconSize: 'medium',
            maxConnections: 0,
            section: LABELS.flowControlLogicLabel,
            description: LABELS.endElementDescription
        },
        bodyCssClass: '',
        canvasElement: true,
        labels: {
            singular: LABELS.endElementSingularLabel,
            plural: LABELS.endElementPluralLabel
        }
    },
    [ELEMENT_TYPE.ROOT_ELEMENT]: {
        descriptor: 'builder_platform_interaction:defaultEditor',
        nodeConfig: {
            iconName: 'standard:custom',
            maxConnections: 1
        },
        bodyCssClass: '',
        labels: {
            singular: '',
            newModal: '',
            editModal: ''
        }
    },
    [ELEMENT_TYPE.ORCHESTRATED_STAGE]: {
        descriptor: 'builder_platform_interaction:orchestratedStageEditor',
        nodeConfig: {
            iconName: 'standard:sales_path',
            utilityIconName: 'standard:sales_path',
            value: 'stepped stage',
            dynamicNodeComponent: 'builder_platform_interaction/orchestratedStageNode',
            dynamicNodeComponentSelector: getSteps,
            dragImageSrc: ICONS_LARGE[ELEMENT_TYPE.ORCHESTRATED_STAGE],
            maxConnections: 1,
            section: LABELS.flowInteractionComponentsLabel,
            description: LABELS.orchestratedStageComponentDescription
        },
        modalSize: MODAL_SIZE.LARGE,
        metadataKey: METADATA_KEY.ORCHESTRATED_STAGES,
        labels: {
            singular: LABELS.orchestratedStageSingularLabel,
            plural: LABELS.orchestratedStagePluralLabel,
            leftPanel: LABELS.orchestratedStageComponentLabel,
            newModal: LABELS.newOrchestratedStageLabel,
            editModal: LABELS.editOrchestratedStageLabel
        },
        childReferenceKey: {
            singular: getChildReferencesKeys().singular,
            plural: getChildReferencesKeys().plural
        },
        canvasElement: true,
        areChildElementsSupported: true,
        nonHydratableProperties: [],
        bodyCssClass: 'slds-scrollable_none',
        factory: {
            propertyEditor: createOrchestratedStageWithItems,
            pasteElement: createPastedOrchestratedStage,
            duplicateElement: createDuplicateOrchestratedStage,
            closePropertyEditor: createOrchestratedStageWithItemReferencesWhenUpdatingFromPropertyEditor,
            uiToFlow: createOrchestratedStageMetadataObject,
            flowToUi: createOrchestratedStageWithItemReferences
        }
    },
    [ELEMENT_TYPE.STAGE_STEP]: {
        // A step in a stage is not a canvas element, but is a first class element
        descriptor: 'builder_platform_interaction:stageStepEditor',
        nodeConfig: {
            iconName: 'standard:screen',
            utilityIconName: 'utility:screen'
        },
        labels: {
            singular: LABELS.stageStepSingularLabel,
            plural: LABELS.stageStepPluralLabel,
            leftPanel: LABELS.stageStepComponentLabel,
            newModal: LABELS.newStageStepLabel,
            editModal: LABELS.editStageStepLabel
        },
        isChildElement: true,
        factory: {
            propertyEditor: createStageStep
        }
    },
    /**
     * Currently, when the flowBuilder app is loaded - the canvas loads prior to the leftPanel.
     * Unlike the configuration for the base element types, which is hardcoded in the elementConfig.ts
     * and is therefore available at the time of loading of the canvas, the subtype configuration is received
     * from the service at the time of loading the leftPanel. Due to this there was issue in loading a flow
     * which had been saved with collection processor subtypes. We would need to fix the subtype framework to be able
     * to handle this case. For now, we are ok to add basic sort configuration here.
     * But once the subtypes f/w fix is in place - this would need to be removed.
     */
    [COLLECTION_PROCESSOR_SUB_TYPE.SORT]: {
        nodeConfig: {
            iconName: 'standard:sort',
            utilityIconName: 'utility:sort',
            iconBackgroundColor: 'background-orange'
        },
        canvasElement: true,
        labels: {
            singular: LABELS.sortSingularLabel,
            plural: LABELS.sortPluralLabel
        }
    },
    [ELEMENT_TYPE.DEFAULT]: {
        // defaultEditor doesn't exist but should lead here making it easier to debug the issue
        descriptor: 'builder_platform_interaction:defaultEditor',
        nodeConfig: {
            iconName: 'standard:custom',
            maxConnections: 1
        },
        bodyCssClass: ''
    }
};

/**
 * Updates the elementTypeToConfigMap to include the configuration information for element subtypes retrieved via the Service API.
 * @param elements - Array of elements retrieved from Service API to populate toolbox elements list in left panel
 */
export const updateElementConfigMapWithSubtypes = (elements: Array<any>) => {
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element && element.isElementSubtype) {
            elementTypeToConfigMap[element.name!] = JSON.parse(
                JSON.stringify(elementTypeToConfigMap[element.elementType!])
            );

            const elementToUpdate = elementTypeToConfigMap[element.name!];
            elementToUpdate.elementSubtype = element.name;
            elementToUpdate.factory = elementTypeToConfigMap[element.elementType!].factory;
            elementToUpdate.labels!.singular = element.label!;
            elementToUpdate.labels!.plural = element.labelPlural!;
            elementToUpdate.labels!.leftPanel = element.label!;
            elementToUpdate.labels!.newModal = element.labelNew!;
            elementToUpdate.labels!.editModal = element.labelEdit!;
            elementToUpdate.nodeConfig!.iconBackgroundColor = element.color;
            elementToUpdate.nodeConfig!.iconName = element.icon!;
            elementToUpdate.nodeConfig!.description = element.description;
            elementToUpdate.configComponent = element.configComponent;
        }
    }
};

/**
 * Returns the configuration information for the passed element or element subtype
 * @param element - element to fetch configuration information for based on its element type or subelement type
 * @returns An object containing component config
 */
export function getConfigForElement(element: UI.ElementConfig): UI.ElementConfig {
    let configLookup;
    if (element.isElementSubtype) {
        configLookup = element.name!;
    } else {
        configLookup = getValueFromHydratedItem(element.elementSubtype) || element.elementType;
    }
    return getConfigForElementType(configLookup);
}

/**
 * @param elementType - String value to choose the actual component from the
 *            map, if empty, default element is chosen
 * @returns An object containing component config
 */
export function getConfigForElementType(elementType?: string): UI.ElementConfig {
    if (elementType == null || !elementTypeToConfigMap[elementType]) {
        elementType = ELEMENT_TYPE.DEFAULT;
    }
    return elementTypeToConfigMap[elementType];
}

/**
 * Returns a list of child element types likes Email Alert & Apex Call that have special properties, like their own icon
 */
export function getChildElementTypesWithOverridenProperties(): String[] {
    return [
        ELEMENT_TYPE.EMAIL_ALERT,
        ELEMENT_TYPE.APEX_CALL,
        ELEMENT_TYPE.APEX_PLUGIN_CALL,
        ELEMENT_TYPE.EXTERNAL_SERVICE
    ];
}

/**
 * Checks if the given element type is an element that is visible on the canvas.
 * @param elementType - elementType one of the values defined in ELEMENT_TYPE
 * @returns {boolean} true if the given element type is a canvas element

 */
export function isCanvasElement(elementType: string) {
    return !!getConfigForElementType(elementType).canvasElement;
}

/**
 * Checks if the given element type is an top level element or not
 * @param elementType - elementType one of the values defined in ELEMENT_TYPE
 * @returns {boolean} true if the given element type is a top level element or not.
 */
export function isChildElement(elementType: string) {
    return !!getConfigForElementType(elementType).isChildElement;
}

export function getChildReferencesKeys(): { singular: string; plural: string } {
    return {
        singular: 'childReference',
        plural: 'childReferences'
    };
}
