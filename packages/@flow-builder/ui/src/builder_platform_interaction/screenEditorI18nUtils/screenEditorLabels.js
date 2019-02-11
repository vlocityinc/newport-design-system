/* Labels */
import errorRequired from "@salesforce/label/FlowBuilderScreenEditor.errorRequired";
// import reviewErrors from '@salesforce/label/FlowBuilderScreenEditor.reviewErrors';
import screen from "@salesforce/label/FlowBuilderScreenEditor.screen";
import screenProperties from "@salesforce/label/FlowBuilderScreenEditor.screenProperties";
import screenTitlePlaceHolder from "@salesforce/label/FlowBuilderScreenEditor.screenTitlePlaceHolder";
import finish from "@salesforce/label/FlowBuilderScreenEditor.finish";
import previous from "@salesforce/label/FlowBuilderScreenEditor.previous";
import pause from "@salesforce/label/FlowBuilderScreenEditor.pause";
import header from "@salesforce/label/FlowBuilderScreenEditor.header";
import footer from "@salesforce/label/FlowBuilderScreenEditor.footer";
import fieldExtensionPreviewDescription from "@salesforce/label/FlowBuilderScreenEditor.fieldExtensionPreviewDescription";
import paletteTitle from "@salesforce/label/FlowBuilderScreenEditor.paletteTitle";
import paletteSearch from "@salesforce/label/FlowBuilderScreenEditor.paletteSearch";
import paletteSearchPlaceholder from "@salesforce/label/FlowBuilderScreenEditor.paletteSearchPlaceholder";
import fieldCategoryInput from "@salesforce/label/FlowBuilderScreenEditor.fieldCategoryInput";
import fieldCategoryDisplay from "@salesforce/label/FlowBuilderScreenEditor.fieldCategoryDisplay";
import fieldCategoryCustom from '@salesforce/label/FlowBuilderScreenEditor.fieldCategoryCustom';
import fieldDataType from '@salesforce/label/FlowBuilderScreenEditor.dataType';
import fieldDefaultValue from '@salesforce/label/FlowBuilderScreenEditor.defaultValue';
import fieldLabel from '@salesforce/label/FlowBuilderScreenEditor.fieldLabel';
import fieldName from "@salesforce/label/FlowBuilderScreenEditor.fieldName";
import fieldScale from '@salesforce/label/FlowBuilderScreenEditor.scale';
import fieldTypeLabelTextField from "@salesforce/label/FlowBuilderScreenEditor.fieldTypeLabelTextField";
import fieldTypeLabelLargeTextArea from "@salesforce/label/FlowBuilderScreenEditor.fieldTypeLabelLargeTextArea";
import fieldTypeLabelNumber from "@salesforce/label/FlowBuilderScreenEditor.fieldTypeLabelNumber";
import fieldTypeLabelCurrency from "@salesforce/label/FlowBuilderScreenEditor.fieldTypeLabelCurrency";
import fieldTypeLabelCheckbox from "@salesforce/label/FlowBuilderScreenEditor.fieldTypeLabelCheckbox";
import fieldTypeLabelChoice from "@salesforce/label/FlowBuilderScreenEditor.fieldTypeLabelChoice";
import fieldTypeLabelDate from "@salesforce/label/FlowBuilderScreenEditor.fieldTypeLabelDate";
import fieldTypeLabelDateTime from "@salesforce/label/FlowBuilderScreenEditor.fieldTypeLabelDateTime";
import fieldTypeLabelPassword from "@salesforce/label/FlowBuilderScreenEditor.fieldTypeLabelPassword";
import fieldTypeLabelRadioButtons from "@salesforce/label/FlowBuilderScreenEditor.fieldTypeLabelRadioButtons";
import fieldTypeLabelMultiSelectCheckboxes from "@salesforce/label/FlowBuilderScreenEditor.fieldTypeLabelMultiSelectCheckboxes";
import fieldTypeLabelMultiSelectPicklist from "@salesforce/label/FlowBuilderScreenEditor.fieldTypeLabelMultiSelectPicklist";
import fieldTypeLabelPicklist from "@salesforce/label/FlowBuilderScreenEditor.fieldTypeLabelPicklist";
import fieldTypeLabelDisplayText from "@salesforce/label/FlowBuilderScreenEditor.fieldTypeLabelDisplayText";
import addChoice from '@salesforce/label/FlowBuilderScreenEditor.addChoice';
import choices from '@salesforce/label/FlowBuilderScreenEditor.choices';
import buttonHelpTextAltText from "@salesforce/label/FlowBuilderScreenEditor.buttonHelpTextAltText";
import screenContainerOptions from "@salesforce/label/FlowBuilderScreenEditor.screenContainerOptions";
import screenContainerTooltip from "@salesforce/label/FlowBuilderScreenEditor.screenContainerTooltip";
import showHeader from "@salesforce/label/FlowBuilderScreenEditor.showHeader";
import showFooter from "@salesforce/label/FlowBuilderScreenEditor.showFooter";
import navigationOptions from "@salesforce/label/FlowBuilderScreenEditor.navigationOptions";
import navigationOptionsTooltip from "@salesforce/label/FlowBuilderScreenEditor.navigationOptionsTooltip";
import allowFinishButton from "@salesforce/label/FlowBuilderScreenEditor.allowFinishButton";
import allowPreviousButton from "@salesforce/label/FlowBuilderScreenEditor.allowPreviousButton";
import allowPauseButton from "@salesforce/label/FlowBuilderScreenEditor.allowPauseButton";
import allowPauseButtonTooltip from "@salesforce/label/FlowBuilderScreenEditor.allowPauseButtonTooltip";
import pauseConfirmationMessage from "@salesforce/label/FlowBuilderScreenEditor.pauseConfirmationMessage";
import pauseConfirmationMessageTooltip from "@salesforce/label/FlowBuilderScreenEditor.pauseConfirmationMessageTooltip";
import helpTextForAccordion from "@salesforce/label/FlowBuilderScreenEditor.helpTextForAccordion";
import helpSectionHeader from "@salesforce/label/FlowBuilderScreenEditor.helpSectionHeader";
import required from "@salesforce/label/FlowBuilderScreenEditor.required";
import errorMessage from "@salesforce/label/FlowBuilderScreenEditor.errorMessage";
import deleteAlternativeText from "@salesforce/label/FlowBuilderScreenEditor.deleteAlternativeText";
import cancel from "@salesforce/label/FlowBuilderScreenEditor.cancel";
import deleteConfirmation from "@salesforce/label/FlowBuilderScreenEditor.deleteConfirmation";
import deleteConsequence from "@salesforce/label/FlowBuilderScreenEditor.deleteConsequence";
import errorIconTitle from "@salesforce/label/FlowBuilderScreenEditor.errorIconTitle";
import togglePropertiesPanelTitle from "@salesforce/label/FlowBuilderScreenEditor.togglePropertiesPanelTitle";
import apiNameLabel from "@salesforce/label/FlowBuilderScreenEditor.apiNameLabel";
import spinnerAlternativeText from "@salesforce/label/FlowBuilderEditor.spinnerAlternativeText";
import extensionOutputsHeader from "@salesforce/label/FlowBuilderScreenEditor.extensionOutputsHeader";
import fieldValidation from '@salesforce/label/FlowBuilderScreenEditor.fieldValidation';
import validationFormula from '@salesforce/label/FlowBuilderFormulaTextarea.formulaValidationSpinnerAlternativeText';
import noDefaultValueSelected from "@salesforce/label/FlowBuilderScreenEditor.noDefaultValueSelected";
import selectResource from '@salesforce/label/FlowBuilderScreenEditor.selectResource';
import invalidScreen from '@salesforce/label/FlowBuilderScreenEditor.invalidScreen';
import invalidScreenfield from '@salesforce/label/FlowBuilderScreenEditor.invalidScreenfield';
import textDataType from '@salesforce/label/FlowBuilderDataTypes.textDataTypeLabel';
import numberDataType from '@salesforce/label/FlowBuilderDataTypes.numberDataTypeLabel';
import currencyDataType from '@salesforce/label/FlowBuilderDataTypes.currencyDataTypeLabel';
import booleanDataType from '@salesforce/label/FlowBuilderDataTypes.booleanDataTypeLabel';
import dateDataType from '@salesforce/label/FlowBuilderDataTypes.dateDataTypeLabel';
import dateTimeDataType from '@salesforce/label/FlowBuilderDataTypes.dateTimeDataTypeLabel';
import dynamicRecordChoiceLabel from '@salesforce/label/FlowBuilderNewResource.dynamicRecordChoiceLabel';
import appExchangeLink from '@salesforce/label/FlowBuilderScreenEditor.appExchangeLink';

