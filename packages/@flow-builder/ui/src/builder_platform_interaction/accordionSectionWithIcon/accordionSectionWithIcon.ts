import LightningAccordionSection from 'lightning/accordionSection';
import { api } from 'lwc';

/**
 * A single section that is nested in an accordion component.
 *
 * @slot actions Placeholder for actionable components, such as lightning-button or lightning-button-menu.
 * Actions are displayed at the top right corner of the accordion section.
 * @slot default Placeholder for your content in the accordion section.
 */
export default class AccordionSectionWithIcon extends LightningAccordionSection {
    /**
     * An object describing the element icon to display.
     * Contains properties - iconName, iconSize, backgroundColor, alternativeText.
     */
    @api elementIcon;

    get iconName(): string {
        return this.elementIcon?.iconName;
    }

    get iconSize(): string {
        return this.elementIcon?.iconSize || '';
    }

    get alternativeText(): string {
        return this.elementIcon?.alternativeText || '';
    }

    get backgroundColor(): string {
        return this.elementIcon?.backgroundColor || '';
    }
}
