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
    disableAddElements: boolean;
    disableSelectConnectors: boolean;
    disableMultiSelectElements: boolean;
};
