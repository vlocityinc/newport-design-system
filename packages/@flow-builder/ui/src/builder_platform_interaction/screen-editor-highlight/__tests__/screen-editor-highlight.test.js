import { createElement } from 'engine';
import ScreenEditorHighlight from 'builder_platform_interaction-screen-editor-highlight';
import { SCREEN_EDITOR_EVENT_NAME } from 'builder_platform_interaction-events';

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-screen-editor-highlight', { is: ScreenEditorHighlight });
    Object.assign(el, props);
    document.body.appendChild(el);
    return el;
}

describe('Click highlight', () => {
    let highlight;
    beforeEach(() => {
        highlight = createComponentForTest({
            screenElement: {
                name: {value : "Name", error: null},
                fieldType: "InputField",
                fieldText: {value: "Name", error: null},
                dataType: "String",
                type: { dataType: "String", label: "Text Field"}
            }
        });
    });
    it('clicking on highlight component fires correct event', () => {
        return Promise.resolve().then(() => {
            const hightlistDiv = highlight.querySelector('div.highlight');
            const callback = jest.fn();
            highlight.addEventListener(SCREEN_EDITOR_EVENT_NAME.SCREEN_ELEMENT_SELECTED, callback);
            hightlistDiv.click();
            expect(callback).toHaveBeenCalled();
        });
    });
});

