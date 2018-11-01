import { LightningElement, api } from 'lwc';

export default class ElementIcon extends LightningElement {
    @api iconName;
    @api iconSize;
    @api isCanvasElementIcon = false;
    @api isDraggable = false;
    @api title = '';
    @api alternativeText = '';

    @api
    get iconElement() {
        return this.template.querySelector('.drag-element');
    }

    updateClassesForNonCanvasElements(baseClasses, commonClasses) {
        if (!this.isCanvasElementIcon) {
            const updatedBaseClasses = `${baseClasses} ${commonClasses}`;
            return this.updateClassesForDraggableElements(updatedBaseClasses);
        }
        return baseClasses;
    }

    updateClassesForDraggableElements(baseClasses) {
        if (this.isDraggable) {
            return `${baseClasses} drag-element`;
        }
        return baseClasses;
    }

    get containerClass() {
        if (this.iconName === 'standard:decision') {
            const baseClasses = 'rotate-icon-container slds-icon-standard-decision';
            const commonClasses = 'non-canvas-decision-icon slds-m-right_x-small';
            return this.updateClassesForNonCanvasElements(baseClasses, commonClasses);
        }
        return '';
    }

    get svgClass() {
        if (this.iconName === 'standard:decision') {
            return 'rotate-icon-svg';
        }
        const commonClasses = 'slds-m-right_x-small';
        return this.updateClassesForNonCanvasElements('', commonClasses);
    }
}
