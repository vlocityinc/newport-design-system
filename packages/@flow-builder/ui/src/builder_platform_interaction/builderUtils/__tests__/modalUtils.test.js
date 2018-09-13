import { invokeAlertModal } from "builder_platform_interaction/builderUtils";
import { showCustomOverlayTestPanel } from "lightning/overlayUtils";
import { getShadowRoot } from 'lwc-test-utils';

describe('Modal Utils', () => {
    const attributes = {
        headerData: {
            headerTitle: 'This is the header'
        },
        bodyData: {
            bodyTextOne: 'This is body text one',
            bodyTextTwo: 'This is body text two'
        },
        footerData: {
            buttonOne: {
                buttonLabel: 'button1'
            },
            buttonTwo: {
                buttonVariant: 'destructive',
                buttonLabel: 'button2',
                closeCallback: false,
                buttonCallback: jest.fn()
            }
        }
    };

    let modal;

    beforeEach(() => {
        modal =  invokeAlertModal(attributes);
        return modal;
    });

    it('Tests modal header content', () => {
        expect(modal.alertModalHeader.headerTitle).toBe(attributes.headerData.headerTitle);
    });

    it('Tests modal body content', () => {
        expect(modal.alertModalBody.bodyTextOne).toBe(attributes.bodyData.bodyTextOne);
        expect(modal.alertModalBody.bodyTextTwo).toBe(attributes.bodyData.bodyTextTwo);
    });

    describe('Modal Footer', () => {
        const closeCallback = jest.fn();
        showCustomOverlayTestPanel.close = closeCallback;

        let footerButtons;

        beforeEach(() => {
            document.body.appendChild(modal.alertModalFooter);
            footerButtons = getShadowRoot(modal.alertModalFooter).querySelectorAll("lightning-button");
            return footerButtons;
        });

        it('Tests modal footer content', () => {
            expect(modal.alertModalFooter.buttons).toMatchObject(attributes.footerData);
        });

        it('Modal footer should have two buttons', () => {
            expect(footerButtons).toHaveLength(2);
        });

        it('Clicking on buttonOne should call the closeCallback', () => {
            footerButtons[0].click();
            expect(closeCallback).toHaveBeenCalled();
            showCustomOverlayTestPanel.close = () => {};
        });

        it('Clicking on buttonTwo should not call the closeCallback and should instead call the buttonCallback', () => {
            footerButtons[1].click();
            expect(attributes.footerData.buttonTwo.buttonCallback).toHaveBeenCalled();
            expect(closeCallback).not.toHaveBeenCalled();
        });
    });
});