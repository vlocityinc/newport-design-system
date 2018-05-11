import { createElement } from 'engine';
import LeftPanelResources from 'builder_platform_interaction-left-panel-resources';

const selectors = {
    root: '.left-panel-resources',
    addnewresource: '.test-left-panel-add-resource',
};

const createComponentUnderTest = () => {
    const el = createElement("builder_platform_interaction-left-panel-resources", {
        is: LeftPanelResources
    });
    document.body.appendChild(el);
    return el;
};

describe("left-panel-resources", () => {
    describe('New Resource BUTTON', () => {
        it('Label name should be New Resource ', () => {
            const leftPanelComponent = createComponentUnderTest();
            expect(leftPanelComponent.querySelector(selectors.addnewresource).label).toEqual("New Resource");
        });
        it('fires add event when NEW RESOURCE button is clicked', () => {
            const leftPanelComponent = createComponentUnderTest();

            return Promise.resolve().then(() => {
                const eventCallback = jest.fn();
                leftPanelComponent.addEventListener('addnewresource', eventCallback);
                leftPanelComponent.querySelector(selectors.addnewresource).click();
                expect(eventCallback).toHaveBeenCalled();
            });
        });
    });
});