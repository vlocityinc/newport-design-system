import { FLOW_DATA_TYPE, getDataTypeLabel, isComplexType } from 'builder_platform_interaction/dataTypeLib';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { getEntity } from 'builder_platform_interaction/sobjectLib';
import { LABELS } from './fieldInputMenuDataLibLabels';
const { format } = commonUtils;

export const systemAndGlobalVariableSectionLabel = LABELS.globalResources;
export const globalConstantsLabel = LABELS.globalValues;

type GlobalConstant = VariablesConfig & { name: FieldInput.GlobalConstantsName };

export const globalConstants: GlobalConstant[] = [
    {
        label: LABELS.globalValueTrue,
        name: '$GlobalConstant.True',
        description: LABELS.globalValueTrueDescription,
        iconName: 'utility:toggle',
        iconSize: 'x-small'
    },
    {
        label: LABELS.globalValueFalse,
        name: '$GlobalConstant.False',
        description: LABELS.globalValueFalseDescription,
        iconName: 'utility:toggle',
        iconSize: 'x-small'
    },
    {
        label: LABELS.globalValueEmptyString,
        name: '$GlobalConstant.EmptyString',
        description: LABELS.globalValueEmptyStringDescription,
        iconName: 'utility:text',
        iconSize: 'x-small'
    },
    {
        label: LABELS.globalValueNull,
        name: '$GlobalConstant.Null',
        description: LABELS.globalValueNullDescription,
        iconName: 'utility:steps',
        iconSize: 'x-small'
    }
];

type SystemAndGlobalVariables = SystemAndGlobalVariablesConfig & { name: FieldInput.SystemAndGlobalVariableName };

export const systemAndGlobalVariables: SystemAndGlobalVariables[] = [
    {
        label: LABELS.globalRecordLabel,
        name: '$Record',
        hasLabelSubtypeParam: true,
        description: LABELS.globalRecordDescription,
        hasDescriptionSubtypeParam: true,
        iconName: 'utility:record_alt',
        iconSize: 'x-small'
    },

    {
        label: LABELS.globalRecordPriorValueLabel,
        name: '$Record__Prior',
        hasLabelSubtypeParam: true,
        description: LABELS.globalRecordPriorValueDescription,
        hasDescriptionSubtypeParam: true,
        iconName: 'utility:record_alt',
        iconSize: 'x-small'
    },
    {
        label: LABELS.globalFlowLabel,
        name: '$Flow',
        description: LABELS.globalFlowDescription,
        iconName: 'utility:flow',
        iconSize: 'x-small'
    },

    {
        label: LABELS.globalOrgLabel,
        name: '$Organization',
        description: LABELS.globalOrgDescription,
        iconName: 'utility:company',
        iconSize: 'x-small'
    },
    { label: '$Label', description: 'tbd', iconName: 'utility:world', name: '$Label', iconSize: 'x-small' },

    { label: '$Setup', name: '$Setup', description: 'tbd', iconName: 'utility:hierarchy', iconSize: 'x-small' },
    {
        label: LABELS.globalUserLabel,
        name: '$User',
        description: LABELS.globalUserDescription,
        iconName: 'utility:user',
        iconSize: 'x-small'
    },

    {
        label: LABELS.globalUserRoleLabel,
        name: '$UserRole',
        description: LABELS.globalUserRoleDescription,
        iconName: 'utility:user_role',
        iconSize: 'x-small'
    },
    {
        label: LABELS.globalUserProfileLabel,
        name: '$Profile',
        description: LABELS.globalUserProfileDescription,
        iconName: 'utility:user_role',
        iconSize: 'x-small'
    },
    // {
    //     label: '$Permission',
    //     name: '$Permission',
    //     description: 'tbd',
    //     iconName: 'utility:user_role',
    //     iconSize: 'x-small'
    // },
    // {
    //     label: '$Client',
    //     name: '$Client',
    //     description: 'tbd',
    //     iconName: 'utility:desktop_and_phone',
    //     iconSize: 'x-small'
    // },
    {
        label: LABELS.globalApiLabel,
        name: '$Api',
        description: LABELS.globalApiDescription,
        iconName: 'utility:system_and_global_variable',
        iconSize: 'x-small'
    },
    {
        label: LABELS.globalSystemLabel,
        name: '$System',
        description: LABELS.globalSystemDescription,
        iconName: 'utility:system_and_global_variable',
        iconSize: 'x-small'
    }
    // {
    //     label: LABELS.globalOrchestrationLabel,
    //     name: '$Orchestration',
    //     description: LABELS.globalOrchestrationDescription,
    //     iconName: 'utility:orchestrator',
    //     iconSize: 'x-small'
    // }
];

