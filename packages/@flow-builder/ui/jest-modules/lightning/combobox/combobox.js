import { LightningElement, api } from 'lwc';

/**
 * Dummy lightning button component for use by Jest tests
 *
 * @ScrumTeam Process UI
 * @author Jesenia Garcia-Rovetta
 * @since 214
 */
export default class LightningCombobox extends LightningElement {
@api name;
@api value;
@api label;
@api disabled;
@api options;
@api spinnerActive;
@api placeholder;
@api fieldLevelHelp;
@api required;
@api dropdownAlignment;
@api setCustomValidity = jest.fn();
@api showHelpMessageIfInvalid = jest.fn();
@api checkValidity = jest.fn();
@api messageWhenValueMissing;
@api separator;
}