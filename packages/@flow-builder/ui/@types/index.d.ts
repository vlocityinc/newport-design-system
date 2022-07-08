// Add global types for @flow-builder/ui here
declare module 'mock*';
declare module '*.json';

/**
 * Combobox configuration (used by pickers such as BaseResourcePicker, FerovResourcePicker for instance
 */
type ComboboxConfig = {
    /**
     * @summary combobox label
     */
    label?: string;
    /**
     * @summary combobox placeholder
     */
    placeholder?: string;
    /**
     * @summary combobox error message if any
     */
    errorMessage?: string;
    /**
     * @summary are literals allowed?
     */
    literalsAllowed?: boolean;
    /**
     * @summary is combobox required field?
     */
    required?: boolean;
    /**
     * @summary is combobox disabled?
     */
    disabled?: boolean;
    /**
     * @summary combobox type
     */
    type?: string;
    /**
     * @summary is field drilldown enabled?
     */
    enableFieldDrilldown?: boolean;
    /**
     * @summary are SObject fields allowed?
     */
    allowSObjectFields?: boolean;
    /**
     * @summary combobox variant
     */
    variant?: string;
    /**
     * @summary field level help
     */
    fieldLevelHelp?: string;
    /**
     * @summary do we include the related fields
     */
    includeEntityRelatedRecordFields?: boolean;
};

type FieldDefinition = {
    dataType: string;
    editable: boolean;
    creatable: boolean;
    apiName: string;
    required: boolean;
    label: string;
    relationshipName: string | null;
    compoundFieldName: string | null;
    extraTypeInfo: string | null;
    fieldDataType: string;
    inlineHelpText: string | null;
    precision: number;
    scale: number;
    length: number;
    supportedByAutomaticField: boolean;
};

interface ScreenPaletteItem {
    description: string;
    guid: string;
    iconName: string;
    label: string;
}

interface ScreenAutomaticFieldPaletteItem extends ScreenPaletteItem {
    apiName: string;
    fieldTypeName: string;
    objectFieldReference: string;
}

type ScreenPaletteSection = {
    guid: string;
    label: string;
    _children: ScreenPaletteItem[];
};

type RuleSet = Record<string, any>;

type CanvasConfig = {
    disableAddConnectors: boolean;
    disableDeleteConnectors: boolean;
    disableDeleteElements: boolean;
    disableDragElements: boolean;
    disableSelectConnectors: boolean;
    disableMultiSelectElements: boolean;
};

type MenuTraversalConfig = Readonly<{
    // if false, then all menu items will have hasNext set to false regardless of the real value
    isEnabled?: boolean;
    allowSObjectFieldsTraversal?: boolean;
    // whether or not to set hasNext on SObject
    allowSObjectField?: boolean;
    // whether or not to set hasNext on Elements
    allowElementFields?: boolean;
}>;

/**
 * Set of filters that can be used to filter out what does show up in menus (e.g. combobox)
 */
type MenuFilter = Readonly<{
    // whether or not to include new resource
    includeNewResource?: boolean;
    // whether or not to include global constants (true/false/...)
    allowGlobalConstants?: boolean;
    // whether or not to include system variables
    showSystemVariables?: boolean;
    // whether or not to include global variables
    showGlobalVariables?: boolean;
    // whether or not apex collection from anonymous automatic outputs are allowed
    allowsApexCallAnonymousAutoOutput?: boolean;
    // whether or not this request is coming from a formula editor
    forFormula?: boolean;
    // whether or not included values should be writable
    shouldBeWritable?: boolean;
    // whether or not the flow system variable ($Flow) should be filtered out
    showFlowSystemVariable?: boolean;
    // list of category labels that defines which categories to show. an empty array means nothing is filtered
    categoriesToInclude?: string[];
    // whether or not the $Record system variable should be filtered out
    hideRecordSystemVariable?: boolean;
    // whether or not the entity related fields ar includes
    includeEntityRelatedRecordFields?: boolean;
}>;

type MenuConfig = Readonly<{
    newResourceTypeLabel?: string | null;
    traversalConfig?: MenuTraversalConfig;
    // the picklist values that will be appended to the menu data if picklist values are allowed
    activePicklistValues?: UI.Options;
    filter: MenuFilter;
}>;

type IconInfo = {
    iconName: string;
    iconSize: 'x-small' | 'small';
};

type VariablesConfig = {
    label: string;
    description: string;
} & IconInfo;

type SystemAndGlobalVariablesConfig = VariablesConfig & {
    hasLabelSubtypeParam?: boolean;
    hasDescriptionSubtypeParam?: boolean;
};

type Rule = {
    canBeApexProperty: CanBe;
    canBeSobjectField: CanBe;
    canBeSystemVariable: CanBe;
    cannotBeElements: ElementType[];
    collection: boolean;
    dataType: DataType;
    mustBeElements: ElementType[];
    null: boolean;
    paramType: ParamType;
};

type RuleMap = { [key: string]: Rule[] };
type CanBe = 'CanBe';
type ElementType = any;
type DataType = string;
type ParamType = string;

type ProcessTypeFeatures =
    | 'StoreOutputAutomatically'
    | 'ConfigurableStart'
    | 'LookupTraversal'
    | 'DynamicTypes'
    | 'RollbackModeInDebug'
    | 'IsDebugAsUserAllowedInNonPrd'
    | 'GlobalVariables';

type FlowProcessType =
    | 'ActionCadenceFlow'
    | 'ActionPlan'
    | 'Appointments'
    | 'AutoLaunchedFlow'
    | 'Orchestrator'
    | 'CheckoutFlow'
    | 'ContactRequestFlow'
    | 'CustomEvent'
    | 'DigitalForm'
    | 'FieldServiceMobile'
    | 'FieldServiceWeb'
    | 'Flow'
    | 'Form'
    | 'InvocableProcess'
    | 'LoginFlow'
    | 'JourneyBuilderIntegration'
    | 'Journey'
    | 'ManagedContentFlow'
    | 'OrchestrationFlow'
    | 'Survey'
    | 'TransactionSecurityFlow'
    | 'UserProvisioningFlow'
    | 'Workflow'
    | 'SalesEntryExperienceFlow'
    | 'FSCLending'
    | 'RoutingFlow'
    | 'RecommendationStrategy'
    | 'EvaluationFlow'
    | 'CMSOrchestrator';
