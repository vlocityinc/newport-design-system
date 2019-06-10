import { getProcessTypes } from 'builder_platform_interaction/systemLib';
import { LABELS } from './processTypeLibLabels';
import { format } from 'builder_platform_interaction/commonUtils';
import { ALL_PROCESS_TYPE, getProcessTypeIcon } from './processTypeUtils';

let allTemplates = {};

const groupByProcessType = templates => {
    return templates.reduce((templatesByProcessType, template) => {
        if (!templatesByProcessType[template.ProcessType]) {
            templatesByProcessType[template.ProcessType] = [];
        }
        templatesByProcessType[template.ProcessType].push(template);
        return templatesByProcessType;
    }, {});
};

export const getProcessTypeTile = (processTypeName, isSelected) => {
    const processType = getProcessTypes().find(
        type => type.name === processTypeName
    );
    if (!processType) {
        throw new Error('Can not find process type: ' + processTypeName);
    }
    const label = processType.label;
    let description = LABELS[processTypeName];
    if (!description) {
        description = format(LABELS.newProcessTypeDescription, label);
    }
    return {
        itemId: processTypeName,
        label,
        iconName: getProcessTypeIcon(processTypeName),
        description,
        isSelected
    };
};

export const cacheTemplates = (processType, templates) => {
    if (processType === ALL_PROCESS_TYPE.name) {
        allTemplates = groupByProcessType(templates);
        const allProcessTypes = getProcessTypes();
        allProcessTypes.forEach(type => {
            allTemplates[type.name] = allTemplates[type.name] || [];
        });
    }
    allTemplates[processType] = templates;
};

export const getTemplates = processType => {
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
