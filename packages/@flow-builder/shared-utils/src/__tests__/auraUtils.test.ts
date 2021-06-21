/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line lwc-core/no-interop-dispatch
import { createComponent, dispatchGlobalEvent } from 'aura';
import { invokeModal } from '../auraUtils';

const mockCreateComponentCallbackStatus = 'SUCCESS';
const mockPanelValidity = true;

jest.mock('aura', () => {
    return {
        dispatchGlobalEvent: jest.fn().mockImplementation((name, attributes) => {
            attributes.onCreate({
                close: () => {},
                isValid: () => {
                    return mockPanelValidity;
                },
                get: () => {
                    return [
                        {
                            get: () => {},
                            set: () => {}
                        }
                    ];
                },
                set: () => {}
            });
        }),
        createComponent: jest.fn().mockImplementation(async (cmpName, attr, callback) => {
            const newComponent = {
                getElement: () => {}
            };
            callback([newComponent], mockCreateComponentCallbackStatus, null);
        }),
        renderComponent: jest.fn().mockImplementation(() => {})
    };
});

const createComponentData = {
    modalClass: 'modalClass',
    bodyClass: 'bodyClass',
    footerClass: 'footerClass',
    flavor: 'flavor',
    headerData: {
        headerTitle: 'headerTitleStr',
        headerVariant: 'headerVariantStr'
    },
    bodyData: {
        bodyTextOne: 'bodyTextOneStr',
        bodyTextTwo: 'bodyTextTwoStr',
        listSectionHeader: 'listSectionHeaderStr',
        listSectionItems: 'listSectionItemsStr',
        listWarningItems: 'listWarningItemsStr',
        bodyVariant: 'bodyVariantStr',
        showBodyTwoVariant: 'showBodyTwoVariantStr'
    },
    footerData: {
        footerVariant: 'footerVariantStr'
    }
};

describe('invokeModal', () => {
    it('calls createComponent and dispatchGlobalEvent w/ expected parameters when given standard parameters', async () => {
        await invokeModal(createComponentData);
        expect(createComponent).toHaveBeenCalledWith(
            'builder_platform_interaction:modalHeader',
            {
                headerTitle: 'headerTitleStr',
                headerVariant: 'headerVariantStr'
            },
            expect.anything()
        );

        expect(createComponent).toHaveBeenCalledWith(
            'builder_platform_interaction:modalBody',
            {
                bodyTextOne: 'bodyTextOneStr',
                bodyTextTwo: 'bodyTextTwoStr',
                bodyVariant: 'bodyVariantStr',
                listSectionHeader: 'listSectionHeaderStr',
                listSectionItems: 'listSectionItemsStr',
                listWarningItems: 'listWarningItemsStr',
                showBodyTwoVariant: 'showBodyTwoVariantStr'
            },
            expect.anything()
        );

        expect(createComponent).toHaveBeenCalledWith(
            'builder_platform_interaction:modalFooter',
            {
                buttons: { footerVariant: 'footerVariantStr' },
                footerVariant: 'footerVariantStr'
            },
            expect.anything()
        );

        expect(dispatchGlobalEvent).toHaveBeenCalledWith(
            'ui:createPanel',
            expect.objectContaining({
                onCreate: expect.anything(),
                panelConfig: {
                    body: [{ getElement: expect.anything() }],
                    bodyClass: 'bodyClass',
                    closeAction: expect.anything(),
                    flavor: 'flavor',
                    footer: [{ getElement: expect.anything() }],
                    footerClass: 'footerClass',
                    header: [{ getElement: expect.anything() }],
                    headerClass: '',
                    modalClass: 'modalClass'
                },
                panelType: 'modal',
                visible: true
            })
        );
    });
});
