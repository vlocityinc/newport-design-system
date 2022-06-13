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
        iconName: 'toggle'
    },
    {
        label: LABELS.globalValueFalse,
        name: '$GlobalConstant.False',
        description: LABELS.globalValueFalseDescription,
        iconName: 'toggle'
    },
    {
        label: LABELS.globalValueEmptyString,
        name: '$GlobalConstant.EmptyString',
        description: LABELS.globalValueEmptyStringDescription,
        iconName: 'text'
    },
    {
        label: LABELS.globalValueNull,
        name: '$GlobalConstant.Null',
        description: LABELS.globalValueNullDescription,
        iconName: 'steps'
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
        iconName: 'sobject'
    },

    {
        label: LABELS.globalRecordPriorValueLabel,
        name: '$Record__Prior',
        hasLabelSubtypeParam: true,
        description: LABELS.globalRecordPriorValueDescription,
        hasDescriptionSubtypeParam: true,
        iconName: 'sobject'
    },
    {
        label: LABELS.globalFlowLabel,
        name: '$Flow',
        description: LABELS.globalFlowDescription,
        iconName: 'flow'
    },

    {
        label: LABELS.globalOrgLabel,
        name: '$Organization',
        description: LABELS.globalOrgDescription,
        iconName: 'company'
    },
    { label: '$Label', description: 'tbd', iconName: 'world', name: '$Label' },

    { label: '$Setup', name: '$Setup', description: 'tbd', iconName: 'hierarchy' },
    {
        label: LABELS.globalUserLabel,
        name: '$User',
        description: LABELS.globalUserDescription,
        iconName: 'user'
    },

    {
        label: LABELS.globalUserRoleLabel,
        name: '$UserRole',
        description: LABELS.globalUserRoleDescription,
        iconName: 'user_role'
    },
    {
        label: LABELS.globalUserProfileLabel,
        name: '$Profile',
        description: LABELS.globalUserProfileDescription,
        iconName: 'user_role'
    },
    { label: '$Permission', name: '$Permission', description: 'tbd', iconName: 'user_role' },
    { label: '$Client', name: '$Client', description: 'tbd', iconName: 'desktop_and_phone' },
    {
        label: LABELS.globalApiLabel,
        name: '$Api',
        description: LABELS.globalApiDescription,
        iconName: 'system_and_global_variable'
    },
    {
        label: LABELS.globalSystemLabel,
        name: '$System',
        description: LABELS.globalSystemDescription,
        iconName: 'system_and_global_variable'
    },
    {
        label: LABELS.globalOrchestrationLabel,
        name: '$Orchestration',
        description: LABELS.globalOrchestrationDescription,
        iconName: 'orchestrator'
    }
];

const fieldInputCategoryMap: Record<FieldInput.Category, FieldInput.CategoryConfig> = {
    RecordVariable: {
        label: LABELS.recordVariables
    },
    RecordCollection: {
        label: LABELS.recordCollections
    },
    Action: {
        label: LABELS.actions,
        isElementCategory: true
    },
    Variable: {
        label: LABELS.simpleVariables
    },
    Collection: {
        label: LABELS.simpleCollections
    },
    ApexVariable: {
        label: LABELS.apexVariables
    },
    ApexCollection: {
        label: LABELS.apexCollections
    },
    Constant: {
        label: LABELS.constants
    },
    Formula: {
        label: LABELS.formulas
    },
    Choice: {
        label: LABELS.choices
    },
    Stage: {
        label: LABELS.stages
    },
    TextTemplate: {
        label: LABELS.textTemplates
    },
    Assignment: {
        label: LABELS.assignments,
        isElementCategory: true
    },
    Decision: {
        label: LABELS.decisions,
        isElementCategory: true
    },
    Loop: {
        label: LABELS.loops,
        isElementCategory: true
    },
    Outcome: {
        label: LABELS.outcomes,
        hideFromFirstLevel: true
    },
    RecordCreate: {
        label: LABELS.recordCreate,
        isElementCategory: true
    },
    RecordDelete: {
        label: LABELS.recordDelete,
        isElementCategory: true
    },
    RecordLookup: {
        label: LABELS.recordLookup,
        isElementCategory: true
    },
    RecordUpdate: {
        label: LABELS.recordUpdate,
        isElementCategory: true
    },
    RollBack: {
        label: LABELS.rollBack
    },
    Screen: {
        label: LABELS.screens,
        isElementCategory: true
    },
    Subflow: {
        label: LABELS.subflows,
        isElementCategory: true
    },
    Wait: {
        label: LABELS.waits,
        isElementCategory: true
    },
    WaitEvent: {
        label: LABELS.waitEvents,
        hideFromFirstLevel: true
    },
    ScreenField: {
        label: LABELS.screenFields,
        hideFromFirstLevel: true
    },
    OrchestratedStage: {
        label: LABELS.orchestratedStages,
        isElementCategory: true
    },
    StageStep: {
        label: LABELS.orchestratedSteps,
        hideFromFirstLevel: true
    },
    Sort: {
        label: LABELS.sort,
        isElementCategory: true
    },
    Filter: {
        label: LABELS.filter,
        isElementCategory: true
    },
    Map: {
        label: LABELS.map,
        isElementCategory: true
    }
};

const categorySort = (cat1, cat2) => cat1.label.localeCompare(cat2.label);

const sortedElementCategories: FieldInput.CategoryConfig[] = Object.values(fieldInputCategoryMap)
    .filter((category) => category.isElementCategory === true)
    .sort(categorySort);

const firstLevelNonElementCategories: FieldInput.CategoryConfig[] = Object.values(fieldInputCategoryMap).filter(
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
 * @param resource.elementType The element type of the resource
 * @param resource.dataType The datatype of the resource
 * @param resource.storeOutputAutomatically True if output has been stored automatically
 * @param resource.isCollection Whether or not that resource is a collection
 * @param resource.elementSubtype Subtype of a given resource
 * @returns The category associated with a given resource
 */
export function getResourceCategoryLabel({
    dataType,
    elementType,
    storeOutputAutomatically = false,
    isCollection = false,
    elementSubtype
}: UI.FlowResource): string {
    let categoryLabel;

    const { simpleCollections, apexCollections, recordCollections, recordVariables, apexVariables } = LABELS;

    if (storeOutputAutomatically || !isComplexType(dataType) || dataType === FLOW_DATA_TYPE.ORCHESTRATED_STAGE.value) {
        if (storeOutputAutomatically || !isCollection) {
            const { fieldInputCategory } = getConfigForElementType(elementSubtype || elementType);
            categoryLabel = fieldInputCategory && fieldInputCategoryMap[fieldInputCategory].label;
        } else {
            categoryLabel = simpleCollections;
        }
    } else if (dataType === FLOW_DATA_TYPE.SOBJECT.value) {
        categoryLabel = isCollection ? recordCollections : recordVariables;
    } else if (dataType === FLOW_DATA_TYPE.APEX.value) {
        categoryLabel = isCollection ? apexCollections : apexVariables;
    }
    return categoryLabel;
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
    if (!resource) {
        return elementName;
    }
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
 * Get the name for the element (if possible, considered as a resource that can be used in a merge field)
 * TODO: This function isn't used currently. Update this function to support labels and api names when using as part of W-10397891
 *
 * @param resource - the element
 * @returns the resource name for this element
 */
export function getResourceName(resource: UI.FlowResource): string {
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
