// @ts-nocheck
import { createElement } from 'lwc';

import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import statusIconSummary from '../statusIconSummary';

function createComponentForTest(props) {
    const el = createElement('builder_platform_interaction-status-icon-summary', {
        is: statusIconSummary
    });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
}

const getNodeSafe = (statusIcon: any, selector: string): any | null => {
    const { shadowRoot } = statusIcon;
    if (!shadowRoot) {
        throw new Error('statusIcon shadowRoot must not be null');
    }
    return shadowRoot.querySelector(selector);
};

describe('status icon summary', () => {
    let testTitle;
    const testDetails = [
        {
            functionName: 'sectionStyle',
            functionNameStr: 'class',
            selector: 'section',
            nodeName: 'className',
            expectedValue: 'slds-popover slds-show slds-popover_warning slds-popover_large'
        },
        {
            functionName: 'iconNameForHeader',
            functionNameStr: 'iconName',
            selector: 'header lightning-icon',
            nodeName: 'iconName',
            expectedValue: 'utility:warning'
        },
        {
            functionName: 'messageBody',
            functionNameStr: 'messageBody',
            selector: '.slds-has-dividers_bottom-space .slds-item',
            nodeName: 'innerHTML',
            expectedValue: 'FlowBuilderCommonPropertyEditor.popupWarningMessageSingular'
        },
        {
            functionName: 'hasSectionHeader',
            functionNameStr: 'hasSectionHeader',
            selector: '.slds-has-dividers_bottom-space .slds-p-around_x-small',
            nodeName: false,

            isExpectedValueSelector: true,
            expectedValue: '.slds-item'
        },
        {
            functionName: 'hasSections',
            functionNameStr: 'hasSections',
            selector: '.slds-has-dividers_bottom-space .slds-p-around_x-small',
            nodeName: false,

            isExpectedValueSelector: true,
            expectedValue: '.slds-item'
        },
        {
            functionName: 'hasSectionItems',
            functionNameStr: 'hasSectionItems',
            selector: '.slds-has-dividers_bottom-space .slds-p-around_x-small',
            nodeName: false,

            isExpectedValueSelector: true,
            expectedValue: '.slds-is-nested.slds-list_vertical-space-medium'
        }
    ];

    testDetails.forEach((testDetail) => {
        describe(testDetail.functionName, () => {
            if (testDetail.isExpectedValueSelector) {
                testTitle =
                    `should include a node matching the selector ${testDetail.expectedValue} due to ` +
                    `the proper value of ${testDetail.functionNameStr} when given the proper input`;
            } else {
                testTitle = 'should produce the proper ' + testDetail.functionNameStr + ' when given the proper input';
            }
            it(testTitle, async () => {
                const statusIconSummary = createComponentForTest({
                    type: 'warning',
                    allCount: 1,
                    showTotalCounts: true,
                    showOnlyNumberOfErrors: false,
                    sections: [
                        {
                            guid: 'moops1',
                            messages: [
                                {
                                    guid: 'moopsMsg1',

                                    message: {
                                        erroneousElementApiName: 'a1',
                                        errorCode: 'RULE_INVALID_ELEMENT',
                                        message: 'some error message'
                                    }
                                }
                            ],
                            sectionInfo: 'lovely info',
                            title: 'a title'
                        }
                    ]
                });
                const section = getNodeSafe(statusIconSummary, testDetail.selector);
                if (testDetail.isExpectedValueSelector) {
                    const expectedSection = getNodeSafe(statusIconSummary, testDetail.expectedValue);
                    expect(expectedSection).not.toBeNull();
                } else {
                    expect(section[testDetail.nodeName]).toEqual(testDetail.expectedValue);
                }
            });
        });
    });

    const lengthTestDetails = [
        {
            functionName: 'sections',
            functionNameStr: 'sections',
            selector: '.slds-has-dividers_bottom-space .slds-p-around_x-small',
            expectedLength: 2,
            expectedSelector: '.slds-item',
            expectedInnerSelector: false
        },
        {
            functionName: 'sections',
            functionNameStr: 'sections',
            selector: '.slds-has-dividers_bottom-space .slds-p-around_x-small',
            expectedLength: 2,
            expectedSelector: 'builder_platform_interaction-clickable-error-message',
            expectedInnerSelector: '.message'
        }
    ];

    lengthTestDetails.forEach((testDetails) => {
        describe(testDetails.functionName, () => {
            if (testDetails.expectedInnerSelector) {
                testTitle =
                    `should match the count of nodes matching the selector ${testDetails.expectedSelector} with ` +
                    `${testDetails.expectedInnerSelector} nodes within when given the proper input`;
            } else {
                testTitle = 'should produce the proper ' + testDetails.functionNameStr + ' when given the proper input';
            }
            it(testTitle, async () => {
                const statusIconSummary = createComponentForTest({
                    type: 'warning',
                    allCount: 1,
                    showTotalCounts: true,
                    showOnlyNumberOfErrors: false,
                    sections: [
                        {
                            guid: 'moops1',
                            messages: [
                                {
                                    guid: 'moopsMsg1',

                                    message: {
                                        erroneousElementApiName: 'a1',
                                        errorCode: 'RULE_INVALID_ELEMENT',
                                        message: 'some error message'
                                    }
                                },
                                {
                                    guid: 'moopsMsg2',
                                    message: {
                                        erroneousElementApiName: 'a2',
                                        errorCode: 'RULE_INVALID_ELEMENT',
                                        message: 'some error message that is very useful'
                                    }
                                }
                            ],
                            sectionInfo: 'lovely info',
                            title: 'a title'
                        }
                    ]
                });
                if (testDetails.expectedInnerSelector) {
                    let count = 0;
                    const outerSections = statusIconSummary.shadowRoot.querySelectorAll(testDetails.expectedSelector);
                    outerSections.forEach((section) => {
                        const expectedSection = section.shadowRoot.querySelectorAll(testDetails.expectedInnerSelector);
                        expect(expectedSection).not.toBeNull();
                        count += expectedSection.length;
                    });
                    expect(count).toBe(testDetails.expectedLength);
                } else {
                    const expectedSection = statusIconSummary.shadowRoot.querySelectorAll(testDetails.expectedSelector);
                    expect(expectedSection).not.toBeNull();
                    expect(expectedSection.length).toBe(testDetails.expectedLength);
                }
            });
        });
    });
});
