import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { FlowElementSubtypeDescriptor, FlowElementTypeBaseDescriptor } from 'builder_platform_interaction/dataTypeLib';
import {
    createActionCall,
    createActionCallForStore,
    createActionCallMetadataObject,
    createApexCall,
    createApexPlugin,
    createApexPluginMetadataObject,
    createApexPluginWithConnectors,
    createAssignment,
    createAssignmentMetadataObject,
    createAssignmentWithConnectors,
    createChoice,
    createChoiceForStore,
    createChoiceMetadataObject,
    createCollectionChoiceSet,
    createCollectionChoiceSetMetadataObject,
    createCollectionProcessor,
    createCollectionProcessorMetadataObject,
    createCollectionProcessorWithConnectors,
    createConstant,
    createConstantForStore,
    createConstantMetadataObject,
    createDecisionMetadataObject,
    createDecisionWithOutcomeReferences,
    createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor,
    createDecisionWithOutcomes,
    createDuplicateActionCall,
    createDuplicateApexCall,
    createDuplicateApexPlugin,
    createDuplicateAssignment,
    createDuplicateCollectionProcessor,
    createDuplicateDecision,
    createDuplicateEmailAlert,
    createDuplicateLoop,
    createDuplicateOrchestratedStage,
    createDuplicateRecordCreate,
    createDuplicateRecordDelete,
    createDuplicateRecordLookup,
    createDuplicateRecordUpdate,
    createDuplicateRollback,
    createDuplicateScreen,
    createDuplicateSubflow,
    createDuplicateWait,
    createEmailAlert,
    createFlowProperties,
    createFlowPropertiesForEditor,
    createFlowPropertiesMetadataObject,
    createFlowTestData,
    createFormula,
    createFormulaForStore,
    createFormulaMetadataObject,
    createLoop,
    createLoopMetadataObject,
    createLoopWithConnectors,
    createOrchestratedStageMetadataObject,
    createOrchestratedStageWithItemReferences,
    createOrchestratedStageWithItemReferencesWhenUpdatingFromPropertyEditor,
    createOrchestratedStageWithItems,
    createOutcome,
    createPicklistChoiceSet,
    createPicklistChoiceSetMetadataObject,
    createRecordChoiceSet,
    createRecordChoiceSetMetadataObject,
    createRecordCreate,
    createRecordCreateMetadataObject,
    createRecordCreateWithConnectors,
    createRecordDelete,
    createRecordDeleteMetadataObject,
    createRecordDeleteWithConnectors,
    createRecordLookup,
    createRecordLookupMetadataObject,
    createRecordLookupWithConnectors,
    createRecordUpdate,
    createRecordUpdateMetadataObject,
    createRecordUpdateWithConnectors,
    createRollback,
    createRollbackMetadataObject,
    createRollbackWithConnectors,
    createScreenField,
    createScreenMetadataObject,
    createScreenWithFieldReferences,
    createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor,
    createScreenWithFields,
    createStage,
    createStageForStore,
    createStageMetadataObject,
    createStageStep,
    createStartElement,
    createStartElementForPropertyEditor,
    createStartElementMetadataObject,
    createStartElementWhenUpdatingFromPropertyEditor,
    createStartElementWithConnectors,
    createStep,
    createStepMetadataObject,
    createStepWithConnectorsForStore,
    createSubflow,
    createSubflowMetadataObject,
    createSubflowWithConnectors,
    createTextTemplate,
    createTextTemplateForStore,
    createTextTemplateMetadataObject,
    createVariable,
    createVariableForStore,
    createVariableMetadataObject,
    createWaitEvent,
    createWaitMetadataObject,
    createWaitWithWaitEventReferences,
    createWaitWithWaitEventReferencesWhenUpdatingFromPropertyEditor,
    createWaitWithWaitEvents,
    dynamicChoiceSetForStore,
    getOrchestratedStageChildren,
    getStageStepChildren,
    getSteps
} from 'builder_platform_interaction/elementFactory';
import { AddElementEvent, EditElementEvent } from 'builder_platform_interaction/events';
import {
    ACTION_TYPE,
    COLLECTION_PROCESSOR_SUB_TYPE,
    ELEMENT_TYPE,
    FLOW_ELEMENT_SUBTYPE,
    FLOW_TRIGGER_TYPE,
    ICONS,
    METADATA_KEY,
    WAIT_SUB_TYPE
} from 'builder_platform_interaction/flowMetadata';
import { ICONS_LARGE } from 'builder_platform_interaction/imageLib';
import { LABELS } from './elementConfigLabels';

