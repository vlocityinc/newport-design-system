import { LightningElement, api } from 'lwc';
import { PaletteItemClickedEvent } from 'builder_platform_interaction/events';
import { isChildElement } from 'builder_platform_interaction/elementConfig';
import { isTestMode } from "builder_platform_interaction/contextLib";

/**
 * NOTE: Please do not use this without contacting Process UI DesignTime first!
 *
 * An interim component to give us lightning-tree-grid functionality. This will
 * be removed in the future once lightning-tree-grid satisfies our requirements.
 */

export default class PaletteItem extends LightningElement {
    @api description;
    @api elementType;
    @api guid;
    @api iconName;
    @api label;
    @api iconSize;
    @api dragImageSrc;

    @api
    get elementIcon() {
        return this.template.querySelector('builder_platform_interaction-element-icon');
    }

    @api
    get dragImage() {
        if (typeof this.dragImageSrc !== 'string' || this.dragImageSrc.length === 0) {
            return undefined;
        }

        const img = new Image();
        img.src = this.dragImageSrc;
        return img;
    }

    @api
    get isChildElement() {
        return isChildElement(this.elementType);
    }

    get hasIcon() {
        return this.iconName !== undefined && this.iconName !== null && this.iconName.length > 0;
    }

    /**
     * Is the component running in test mode?
     */
    get isTestMode() {
        return isTestMode();
    }

    /**
     * Build the "test mode only" class used to ease up Selenium effort
     */
    get computedTestClass() {
        return `test-paletteitem-${(this.elementType || '').toLowerCase()}`;
    }

    handleLinkClick(event) {
        event.stopPropagation();
        const elementType = this.elementType;
        const guid = this.guid;
        const paletteItemClickedEvent = new PaletteItemClickedEvent(elementType, guid);
        this.dispatchEvent(paletteItemClickedEvent);
    }

    handleKeyPress(event) {
        switch (event.key) {
            case ' ':
                // The space bar sometimes scrolls the parent container so we
                // need to prevent the default.
                event.preventDefault();
                // fall through
            case 'Enter':
                this.handleLinkClick(event);
                break;
            default:
                // No special handling for any other keys.
                break;
        }
    }
}
