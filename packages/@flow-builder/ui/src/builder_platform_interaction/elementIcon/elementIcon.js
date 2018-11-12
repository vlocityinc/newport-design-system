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
        let commonClasses;
        if (this.iconName === 'standard:decision') {
            commonClasses =  'rotate-icon-svg';
        } else if (this.iconName === 'standard:flow' || this.iconName === 'standard:email' || this.iconName === 'standard:custom_notification') {
            // 'action' types must all have the same background color
            commonClasses = 'slds-m-right_x-small';
            commonClasses = this.updateClassesForNonCanvasElements('action-icon', commonClasses);
        } else {
             commonClasses = 'slds-m-right_x-small';
             commonClasses = this.updateClassesForNonCanvasElements('', commonClasses);
        }
        return commonClasses;
    }
}
