import { LightningElement, api } from 'lwc';
import { isChildElement } from 'builder_platform_interaction/elementConfig';
import { isTestMode } from 'builder_platform_interaction/contextLib';
import { lwcUtils } from 'builder_platform_interaction/sharedUtils';

const selectors = {
    elementIcon: 'builder_platform_interaction-element-icon'
};

/**
 * NOTE: Please do not use this without contacting Process UI DesignTime first!
 *
 * An interim component to give us lightning-tree-grid functionality. This will
 * be removed in the future once lightning-tree-grid satisfies our requirements.
 */

export default class PaletteItem extends LightningElement {
    dom = lwcUtils.createDomProxy(this, selectors);

    @api description;
    @api elementType;
    @api elementSubtype;
    @api guid;
    @api iconName;
    @api label;
    @api iconSize;
    @api dragImageSrc;
    @api iconBackgroundColor;

    @api
    get elementIcon() {
        return this.dom.elementIcon;
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
}
