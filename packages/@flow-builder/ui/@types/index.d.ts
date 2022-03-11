// Add global types for @flow-builder/ui here
declare module 'mock*';
declare module '*.json';
declare module 'lwc';

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

type MenuTraversalConfig = {
    // if false, then all menu items will have hasNext set to false regardless of the real value
    isEnabled?: boolean;
    allowSObjectFieldsTraversal?: boolean;
    // whether or not to set hasNext on SObject
    allowSObjectField?: boolean;
    // whether or not to set hasNext on Elements
    allowElementFields?: boolean;
};

/**
 * Set of filters that can be used to filter out what does show up in menus (e.g. combobox)
 */
type MenuFilter = {
    // whether or not to include new resource
    includeNewResource?: boolean;
    // whether or not to include global constants (true/false/...)
    allowGlobalConstants?: boolean;
    // whether or not to include system variables
    showSystemVariables?: boolean;
    // whether or not to include global variables
    showGlobalVariables?: boolean;
    // whether or not apex collection from anonymous automatic outputs are allowed
    allowsApexCollAnonymousAutoOutput?: boolean;
    // whether or not this request is coming from a formula editor
    forFormula?: boolean;
    // whether or not included values should be writable
    shouldBeWritable?: boolean;
    // whether or not the flow system variable ($Flow) should be filtered out
    showFlowSystemVariable?: boolean;
};

type MenuConfig = {
    newResourceTypeLabel?: string | null;
    traversalConfig?: MenuTraversalConfig;
    // the picklist values that will be appended to the menu data if picklist values are allowed
    activePicklistValues?: string[];
    filter: MenuFilter;
};