export const EDIT_START_SCHEDULE_CONTEXT = 'editStartScheduleContext';
export const EDIT_START_RECORD_CHANGE_CONTEXT = 'editStartRecordChangeContext';
export const EDIT_START_JOURNEY_CONTEXT = 'editStartJourneyContext';
export const EDIT_SEGMENT_CONTEXT = 'editSegmentContext';
export const EDIT_START_SCHEDULED_PATHS = 'editStartScheduledPaths';
export const EDIT_EVENT_JOURNEY_CONTEXT = 'editEventJourneyContext';

/**
 * @constant
 * @type {string} MODAL_SIZE large or medium (default)
 */
export const MODAL_SIZE = {
    LARGE_RESTRICT_TO_MEDIUM: 'large restrictWidthToSldsMedium',
    LARGE: 'large', // To be used by screen elementType
    MEDIUM: 'medium slds-modal_medium',
    SMALL: 'small'
};

/**
 * @constant
 * @type {string} PROPERTY_EDITOR_PANEL_SIZE full or x-large (default)
 */
export const PROPERTY_EDITOR_PANEL_SIZE = {
    FULL: 'slds-size_full',
    X_LARGE: 'size-x-large'
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
        nonHydratableProperties: ['environments'],
        factory: {
            propertyEditor: createFlowPropertiesForEditor,
            uiToFlow: createFlowPropertiesMetadataObject,
            flowToUi: createFlowProperties
        }
    },
    [ELEMENT_TYPE.FLOW_TEST_EDITOR]: {
        descriptor: 'builder_platform_interaction:flowTestEditor',
        canvasElement: false,
        factory: {
            propertyEditor: createFlowTestData
        }
    },
    [ELEMENT_TYPE.START_ELEMENT]: {
        descriptor: {
            [FLOW_TRIGGER_TYPE.BEFORE_SAVE]: 'builder_platform_interaction:recordChangeTriggerEditor',
            [FLOW_TRIGGER_TYPE.BEFORE_DELETE]: 'builder_platform_interaction:recordChangeTriggerEditor',
            [FLOW_TRIGGER_TYPE.AFTER_SAVE]: 'builder_platform_interaction:recordChangeTriggerEditor',
            [FLOW_TRIGGER_TYPE.SCHEDULED]: 'builder_platform_interaction:scheduleTriggerEditor',
            [FLOW_TRIGGER_TYPE.SCHEDULED_JOURNEY]: 'builder_platform_interaction:scheduleSelectionEditor',
            [FLOW_TRIGGER_TYPE.PLATFORM_EVENT]: 'builder_platform_interaction:platformEventEditor',
            [FLOW_TRIGGER_TYPE.SEGMENT]: 'builder_platform_interaction:scheduleSelectionEditor',
            [EDIT_START_RECORD_CHANGE_CONTEXT]: 'builder_platform_interaction:contextRecordEditor',
            [EDIT_START_SCHEDULE_CONTEXT]: 'builder_platform_interaction:contextRecordEditor',
            [EDIT_START_JOURNEY_CONTEXT]: 'builder_platform_interaction:contextRecordEditor',
            [EDIT_SEGMENT_CONTEXT]: 'builder_platform_interaction:contextRecordEditor',
            [EDIT_START_SCHEDULED_PATHS]: 'builder_platform_interaction:scheduledPathsEditor',
            [EDIT_EVENT_JOURNEY_CONTEXT]: 'builder_platform_interaction:eventDrivenJourneyEditor'
        },
        modalSize: {
            [FLOW_TRIGGER_TYPE.BEFORE_SAVE]: MODAL_SIZE.LARGE_RESTRICT_TO_MEDIUM,
            [FLOW_TRIGGER_TYPE.BEFORE_DELETE]: MODAL_SIZE.LARGE_RESTRICT_TO_MEDIUM,
            [FLOW_TRIGGER_TYPE.AFTER_SAVE]: MODAL_SIZE.LARGE_RESTRICT_TO_MEDIUM,
            [FLOW_TRIGGER_TYPE.SCHEDULED]: MODAL_SIZE.MEDIUM,
            [FLOW_TRIGGER_TYPE.SCHEDULED_JOURNEY]: MODAL_SIZE.MEDIUM,
            [FLOW_TRIGGER_TYPE.PLATFORM_EVENT]: MODAL_SIZE.MEDIUM,
            [EDIT_START_RECORD_CHANGE_CONTEXT]: MODAL_SIZE.MEDIUM,
            [EDIT_START_SCHEDULE_CONTEXT]: MODAL_SIZE.MEDIUM,
            [EDIT_START_JOURNEY_CONTEXT]: MODAL_SIZE.MEDIUM,
            [EDIT_START_SCHEDULED_PATHS]: MODAL_SIZE.LARGE_RESTRICT_TO_MEDIUM,
            [EDIT_EVENT_JOURNEY_CONTEXT]: MODAL_SIZE.MEDIUM
        },
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
            editTrigger: LABELS.recordChangeTriggerEditorHeader,
            editSchedule: LABELS.editScheduleLabel,
            editPlatform: LABELS.editPlatformLabel,
            editObject: LABELS.editObjectLabel,
            editTriggerObjectLabel: LABELS.editTriggerObjectLabel,
            editObjectAndFiltersLabel: LABELS.editObjectAndFiltersLabel,
            editScheduledPath: LABELS.editScheduledPathLabel,
            connectorPickerHeader: LABELS.startConnectorPickerHeader,
            comboBoxLabel: LABELS.startConnectorPickerComboBoxLabel,
            connectorPickerBodyText: LABELS.startConnectorPickerBodyText,
            editEventJourney: LABELS.setJourneyEntityLabel
        },
        propertyEditorPanelSize: PROPERTY_EDITOR_PANEL_SIZE.FULL
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
            duplicateElement: createDuplicateSubflow,
            uiToFlow: createSubflowMetadataObject,
            flowToUi: createSubflowWithConnectors
        },
        fieldInputCategory: 'Subflow'
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
        factory: {
            propertyEditor: createActionCall,
            duplicateElement: createDuplicateActionCall,
            uiToFlow: createActionCallMetadataObject,
            flowToUi: createActionCallForStore
        },
        fieldInputCategory: 'Action'
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
        factory: {
            propertyEditor: createActionCall,
            duplicateElement: createDuplicateActionCall,
            uiToFlow: createActionCallMetadataObject,
            flowToUi: createActionCallForStore
        },
        fieldInputCategory: 'Action'
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
        factory: {
            propertyEditor: createApexPlugin,
            duplicateElement: createDuplicateApexPlugin,
            uiToFlow: createApexPluginMetadataObject,
            flowToUi: createApexPluginWithConnectors
        },
        fieldInputCategory: 'Action'
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
        factory: {
            propertyEditor: createApexCall,
            duplicateElement: createDuplicateApexCall,
            uiToFlow: createActionCallMetadataObject,
            flowToUi: createActionCallForStore
        },
        fieldInputCategory: 'Action'
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
        factory: {
            propertyEditor: createEmailAlert,
            duplicateElement: createDuplicateEmailAlert,
            uiToFlow: createActionCallMetadataObject,
            flowToUi: createActionCallForStore
        },
        fieldInputCategory: 'Action'
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
            duplicateElement: createDuplicateAssignment,
            uiToFlow: createAssignmentMetadataObject,
            flowToUi: createAssignmentWithConnectors
        },
        fieldInputCategory: 'Assignment'
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
            'objectFieldReference',
            'singleOrMultiSelect',
            'entityFieldExtraTypeInfo',
            'entityFieldDataType'
        ],
        bodyCssClass: 'slds-scrollable_none',
        factory: {
            propertyEditor: createScreenWithFields,
            duplicateElement: createDuplicateScreen,
            closePropertyEditor: createScreenWithFieldReferencesWhenUpdatingFromPropertyEditor,
            uiToFlow: createScreenMetadataObject,
            flowToUi: createScreenWithFieldReferences
        },
        fieldInputCategory: 'Screen'
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
            description: LABELS.decisionLogicDescription,
            orchestratorDescription: LABELS.orchestratorDecisionLogicDescription
        },
        modalSize: MODAL_SIZE.LARGE_RESTRICT_TO_MEDIUM,
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
        propertyEditorPanelSize: PROPERTY_EDITOR_PANEL_SIZE.FULL,
        childReferenceKey: {
            singular: 'outcome',
            plural: 'outcomes'
        },
        factory: {
            propertyEditor: createDecisionWithOutcomes,
            closePropertyEditor: createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor,
            duplicateElement: createDuplicateDecision,
            uiToFlow: createDecisionMetadataObject,
            flowToUi: createDecisionWithOutcomeReferences
        },
        fieldInputCategory: 'Decision'
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
        modalSize: MODAL_SIZE.LARGE_RESTRICT_TO_MEDIUM,
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
        childReferenceKey: {
            singular: 'waitEvent',
            plural: 'waitEvents'
        },
        canvasElement: true,
        areChildElementsSupported: true,
        canHaveDefaultConnector: true,
        factory: {
            propertyEditor: createWaitWithWaitEvents,
            closePropertyEditor: createWaitWithWaitEventReferencesWhenUpdatingFromPropertyEditor,
            duplicateElement: createDuplicateWait,
            uiToFlow: createWaitMetadataObject,
            flowToUi: createWaitWithWaitEventReferences
        },
        fieldInputCategory: 'Wait'
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
        },
        hasOwnPropertyEditor: false,
        fieldInputCategory: 'WaitEvent'
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
            duplicateElement: createDuplicateLoop,
            uiToFlow: createLoopMetadataObject,
            flowToUi: createLoopWithConnectors
        },
        fieldInputCategory: 'Loop'
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
        nonHydratableProperties: ['numberRecordsToStore'],
        factory: {
            propertyEditor: createRecordCreate,
            duplicateElement: createDuplicateRecordCreate,
            uiToFlow: createRecordCreateMetadataObject,
            flowToUi: createRecordCreateWithConnectors
        },
        fieldInputCategory: 'RecordCreate'
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
        nonHydratableProperties: [
            'numberRecordsToStore',
            'sortOrder',
            'assignNullValuesIfNoRecordsFound',
            'variableAndFieldMapping'
        ],
        factory: {
            propertyEditor: createRecordLookup,
            duplicateElement: createDuplicateRecordLookup,
            uiToFlow: createRecordLookupMetadataObject,
            flowToUi: createRecordLookupWithConnectors
        },
        fieldInputCategory: 'RecordLookup'
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
        factory: {
            propertyEditor: createRecordDelete,
            duplicateElement: createDuplicateRecordDelete,
            uiToFlow: createRecordDeleteMetadataObject,
            flowToUi: createRecordDeleteWithConnectors
        },
        fieldInputCategory: 'RecordDelete'
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
        factory: {
            propertyEditor: createRecordUpdate,
            duplicateElement: createDuplicateRecordUpdate,
            uiToFlow: createRecordUpdateMetadataObject,
            flowToUi: createRecordUpdateWithConnectors
        },
        fieldInputCategory: 'RecordUpdate'
    },
    [ELEMENT_TYPE.OUTCOME]: {
        // OUTCOME is not a canvas element, but is a first class element
        nodeConfig: {
            iconName: 'standard:outcome',
            utilityIconName: 'utility:outcome'
        },
        labels: {
            singular: LABELS.outcomeSingularLabel,
            plural: LABELS.outcomePluralLabel,
            short: LABELS.outcomeShortLabel
        },
        isChildElement: true,
        factory: {
            propertyEditor: createOutcome
        },
        hasOwnPropertyEditor: false,
        fieldInputCategory: 'Outcome'
    },
    [ELEMENT_TYPE.SCHEDULED_PATH]: {
        // Scheduled Path is not a canvas element, but is a first class element

        labels: {
            singular: LABELS.scheduledPathSingularLabel,
            plural: LABELS.scheduledPathPluralLabel
        },
        isChildElement: true,
        hasOwnPropertyEditor: false
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
        },
        fieldInputCategory: 'Variable'
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
        },
        fieldInputCategory: 'Choice'
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
        },
        fieldInputCategory: 'Choice'
    },
    [ELEMENT_TYPE.COLLECTION_CHOICE_SET]: {
        descriptor: 'builder_platform_interaction:collectionChoiceSetEditor',
        nodeConfig: {
            iconName: 'standard:dynamic_record_choice', // TODO: Change icons when collection choice set icons are made
            utilityIconName: 'utility:dynamic_record_choice', // TODO: Change icons when collection choice set icons are made
            value: 'collectionChoice',
            description: LABELS.dynamicCollectionChoiceDesc
        },
        modalSize: MODAL_SIZE.MEDIUM,
        labels: {
            singular: LABELS.collectionChoiceSetSingularLabel,
            plural: LABELS.collectionChoiceSetPluralLabel,
            menuData: LABELS.dynamicCollectionChoiceLabel,
            editModal: LABELS.editCollectionChoiceSetLabel
        },
        canvasElement: false,
        metadataKey: METADATA_KEY.DYNAMIC_CHOICE_SETS,
        factory: {
            propertyEditor: createCollectionChoiceSet,
            uiToFlow: createCollectionChoiceSetMetadataObject,
            flowToUi: dynamicChoiceSetForStore
        },
        fieldInputCategory: 'Choice'
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
        },
        fieldInputCategory: 'Choice'
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
        },
        fieldInputCategory: 'Constant'
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
        },
        fieldInputCategory: 'Formula'
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
        },
        fieldInputCategory: 'TextTemplate'
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
        },
        fieldInputCategory: 'Stage'
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
        nonHydratableProperties: ['inputsOnNextNavToAssocScrn', 'entityFieldExtraTypeInfo', 'entityFieldDataType'],
        hasOwnPropertyEditor: false,
        fieldInputCategory: 'ScreenField'
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
            description: LABELS.orchestratedStageComponentDescription,
            iconBackgroundColor: 'background-dark-blue'
        },
        modalSize: MODAL_SIZE.LARGE_RESTRICT_TO_MEDIUM,
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
            duplicateElement: createDuplicateOrchestratedStage,
            closePropertyEditor: createOrchestratedStageWithItemReferencesWhenUpdatingFromPropertyEditor,
            uiToFlow: createOrchestratedStageMetadataObject,
            flowToUi: createOrchestratedStageWithItemReferences
        },
        getChildrenItems: getOrchestratedStageChildren,
        fieldInputCategory: 'OrchestratedStage'
    },
    [ELEMENT_TYPE.STAGE_STEP]: {
        // A step in a stage is not a canvas element, but is a first class element
        descriptor: 'builder_platform_interaction:stageStepEditor',
        nodeConfig: {
            iconName: 'standard:work_order_item',
            utilityIconName: 'utility:retail_execution',
            iconBackgroundColor: 'background-navy'
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
        },
        getChildrenItems: getStageStepChildren,
        fieldInputCategory: 'StageStep'
    },
    /**
     * There are two types of Orchestration Stage Step elements: background and interactive. In order to have
     * the correct step type element icon present in debug panel cards, we need to put the configure it here.
     */
    [ACTION_TYPE.STEP_INTERACTIVE]: {
        nodeConfig: {
            iconName: ICONS.interactiveStep,
            iconBackgroundColor: 'background-navy'
        },
        canvasElement: true,
        labels: {
            singular: LABELS.stageStepSingularLabel,
            plural: LABELS.stageStepPluralLabel
        }
    },
    [ACTION_TYPE.STEP_BACKGROUND]: {
        nodeConfig: {
            iconName: ICONS.backgroundStep,
            iconBackgroundColor: 'background-navy'
        },
        canvasElement: true,
        labels: {
            singular: LABELS.stageStepSingularLabel,
            plural: LABELS.stageStepPluralLabel
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
        },
        fieldInputCategory: 'Sort'
    },
    [COLLECTION_PROCESSOR_SUB_TYPE.FILTER]: {
        nodeConfig: {
            iconName: 'standard:filter',
            utilityIconName: 'utility:filter',
            iconBackgroundColor: 'background-orange'
        },
        canvasElement: true,
        labels: {
            singular: LABELS.filterSingularLabel,
            plural: LABELS.filterPluralLabel
        },
        fieldInputCategory: 'Filter'
    },
    [COLLECTION_PROCESSOR_SUB_TYPE.MAP]: {
        nodeConfig: {
            iconName: 'standard:data_mapping',
            utilityIconName: 'utility:data_mapping',
            iconBackgroundColor: 'background-orange'
        },
        canvasElement: true,
        labels: {
            singular: LABELS.mapSingularLabel,
            plural: LABELS.mapPluralLabel
        },
        fieldInputCategory: 'Map'
    },
    [WAIT_SUB_TYPE.DURATION_WAIT]: {
        nodeConfig: {
            iconName: 'standard:today',
            utilityIconName: 'utility:today',
            iconBackgroundColor: 'background-orange'
        },
        canvasElement: true,
        labels: {
            singular: LABELS.durationWaitSingularLabel,
            plural: LABELS.durationWaitPluralLabel
        },
        fieldInputCategory: 'DurationWait',
        supportsBranching: false
    },
    [FLOW_ELEMENT_SUBTYPE.InteractiveStep]: {
        nodeConfig: {
            iconName: ICONS.interactiveStep,
            iconBackgroundColor: 'background-navy',
            description: LABELS.interactiveStepDescription
        },
        elementSubtype: FLOW_ELEMENT_SUBTYPE.InteractiveStep,
        isElementSubtype: true,
        elementType: ELEMENT_TYPE.STAGE_STEP,
        canvasElement: true,
        labels: {
            singular: LABELS.interactiveStepSingularLabel,
            plural: LABELS.interactiveStepPluralLabel
        },
        fieldInputCategory: 'StageStep'
    },
    [FLOW_ELEMENT_SUBTYPE.BackgroundStep]: {
        nodeConfig: {
            iconName: ICONS.backgroundStep,
            iconBackgroundColor: 'background-navy',
            description: LABELS.backgroundStepDescription
        },
        elementSubtype: FLOW_ELEMENT_SUBTYPE.BackgroundStep,
        isElementSubtype: true,
        elementType: ELEMENT_TYPE.STAGE_STEP,
        canvasElement: true,
        labels: {
            singular: LABELS.backgroundStepSingularLabel,
            plural: LABELS.backgroundStepPluralLabel
        },
        fieldInputCategory: 'StageStep'
    },
    [ELEMENT_TYPE.ROLLBACK]: {
        descriptor: 'builder_platform_interaction:rollbackEditor',
        nodeConfig: {
            iconName: 'standard:recent',
            dragImageSrc: ICONS_LARGE[ELEMENT_TYPE.ROLLBACK],
            iconBackgroundColor: 'background-pink',
            maxConnections: 1,
            section: LABELS.flowControlDataOperationsLabel,
            description: LABELS.rollbackDescription
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: METADATA_KEY.ROLLBACKS,
        labels: {
            singular: LABELS.rollbackSingularLabel,
            plural: LABELS.rollbackPluralLabel,
            leftPanel: LABELS.rollbackDataLabel,
            newModal: LABELS.newRollbackLabel,
            editModal: LABELS.editRollbackLabel
        },
        canvasElement: true,
        bodyCssClass: 'slds-p-around_none',
        factory: {
            propertyEditor: createRollback,
            duplicateElement: createDuplicateRollback,
            uiToFlow: createRollbackMetadataObject,
            flowToUi: createRollbackWithConnectors
        },
        fieldInputCategory: 'RollBack'
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
 *
 * @param elements - Array of elements retrieved from Service API to populate toolbox elements list in left panel
 */
export const updateElementConfigMapWithSubtypes = (elements: FlowElementTypeBaseDescriptor[]) => {
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element && element.isElementSubtype) {
            const subtypeElement = element as FlowElementSubtypeDescriptor;
            const fieldInputCategory = elementTypeToConfigMap[subtypeElement.name!]?.fieldInputCategory;
            elementTypeToConfigMap[subtypeElement.name!] = JSON.parse(
                JSON.stringify(elementTypeToConfigMap[subtypeElement.elementType!])
            );

            const elementToUpdate = elementTypeToConfigMap[subtypeElement.name!];
            elementToUpdate.isElementSubtype = true;
            elementToUpdate.elementType = subtypeElement.elementType;
            elementToUpdate.elementSubtype = subtypeElement.name;
            elementToUpdate.factory = elementTypeToConfigMap[subtypeElement.elementType!].factory;
            elementToUpdate.labels!.singular = subtypeElement.label!;
            elementToUpdate.labels!.plural = subtypeElement.labelPlural!;
            elementToUpdate.labels!.leftPanel = subtypeElement.label!;
            elementToUpdate.labels!.newModal = subtypeElement.labelNew!;
            elementToUpdate.labels!.editModal = subtypeElement.labelEdit!;
            elementToUpdate.nodeConfig!.iconBackgroundColor = subtypeElement.color;
            elementToUpdate.nodeConfig!.iconName = subtypeElement.icon!;
            elementToUpdate.nodeConfig!.description = subtypeElement.description;
            elementToUpdate.nodeConfig!.dragImageSrc = ICONS_LARGE[subtypeElement.name];
            elementToUpdate.configComponent = subtypeElement.configComponent;
            elementToUpdate.fieldInputCategory = fieldInputCategory;
            elementToUpdate.supportsBranching = subtypeElement.supportsBranching;
        }
    }
};

