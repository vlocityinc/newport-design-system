// @ts-nocheck
import { createElement } from 'lwc';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import StatusIcon from '../statusIcon';
import { showPopover } from 'builder_platform_interaction/builderUtils';

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-status-icon', {
        is: StatusIcon
    });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
}

const getButtonIcon = (statusIcon: any): any | null => {
    const { shadowRoot } = statusIcon;
    if (!shadowRoot) {
        throw new Error('statusIcon shadowRoot must not be null');
    }
    return shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BUTTON_ICON);
};

const WARN_TYPE = 'warning',
    SOUTH_DIRECTION = 'south';

jest.mock('builder_platform_interaction/builderUtils');

describe('status icon', () => {
    describe('messages', () => {
        it('should produce the proper messages data structure when given the proper input', () => {
            const statusIcon = createComponentForTest({
                type: WARN_TYPE,
                direction: SOUTH_DIRECTION
            });
            statusIcon.messages = {
                msgs1: ['message1'],
                msgs2: ['message2a', 'message2b'],
                msgs3: ['message3']
            };

            expect(statusIcon.messages).toEqual([
                expect.objectContaining({
                    title: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle',
                    sectionInfo: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo',
                    guid: expect.any(String),
                    messages: [expect.anything()]
                }),
                expect.objectContaining({
                    title: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle',
                    sectionInfo: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo',
                    guid: expect.any(String),
                    messages: [expect.anything(), expect.anything()]
                }),
                expect.objectContaining({
                    title: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionTitle',
                    sectionInfo: 'FlowBuilderCommonPropertyEditor.validationWarningsSectionInfo',
                    guid: expect.any(String),
                    messages: [expect.anything()]
                })
            ]);
        });
    });
    describe('iconNameFromType', () => {
        it('should produce the proper value given the proper data', async () => {
            const statusIcon = createComponentForTest({
                type: WARN_TYPE,
                direction: SOUTH_DIRECTION,
                isIconVisible: true
            });
            statusIcon.messages = {
                msgs1: ['message1']
            };
            await ticks(1);
            const buttonIcon = getButtonIcon(statusIcon);
            expect(buttonIcon.iconName).toEqual('utility:warning');
        });
    });
    describe('iconClassFromType', () => {
        it('should produce the proper value given the proper data', async () => {
            const statusIcon = createComponentForTest({
                type: WARN_TYPE,
                direction: SOUTH_DIRECTION,
                isIconVisible: true
            });
            statusIcon.messages = {
                msgs1: ['message1']
            };
            await ticks(1);
            const buttonIcon = getButtonIcon(statusIcon);
            expect(buttonIcon.iconClass).toEqual('slds-button_icon-warning');
        });
    });
    describe('iconTitle', () => {
        it('should produce the proper value given the proper data', async () => {
            const statusIcon = createComponentForTest({
                type: WARN_TYPE,
                direction: SOUTH_DIRECTION,
                isIconVisible: true
            });
            statusIcon.messages = {
                msgs1: ['message1']
            };
            await ticks(1);
            const buttonIcon = getButtonIcon(statusIcon);
            expect(buttonIcon.title).toEqual('FlowBuilderCommonPropertyEditor.statusIconShowWarningSingularTitle');
        });
    });
    describe('createPanel', () => {
        it('calls showPopover w/ expected parameters when given standard parameters', async () => {
            const SUMMARY_HEADER = 'sum head';
            const statusIcon = createComponentForTest({
                type: WARN_TYPE,
                direction: SOUTH_DIRECTION,
                isIconVisible: true,
                headerforsummary: SUMMARY_HEADER
            });
            statusIcon.createPanel();
            await ticks(1);

            expect(showPopover).toHaveBeenCalledWith(
                'builder_platform_interaction:statusIconSummary',
                expect.objectContaining({
                    header: SUMMARY_HEADER,
                    sections: [],
                    type: WARN_TYPE,
                    showOnlyNumberOfErrors: false,
                    allCount: undefined,
                    showTotalCounts: false,
                    showSections: false,
                    handleClickCallback: expect.anything()
                }),
                {
                    referenceElement: expect.anything(),
                    direction: SOUTH_DIRECTION
                }
            );
        });
    });
});