const fieldInputCategories: FieldInput.CategoryConfig[] = [
    { name: 'RecordVariable', label: LABELS.recordVariables },
    { name: 'RecordCollection', label: LABELS.recordCollections },
    { name: 'Action', label: LABELS.actions, isElementCategory: true },
    { name: 'Variable', label: LABELS.simpleVariables },
    { name: 'Collection', label: LABELS.simpleCollections },
    { name: 'ApexVariable', label: LABELS.apexVariables },
    { name: 'ApexCollection', label: LABELS.apexCollections },
    { name: 'Constant', label: LABELS.constants },
    { name: 'Formula', label: LABELS.formulas },
    { name: 'Choice', label: LABELS.choices },
    { name: 'Stage', label: LABELS.stages },
    { name: 'TextTemplate', label: LABELS.textTemplates },
    { name: 'Assignment', label: LABELS.assignments, isElementCategory: true },
    { name: 'Decision', label: LABELS.decisions, isElementCategory: true },
    { name: 'Loop', label: LABELS.loops, isElementCategory: true },
    { name: 'Outcome', label: LABELS.outcomes, hideFromFirstLevel: true },
    { name: 'RecordCreate', label: LABELS.recordCreate, isElementCategory: true },
    { name: 'RecordDelete', label: LABELS.recordDelete, isElementCategory: true },
    { name: 'RecordLookup', label: LABELS.recordLookup, isElementCategory: true },
    { name: 'RecordUpdate', label: LABELS.recordUpdate, isElementCategory: true },
    { name: 'RollBack', label: LABELS.rollBack },
    { name: 'Screen', label: LABELS.screens, isElementCategory: true },
    { name: 'Subflow', label: LABELS.subflows, isElementCategory: true },
    { name: 'Wait', label: LABELS.waits, isElementCategory: true },
    { name: 'WaitEvent', label: LABELS.waitEvents, hideFromFirstLevel: true },
    { name: 'ScreenField', label: LABELS.screenFields, hideFromFirstLevel: true },
    { name: 'OrchestratedStage', label: LABELS.orchestratedStages, isElementCategory: true },
    { name: 'StageStep', label: LABELS.orchestratedSteps, hideFromFirstLevel: true },
    { name: 'Sort', label: LABELS.sort, isElementCategory: true },
    { name: 'Filter', label: LABELS.filter, isElementCategory: true },
    { name: 'Map', label: LABELS.map, isElementCategory: true }
];

export const fieldInputCategoryMap: Record<FieldInput.Category, FieldInput.CategoryConfig> =
    fieldInputCategories.reduce((acc, curr) => {
        acc[curr.name] = curr;
        return acc;
    }, {} as Record<FieldInput.Category, FieldInput.CategoryConfig>);

const categorySort = (cat1, cat2) => cat1.label.localeCompare(cat2.label);

const sortedElementCategories: FieldInput.CategoryConfig[] = fieldInputCategories
    .filter((category) => category.isElementCategory === true)
    .sort(categorySort);

const firstLevelNonElementCategories: FieldInput.CategoryConfig[] = fieldInputCategories.filter(
    (category) => category.isElementCategory !== true && category.hideFromFirstLevel !== true
);

export const elementCategoriesForAllView = [...sortedElementCategories, ...firstLevelNonElementCategories];

const isAnonymousPrimitiveOutputResource = ({ isSystemGeneratedOutput, dataType }: UI.FlowResource) => {
    return isSystemGeneratedOutput && dataType !== FLOW_DATA_TYPE.SOBJECT.value;
};

