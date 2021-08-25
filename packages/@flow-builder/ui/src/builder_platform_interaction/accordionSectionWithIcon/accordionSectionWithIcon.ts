import { api } from 'lwc';
import LightningAccordionSection from 'lightning/accordionSection';

/**
 * A single section that is nested in an accordion component.
 *
 * @slot actions Placeholder for actionable components, such as lightning-button or lightning-button-menu.
 * Actions are displayed at the top right corner of the accordion section.
 * @slot default Placeholder for your content in the accordion section.
 */
export default class AccordionSectionWithIcon extends LightningAccordionSection {
    _iconClass = '';

    /**
     * The icon name for the corresponding element
     *
     * @type {string}
     */
    @api iconName!: string;

    /**
     * The size of the icon
     *
     * @type {string}
     */
    @api iconSize!: string;

    /**
     * The icon variant for the corresponding element
     *
     * @type {string}
     */
    @api iconVariant!: string;

    /**
     * The container class for the div in which the icon is nested
     *
     * @type {string}
     */
    @api containerClass!: string;

    /**
     * The alternative text for the icon
     *
     * @type {string}
     */
    @api alternativeText!: string;

    @api set iconClass(value) {
        this._iconClass = value || '';
    }

    get iconClass() {
        return 'slds-col slds-grow-none ' + this._iconClass;
    }
}
