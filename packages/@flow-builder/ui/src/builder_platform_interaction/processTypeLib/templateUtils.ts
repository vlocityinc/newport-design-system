// @ts-nocheck
import { ALL_PROCESS_TYPE, getProcessTypeIcon } from './processTypeUtils';

let allTemplates = {};

const groupByProcessType = (templates) => {
    return templates.reduce((templatesByProcessType, template) => {
        if (!templatesByProcessType[template.ProcessType]) {
            templatesByProcessType[template.ProcessType] = [];
        }
        templatesByProcessType[template.ProcessType].push(template);
        return templatesByProcessType;
    }, {});
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
