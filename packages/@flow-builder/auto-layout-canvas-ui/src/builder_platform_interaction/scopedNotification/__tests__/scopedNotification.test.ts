import { AutoLayoutCanvasMode } from 'builder_platform_interaction/alcComponentsUtils';
import { INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import { createComponent } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { removeDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils/domTestUtils';
import { ToggleSelectionModeEvent } from 'builder_platform_interaction/events';

const SELECT_BODY_TEXT = 'Select elements to perform batch actions...';
const CONNECT_BODY_TEXT = 'Select an element to connect to...';

jest.mock('@salesforce/label/FlowBuilderScopedNotification.selectBodyText', () => ({ default: SELECT_BODY_TEXT }), {
    virtual: true
});

jest.mock('@salesforce/label/FlowBuilderScopedNotification.connectBodyText', () => ({ default: CONNECT_BODY_TEXT }), {
    virtual: true
});

/*
const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-scoped-notification', {
        is: ScopedNotification
    });

    Object.assign(el, props, {});
    setDocumentBodyChildren(el);
    return el;
};
*/

const createComponentUnderTest = async (overrideOptions) => {
    return createComponent('builder_platform_interaction-scoped-notification', {}, overrideOptions);
};

const selectors = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    bodyText: 'div.slds-media__body p',
    cancel: 'a.cancel'
};

describe('scoped notification', () => {
    let cmp;

    beforeEach(async () => {
        cmp = await createComponentUnderTest();
    });

    afterEach(() => {
        removeDocumentBodyChildren();
    });

    it('should show select body text in select mode', async () => {
        cmp = await createComponentUnderTest({
            canvasMode: AutoLayoutCanvasMode.SELECTION
        });
        const bodyText = cmp.shadowRoot.querySelector(selectors.bodyText);
        expect(bodyText.textContent).toStrictEqual(SELECT_BODY_TEXT);
    });

    it('should show connect body text in connect mode', async () => {
        cmp = await createComponentUnderTest({
            canvasMode: AutoLayoutCanvasMode.RECONNECTION
        });
        const bodyText = cmp.shadowRoot.querySelector(selectors.bodyText);
        expect(bodyText.textContent).toStrictEqual(CONNECT_BODY_TEXT);
    });

    it('should emit ToggleSelectionModeEvent on cancel', async () => {
        const callback = jest.fn(),
            cancelLink = cmp.shadowRoot.querySelector(selectors.cancel);

        cmp.addEventListener(ToggleSelectionModeEvent.EVENT_NAME, callback);
        cancelLink.click();

        expect(callback).toHaveBeenCalled();
    });
});
