// @ts-nocheck
import { LABELS, TRIGGER_TYPE_LABELS } from './processTypeLibLabels';
import { format } from 'builder_platform_interaction/commonUtils';
import { ALL_PROCESS_TYPE, getProcessTypeIcon, getTriggerTypeIcon } from './processTypeUtils';
import { FLOW_PROCESS_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { orgHasBeforeSaveEnabled } from 'builder_platform_interaction/contextLib';

let allTemplates = {};

const RECOMMENDED_PROCESS_TYPES = [FLOW_PROCESS_TYPE.FLOW, FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW];

const groupByProcessType = (templates) => {
    return templates.reduce((templatesByProcessType, template) => {
        if (!templatesByProcessType[template.ProcessType]) {
            templatesByProcessType[template.ProcessType] = [];
        }
        templatesByProcessType[template.ProcessType].push(template);
        return templatesByProcessType;
    }, {});
};

const createProcessTypeTile = ({ name, label }) => ({
    itemId: name,
    label,
    description: LABELS[name] || format(LABELS.newProcessTypeDescription, label),
    iconName: getProcessTypeIcon(name),
    processType: name
});

const createTriggerTypeTile = (processType, triggerType) => ({
    itemId: processType + '-' + triggerType,
    label: TRIGGER_TYPE_LABELS[triggerType],
    description: LABELS[triggerType],
    iconName: getTriggerTypeIcon(processType, triggerType),
    processType,
    triggerType
});

/**
 * @param processType
 */
function createFlowEntryTilesForProcessType(processType) {
    if (processType.name === FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW) {
        // Create one tile per trigger type for auto-launched flows
        const result = [];
        if (orgHasBeforeSaveEnabled()) {
            result.push(createTriggerTypeTile(processType.name, FLOW_TRIGGER_TYPE.BEFORE_SAVE));
        }
        result.push(createTriggerTypeTile(processType.name, FLOW_TRIGGER_TYPE.SCHEDULED));
        result.push(createProcessTypeTile(processType));
        return result;
    }
    return [createProcessTypeTile(processType)];
}

export const createFlowEntryTilesForProcessTypes = (processTypes) =>
    processTypes.reduce((tiles, processType) => tiles.concat(createFlowEntryTilesForProcessType(processType)), []);

export const createRecommendedItems = (allProcessTypes) => {
    const recommendedProcessTypes = RECOMMENDED_PROCESS_TYPES.map((processTypeName) =>
        allProcessTypes.find((processType) => processType.name === processTypeName)
    );
    return createFlowEntryTilesForProcessTypes(recommendedProcessTypes);
};

/**
 * @typedef {Object} FlowVersionDescriptor
 * @property {string} EnumOrID
 * @property {string} ProcessType
 * @property {string} Status
 * @property {string} IsTemplate
 * @property {string} VersionNumber
 * @property {string} Description
 * @property {string} Label
 */
/**
 * @param root0
 * @param root0.Label
 * @param root0.Description
 * @param root0.ProcessType
 * @param root0.EnumOrID
 * @returns FlowVersionDescriptor
 */
const createFlowEntryTilesForTemplate = ({ EnumOrID, Label, Description, ProcessType }) => ({
    itemId: EnumOrID,
    label: Label,
    description: Description,
    iconName: getProcessTypeIcon(ProcessType),
    templateId: EnumOrID
});

/**
 * @param data an array of FlowVersionDescriptor
 * @param templates
 * @returns (Template[]) an array of Template
 */
export const createFlowEntryTilesForTemplates = (templates) => (templates || []).map(createFlowEntryTilesForTemplate);

export const cacheTemplates = (allProcessTypes, processType, templates) => {
    if (processType === ALL_PROCESS_TYPE.name) {
        allTemplates = groupByProcessType(templates);
        allProcessTypes.forEach((type) => {
            allTemplates[type.name] = allTemplates[type.name] || [];
        });
    }
    allTemplates[processType] = templates;
};

export const getTemplates = (processType) => {
    return allTemplates[processType];
};

export const getAllTemplates = () => {
    return allTemplates;
};

/**
 * Use to reset the cache in tests
 */
export const resetCacheTemplates = () => {
    allTemplates = {};
};
