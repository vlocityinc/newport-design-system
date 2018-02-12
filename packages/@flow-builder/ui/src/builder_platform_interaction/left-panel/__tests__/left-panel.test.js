import { createElement } from "engine";
import LeftPanel from "builder_platform_interaction-left-panel";

const createComponentUnderTest = () => {
    const el = createElement("builder_platform_interaction-left-panel", {
        is: LeftPanel
    });
    document.body.appendChild(el);
    return el;
};

describe("left-panel", () => {
    it("checks the default rendering state", () => {
        const leftPanelComponent = createComponentUnderTest();
        return Promise.resolve().then(() => {
            expect(leftPanelComponent.activeTabId).toEqual("left-panel-tabitem-elements");
        });
    });
});