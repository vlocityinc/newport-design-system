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
};

type PaletteItem = {
    apiName: string;
    description: string;
    guid: string;
    iconName: string;
    label: string;
    fieldTypeName: string;
};

type PaletteSection = {
    guid: string;
    label: string;
    _children: PaletteItem[];
};
