// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { getStyleFromGeometry } from 'builder_platform_interaction/alcComponentsUtils';
import { SelectMenuItemEvent } from 'builder_platform_interaction/alcEvents';

export default class Menu extends LightningElement {
    @api top;
    @api left;
    @api items;

    @api
    moveFocusToMenu;

    tabFocusRingIndex = 0;

    tabFocusRingCmds = [() => {}];

    get style() {
        return getStyleFromGeometry({ y: this.top + 10, x: this.left });
    }

    handleSelectItem(event) {
        this.dispatchEvent(new SelectMenuItemEvent({ value: event.detail.value }));
    }

    calcaulateTabFocusRingIdx(shift: boolean, tabFocusRingIndex: number) {
        let newTabFocusRingIdx = shift ? tabFocusRingIndex - 1 : (tabFocusRingIndex + 1) % this.tabFocusRingCmds.length;
        if (newTabFocusRingIdx === -1) {
            newTabFocusRingIdx = this.tabFocusRingCmds.length - 1;
        }
        return newTabFocusRingIdx;
    }

    handleTabCommand(shift: boolean) {
        const tabFocusRingIndex = this.tabFocusRingIndex;
        this.tabFocusRingIndex = this.calcaulateTabFocusRingIdx(shift, tabFocusRingIndex);
        this.tabFocusRingCmds[this.tabFocusRingIndex]();
    }
}
