import { getProcessTypes } from 'builder_platform_interaction/systemLib';
import { LABELS } from './processTypeLibLabels';
import { format } from 'builder_platform_interaction/commonUtils';
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

export const getProcessTypeTile = (processType, isSelected) => {
    let processTypeTile = LABELS[processType];
    if (!processTypeTile) {
        const processTypeLabel = getProcessTypes().find(type => type.name === processType).label;
        processTypeTile = {title: format(LABELS.newProcessTypeTitle, processTypeLabel), description: format(LABELS.newProcessTypeDescription, processTypeLabel)};
    }
    return {itemId: processType, label: processTypeTile.title, iconName: getProcessTypeIcon(processType), description: processTypeTile.description, isSelected};
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

export const getTemplates = (processType) => {
    return allTemplates[processType];
};

export const getAllTemplates = () => {
    return allTemplates;
};