import { LightningElement, api } from 'lwc';

export default class LightningVerticalNavigationItemIcon extends LightningElement {
    @api label;
    @api name;
    @api iconName;

    handleClick(event) {
        event.stopPropagation();
        this.dispatchEvent(
            new CustomEvent('select', {
                bubbles: true,
                composed: true,
                detail: {
                    name: this.name
                },
            })
        );
    }
}