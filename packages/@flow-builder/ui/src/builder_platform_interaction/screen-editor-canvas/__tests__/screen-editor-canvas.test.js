import { createElement } from 'engine';
import ScreenEditorCanvas from '../screen-editor-canvas';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-editor-canvas', {
        is: ScreenEditorCanvas
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

describe('screen-editor-canvas', () => {
    it('displays the help icon when there is help text', () => {
        const screenEditorCanvasElement = createComponentUnderTest({
            screen: {helpText: "help!!", showHeader: true}
        });
        return Promise.resolve().then(() => {
            const helpIcon = screenEditorCanvasElement.querySelector('lightning-button-icon');
            expect(helpIcon).toBeDefined();
        });
    });
});
