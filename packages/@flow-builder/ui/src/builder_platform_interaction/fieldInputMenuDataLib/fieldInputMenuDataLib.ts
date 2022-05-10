import { FLOW_DATA_TYPE, getDataTypeLabel, isComplexType } from 'builder_platform_interaction/dataTypeLib';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { getEntity } from 'builder_platform_interaction/sobjectLib';
import { LABELS } from './fieldInputMenuDataLibLabels';
const { format } = commonUtils;

type CategoryConfig = {
    label: string;
    isElementCategory?: boolean;
    hideFromFirstLevel?: boolean;
};

enum SystemAndGlobalVariableName {
    Api = '$Api',
    Label = '$Label',
    Organization = '$Organization',
    Permission = '$Permission',
    Profile = '$Profile',
    Setup = '$Setup',
    System = '$System',
    User = '$User',
    UserRole = '$UserRole',
    Flow = '$Flow',
    Client = '$Client',
    Orchestration = '$Orchestration',
    Record = '$Record',
    RecordPrior = '$Record__Prior'
}
enum GlobalConstantsName {
    True = '$GlobalConstant.True',
    False = '$GlobalConstant.False',
    EmptyString = '$GlobalConstant.EmptyString'
}

export const systemAndGlobalVariableSectionLabel = LABELS.globalResources;
export const globalConstantsLabel = LABELS.globalValues;

export const globalConstantsMap: Map<GlobalConstantsName, VariablesConfig> = new Map<
    GlobalConstantsName,
    VariablesConfig
>([
    [
        GlobalConstantsName.True,
        {
            label: LABELS.globalValueTrue,
            description: LABELS.globalValueTrueDescription,
            iconName: 'icon'
        }
    ],
    [
        GlobalConstantsName.False,
        {
            label: LABELS.globalValueFalse,
            description: LABELS.globalValueFalseDescription,
            iconName: 'icon'
        }
    ],
    [
        GlobalConstantsName.EmptyString,
        {
            label: LABELS.globalValueEmptyString,
            description: LABELS.globalValueEmptyStringDescription,
            iconName: 'icon'
        }
    ]
]);

export const systemAndGlobalVariablesMap: Map<SystemAndGlobalVariableName, SystemAndGlobalVariablesConfig> = new Map<
    SystemAndGlobalVariableName,
    SystemAndGlobalVariablesConfig
>([
    [
        SystemAndGlobalVariableName.Record,
        {
            label: LABELS.globalRecordLabel,
            hasLabelSubtypeParam: true,
            description: LABELS.globalRecordDescription,
            hasDescriptionSubtypeParam: true,
            iconName: 'icon'
        }
    ],
    [
        SystemAndGlobalVariableName.RecordPrior,
        {
            label: LABELS.globalRecordPriorValueLabel,
            hasLabelSubtypeParam: true,
            description: LABELS.globalRecordPriorValueDescription,
            hasDescriptionSubtypeParam: true,
            iconName: 'icon'
        }
    ],
    [
        SystemAndGlobalVariableName.Flow,
        { label: LABELS.globalFlowLabel, description: LABELS.globalFlowDescription, iconName: 'icon' }
    ],
    [
        SystemAndGlobalVariableName.Organization,
        { label: LABELS.globalOrgLabel, description: LABELS.globalOrgDescription, iconName: 'icon' }
    ],
    [SystemAndGlobalVariableName.Label, { label: 'tdb', description: 'tbd', iconName: 'icon' }],
    [SystemAndGlobalVariableName.Setup, { label: 'tbd', description: 'tbd', iconName: 'icon' }],
    [
        SystemAndGlobalVariableName.User,
        { label: LABELS.globalUserLabel, description: LABELS.globalUserDescription, iconName: 'icon' }
    ],
    [
        SystemAndGlobalVariableName.UserRole,
        { label: LABELS.globalUserRoleLabel, description: LABELS.globalUserRoleDescription, iconName: 'icon' }
    ],
    [
        SystemAndGlobalVariableName.Profile,
        { label: LABELS.globalUserProfileLabel, description: LABELS.globalUserProfileDescription, iconName: 'icon' }
    ],
    [SystemAndGlobalVariableName.Permission, { label: 'tbd', description: 'tbd', iconName: 'icon' }],
    [SystemAndGlobalVariableName.Client, { label: 'tbd', description: 'tbd', iconName: 'icon' }],
    [
        SystemAndGlobalVariableName.Api,
        { label: LABELS.globalApiLabel, description: LABELS.globalApiDescription, iconName: 'icon' }
    ],
    [
        SystemAndGlobalVariableName.System,
        { label: LABELS.globalSystemLabel, description: LABELS.globalSystemDescription, iconName: 'icon' }
    ]
]);