/**
 * Returns the configuration information for the passed element or element subtype
 *
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
export function getChildElementTypesWithOverridenProperties(): string[] {
    return [
        ELEMENT_TYPE.EMAIL_ALERT,
        ELEMENT_TYPE.APEX_CALL,
        ELEMENT_TYPE.APEX_PLUGIN_CALL,
        ELEMENT_TYPE.EXTERNAL_SERVICE
    ];
}

/**
 * Checks if the given element type is an element that is visible on the canvas.
 *
 * @param elementType - elementType one of the values defined in ELEMENT_TYPE
 * @returns {boolean} true if the given element type is a canvas element
 */
export function isCanvasElement(elementType: string) {
    return !!getConfigForElementType(elementType).canvasElement;
}

/**
 * Checks if the given element type is an top level element or not
 *
 * @param elementType - elementType one of the values defined in ELEMENT_TYPE
 * @returns {boolean} true if the given element type is a top level element or not.
 */
export function isChildElement(elementType: string) {
    return !!getConfigForElementType(elementType).isChildElement;
}

/**
 *
 */
export function getChildReferencesKeys(): { singular: string; plural: string } {
    return {
        singular: 'childReference',
        plural: 'childReferences'
    };
}

/**
 * @constant childElementTypeToParentDescriptorKeyMap - Map of childElement types to their
 *                      respective descriptor key of parent descriptor map if applicable
 * @type {object}
 */
export const childElementTypeToParentDescriptorKeyMap = {
    [ELEMENT_TYPE.SCHEDULED_PATH]: EDIT_START_SCHEDULED_PATHS
};
