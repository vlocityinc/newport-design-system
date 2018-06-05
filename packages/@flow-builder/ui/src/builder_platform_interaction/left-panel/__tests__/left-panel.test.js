import { createElement } from 'engine';
import { EditElementEvent, PaletteItemClickedEvent } from 'builder_platform_interaction-events';
import LeftPanel from 'builder_platform_interaction-left-panel';

const createComponentUnderTest = () => {
    const el = createElement('builder_platform_interaction-left-panel', {
        is: LeftPanel
    });
    el.showResourceDetailsPanel = false;
    document.body.appendChild(el);
    return el;
};

describe('left-panel', () => {
    it('checks the default rendering state', () => {
        const leftPanelComponent = createComponentUnderTest();
        return Promise.resolve().then(() => {
            expect(leftPanelComponent.activeTabId).toEqual('left-panel-tabitem-elements');
        });
    });

    it('checks if a resource click dispatches an EditElementEvent with the element guid', () => {
        const leftPanelComponent = createComponentUnderTest();
        const eventCallback = jest.fn();
        leftPanelComponent.addEventListener(EditElementEvent.EVENT_NAME, eventCallback);

        const guid = 'TEST_1';
        const paletteItemClickedEvent = new PaletteItemClickedEvent('VARIABLE', guid);
        leftPanelComponent.querySelector('builder_platform_interaction-left-panel-resources').dispatchEvent(paletteItemClickedEvent);
        return Promise.resolve().then(() => {
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    canvasElementGUID: guid
                }
            });
        });
    });

    it('checks if a EDIT button click dispatches an EditElementEvent with the element guid', () => {
        const leftPanelComponent = createComponentUnderTest();
        const eventCallback = jest.fn();
        leftPanelComponent.addEventListener(EditElementEvent.EVENT_NAME, eventCallback);

        const guid = 'TEST_1';
        const editButtonClickedEvent = new EditElementEvent(guid);
        leftPanelComponent.querySelector('lightning-button').dispatchEvent(editButtonClickedEvent);
        return Promise.resolve().then(() => {
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: {
                    canvasElementGUID: guid
                }
            });
        });
    });
});