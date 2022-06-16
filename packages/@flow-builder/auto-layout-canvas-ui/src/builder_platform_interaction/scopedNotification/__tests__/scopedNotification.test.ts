import { AutoLayoutCanvasMode } from 'builder_platform_interaction/alcComponentsUtils';
import { UpdateAutolayoutCanvasModeEvent } from 'builder_platform_interaction/alcEvents';
import { INTERACTION_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import { createComponent } from 'builder_platform_interaction/builderTestUtils/commonTestUtils';
import { removeDocumentBodyChildren } from 'builder_platform_interaction/builderTestUtils/domTestUtils';

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
        expect(bodyText.textContent).toStrictEqual('FlowBuilderScopedNotification.selectBodyText');
    });

    it('should show connect body text in connect mode', async () => {
        cmp = await createComponentUnderTest({
            canvasMode: AutoLayoutCanvasMode.RECONNECTION
        });
        const bodyText = cmp.shadowRoot.querySelector(selectors.bodyText);
        expect(bodyText.textContent).toStrictEqual('FlowBuilderScopedNotification.connectBodyText');
    });

    it('should show connect body text in cut mode', async () => {
        cmp = await createComponentUnderTest({
            canvasMode: AutoLayoutCanvasMode.CUT
        });
        const bodyText = cmp.shadowRoot.querySelector(selectors.bodyText);
        expect(bodyText.textContent).toStrictEqual('FlowBuilderScopedNotification.cutBodyText');
    });

    it('should emit UpdateAutolayoutCanvasModeEvent on cancel', async () => {
        const callback = jest.fn(),
            cancelLink = cmp.shadowRoot.querySelector(selectors.cancel);

        cmp.addEventListener(UpdateAutolayoutCanvasModeEvent.EVENT_NAME, callback);
        cancelLink.click();

        expect(callback).toHaveBeenCalled();
        expect(callback.mock.calls[0][0].detail.mode).toEqual(AutoLayoutCanvasMode.DEFAULT);
    });
});