export const LABELS = {
    errorRequired,
    // reviewErrors, -- Not used as of 5/23/18, not removing it as it may be needed before GA, revisit in 218-220
    screen,
    screenProperties,
    screenTitlePlaceHolder,
    finish,
    previous,
    pause,
    header,
    footer,
    fieldExtensionPreviewDescription,
    paletteTitle,
    paletteSearch,
    paletteSearchPlaceholder,
    errorMessage,
    fieldCategoryInput,
    fieldCategoryDisplay,
    fieldCategoryCustom,
    fieldDataType,
    fieldDefaultValue,
    fieldLabel,
    fieldName,
    fieldScale,
    fieldTypeLabelTextField,
    fieldTypeLabelLargeTextArea,
    fieldTypeLabelNumber,
    fieldTypeLabelCheckbox,
    fieldTypeLabelChoice,
    fieldTypeLabelCurrency,
    fieldTypeLabelDate,
    fieldTypeLabelDateTime,
    fieldTypeLabelPassword,
    fieldTypeLabelRadioButtons,
    fieldTypeLabelMultiSelectCheckboxes,
    fieldTypeLabelMultiSelectPicklist,
    fieldTypeLabelPicklist,
    fieldTypeLabelDisplayText,
    fieldValidation,
    choices,
    buttonHelpTextAltText,
    screenContainerOptions,
    screenContainerTooltip,
    showHeader,
    showFooter,
    navigationOptions,
    navigationOptionsTooltip,
    allowFinishButton,
    allowPreviousButton,
    allowPauseButton,
    allowPauseButtonTooltip,
    pauseConfirmationMessage,
    pauseConfirmationMessageTooltip,
    helpTextForAccordion,
    helpSectionHeader,
    required,
    deleteAlternativeText,
    cancel,
    deleteConfirmation,
    deleteConsequence,
    errorIconTitle,
    togglePropertiesPanelTitle,
    apiNameLabel,
    spinnerAlternativeText,
    extensionOutputsHeader,
    validationFormula,
    addChoice,
    noDefaultValueSelected,
    selectResource,
    invalidScreen,
    invalidScreenfield,
    textDataType,
    numberDataType,
    currencyDataType,
    booleanDataType,
    dateDataType,
    dateTimeDataType,
    dynamicRecordChoiceLabel,
    appExchangeLink,
};