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

    getFocusRingCmds() {
        return this.tabFocusRingCmds;
    }

    handleSelectItem(event) {
        this.dispatchEvent(new SelectMenuItemEvent({ value: event.detail.value }));
    }

    calcaulateTabFocusRingIdx(shift: boolean, tabFocusRingIndex: number, tabFocusRingCmds: Array) {
        let newTabFocusRingIdx = shift ? tabFocusRingIndex - 1 : (tabFocusRingIndex + 1) % tabFocusRingCmds.length;
        if (newTabFocusRingIdx === -1) {
            newTabFocusRingIdx = tabFocusRingCmds.length - 1;
        }
        return newTabFocusRingIdx;
    }

    handleTabCommand(shift: boolean) {
        const tabFocusRingIndex = this.tabFocusRingIndex;
        const tabFocusRingCmds = this.getFocusRingCmds();
        this.tabFocusRingIndex = this.calcaulateTabFocusRingIdx(shift, tabFocusRingIndex, tabFocusRingCmds);
        tabFocusRingCmds[this.tabFocusRingIndex]();
    }
}