const fieldInputCategoryMap: Record<UI.FieldInputCategory, CategoryConfig> = {
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

const filterCategoryAndMapToLabel = (categoryFilter: (category: CategoryConfig) => boolean) => {
    return Object.values(fieldInputCategoryMap)
        .filter(categoryFilter)
        .reduce((acc, cat) => {
            acc.push(cat.label);
            return acc;
        }, [] as string[]);
};
export const getElementCategoriesLabelSortedAlphabetically = filterCategoryAndMapToLabel(
    (category) => category.isElementCategory === true
).sort((label1, label2) => label1.localeCompare(label2));
export const getFirstLevelNonElementCategories = filterCategoryAndMapToLabel(
    (category) => category.isElementCategory !== true && category.hideFromFirstLevel !== true
);

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
export function getResourceCategory({
    dataType,
    elementType,
    storeOutputAutomatically = false,
    isCollection = false,
    elementSubtype
}: UI.FlowResource): string {
    let categoryLabel;

    if (storeOutputAutomatically || !isComplexType(dataType) || dataType === FLOW_DATA_TYPE.ORCHESTRATED_STAGE.value) {
        if (storeOutputAutomatically || !isCollection) {
            const config = getConfigForElementType(elementSubtype || elementType);
            categoryLabel = config.fieldInputCategory && fieldInputCategoryMap[config.fieldInputCategory].label;
        } else {
            categoryLabel = LABELS.simpleCollections;
        }
    } else if (dataType === FLOW_DATA_TYPE.SOBJECT.value) {
        categoryLabel = isCollection ? LABELS.recordCollections : LABELS.recordVariables;
    } else if (dataType === FLOW_DATA_TYPE.APEX.value) {
        categoryLabel = isCollection ? LABELS.apexCollections : LABELS.apexVariables;
    }
    return categoryLabel;
}

/**
 * Get the formatted name filled with resource related entity label
 *
 * @param {Object} resource - the element
 * @param {string} elementName - the element name
 * @param {string} labelWithTokens - used to format the resulting name with entity label if any (eg: "{0} from {1}")
 * @returns {string} formatted name if any entity label found the given element name otherwise
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
 * @param {Object} resource - the element
 * @returns {string} the resource name for this element
 */
export function getResourceName(resource: UI.FlowResource): string {
    let name = (resource as UI.HydratedElement).name?.value || resource.name!;
    if (resource.storeOutputAutomatically) {
        if (resource.dataType === FLOW_DATA_TYPE.SOBJECT.value && resource.elementType !== ELEMENT_TYPE.LOOP) {
            // "Accounts from resourceName" (get record, action with sobject anonymous output...)
            name = formatWithEntityLabel(resource, name, LABELS.recordLookupAsResourceText);
        } else if (resource.elementType === ELEMENT_TYPE.RECORD_CREATE) {
            // "AccountId from myCreateRecord"
            name = formatWithEntityLabel(resource, name, LABELS.recordCreateIdAsResourceText);
        } else if (resource.elementType === ELEMENT_TYPE.LOOP) {
            // Current Item from Loop myLoop
            name = format(LABELS.loopAsResourceText, name);
        } else if (resource.dataType === FLOW_DATA_TYPE.LIGHTNING_COMPONENT_OUTPUT.value) {
            // "Outputs from myLC"
            name = format(LABELS.lightningComponentScreenFieldAsResourceText, name);
        } else if (resource.dataType === FLOW_DATA_TYPE.ACTION_OUTPUT.value) {
            // "Outputs from myAction
            name = format(LABELS.actionAsResourceText, name);
        } else if (isAnonymousPrimitiveOutputResource(resource)) {
            const dataTypeLabel = resource.apexClass ? resource.apexClass : getDataTypeLabel(resource.dataType);
            name = resource.isCollection
                ? format(
                      LABELS.actionAnonymousPrimitiveAsResourceText,
                      format(LABELS.collectionDataType, dataTypeLabel),
                      name
                  )
                : format(LABELS.actionAnonymousPrimitiveAsResourceText, dataTypeLabel, name);
        } else if (resource.dataType === FLOW_DATA_TYPE.SUBFLOW_OUTPUT.value) {
            // "Outputs from mySubflow"
            name = format(LABELS.subflowAsResourceText, name);
        }
    }
    return name;
}
