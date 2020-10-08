// Add global types for @flow-builder/ui here
declare module 'mock*';
declare module '*.json';

/**
 * Combobox configuration (used by pickers such as BaseResourcePicker, FerovResourcePicker for instance
 */
type ComboboxConfig = {
    label?: string;
    placeholder?: string;
    errorMessage?: string;
    literalsAllowed?: boolean;
    required?: boolean;
    disabled?: boolean;
    type?: string;
    enableFieldDrilldown?: boolean;
    allowSObjectFields?: boolean;
    variant?: string;
    fieldLevelHelp?: string;
};