/**
 * Get resource category label for the element (if possible, considered as a resource that can be used in a merge field)
 *
 * @param resource - The flow resource
 * @returns The category associated with a given resource
 */
export function getResourceCategory(resource: UI.FlowResource): FieldInput.Category {
    const { dataType, elementType, storeOutputAutomatically = false, isCollection = false, elementSubtype } = resource;

    let category: FieldInput.Category;

    if (storeOutputAutomatically || !isComplexType(dataType) || dataType === FLOW_DATA_TYPE.ORCHESTRATED_STAGE.value) {
        if (storeOutputAutomatically || !isCollection) {
            const { fieldInputCategory } = getConfigForElementType(elementSubtype || elementType);
            category = fieldInputCategory as FieldInput.Category;
        } else {
            category = 'Collection';
        }
    } else if (dataType === FLOW_DATA_TYPE.SOBJECT.value) {
        category = isCollection ? 'RecordCollection' : 'RecordVariable';
    } else if (dataType === FLOW_DATA_TYPE.APEX.value) {
        category = isCollection ? 'ApexCollection' : 'ApexVariable';
    }
    return category!;
}

/**
 * Get the formatted name filled with resource related entity label
 *
 * @param resource - the element
 * @param elementName - the element name
 * @param labelWithTokens - used to format the resulting name with entity label if any (eg: "{0} from {1}")
 * @returns formatted name if any entity label found the given element name otherwise
 */
const formatWithEntityLabel = (resource: UI.FlowResource, elementName: string, labelWithTokens: string): string => {
    const entity = getEntity(resource.subtype || resource.object);
    let formattedName = elementName;

    if (entity) {
        const entityLabel = resource.isCollection ? entity.entityLabelPlural : entity.entityLabel;
        if (entityLabel && labelWithTokens) {
            formattedName = format(labelWithTokens, entityLabel, formattedName);
        }
    }
    return formattedName;
};

/**
 * Get the label of an element/resource (if possible, considered as a resource that can be used in a merge field)
 * TODO: This function isn't used currently. Update this function to support labels and api names when using as part of W-10397891
 *
 * @param resource - The resource
 * @returns The label for the resource
 */
export function getResourceLabel(resource: UI.FlowResource): string {
    let name = (resource as UI.HydratedElement).name?.value || resource.name!;

    const { storeOutputAutomatically, elementType, dataType, apexClass, isCollection } = resource;

    if (storeOutputAutomatically) {
        if (dataType === FLOW_DATA_TYPE.SOBJECT.value && elementType !== ELEMENT_TYPE.LOOP) {
            // "Accounts from resourceName" (get record, action with sobject anonymous output...)
            name = formatWithEntityLabel(resource, name, LABELS.recordLookupAsResourceText);
        } else if (elementType === ELEMENT_TYPE.RECORD_CREATE) {
            // "AccountId from myCreateRecord"
            name = formatWithEntityLabel(resource, name, LABELS.recordCreateIdAsResourceText);
        } else if (elementType === ELEMENT_TYPE.LOOP) {
            // Current Item from Loop myLoop
            name = format(LABELS.loopAsResourceText, name);
        } else if (dataType === FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value) {
            // "Outputs from myLC"
            name = format(LABELS.lightningComponentScreenFieldAsResourceText, name);
        } else if (dataType === FLOW_DATA_TYPE.ACTION_OUTPUT.value) {
            // "Outputs from myAction
            name = format(LABELS.actionAsResourceText, name);
        } else if (isAnonymousPrimitiveOutputResource(resource)) {
            const dataTypeLabel = apexClass ? apexClass : getDataTypeLabel(dataType);
            name = isCollection
                ? format(
                      LABELS.actionAnonymousPrimitiveAsResourceText,
                      format(LABELS.collectionDataType, dataTypeLabel),
                      name
                  )
                : format(LABELS.actionAnonymousPrimitiveAsResourceText, dataTypeLabel, name);
        } else if (dataType === FLOW_DATA_TYPE.SUBFLOW_OUTPUT.value) {
            // "Outputs from mySubflow"
            name = format(LABELS.subflowAsResourceText, name);
        }
    }

    return name;
}
