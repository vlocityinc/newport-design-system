// @ts-nocheck
import { createElement } from 'lwc';
import ClickableErrorMessage from '../clickableErrorMessage';
import { EditElementEvent, LocatorIconClickedEvent } from 'builder_platform_interaction/events';
import { pubSub } from 'builder_platform_interaction/pubSub';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import {
    flowWithAllElementsUIModel,
    screenWithSection,
    decision1 as mockDecision,
    decision1Outcome1 as mockOutcome
} from 'mock/storeData';

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByDevName: jest.fn((name) => {
            return name !== mockOutcome.name
                ? name.startsWith('ScreenWithSection_')
                    ? jest.requireActual('builder_platform_interaction/storeUtils').getElementByDevName(name)
                    : { guid: '1' }
                : mockOutcome;
        }),
        getElementByGuid: jest.fn((guid) => {
            return guid === mockDecision.guid
                ? mockDecision
                : jest.requireActual('builder_platform_interaction/storeUtils').getElementByGuid(guid);
        }),
        shouldUseAutoLayoutCanvas: jest.fn()
    };
});

jest.mock('builder_platform_interaction/pubSub', () => {
    const mockPubSub = {
        publish: jest.fn(),
        subscribe: jest.fn()
    };
    return {
        pubSub: mockPubSub
    };
});

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const createComponentUnderTest = (props = { info: { message: {} } }) => {
    const el = createElement('builder_platform_clickable-error-message', {
        is: ClickableErrorMessage
    });
    el.info = props.info;
    document.body.appendChild(el);
    return el;
};

const selectors = {
    link: 'a',
    li: 'li'
};

describe('clickableErrorMessage', () => {
    describe('presenting link', () => {
        it('presents no link when error type is NO_API_NAME_ERROR', () => {
            // create error message component with NO_API_NAME_ERROR
            const errorMsgComponentWithNoApi = createComponentUnderTest({
                info: {
                    message: {
                        errorCode: 'ELEMENT_HAS_INVALID_DEFAULT_VALUE',
                        message: 'some error message'
                    }
                }
            });
            const clickableLink = errorMsgComponentWithNoApi.shadowRoot.querySelector(selectors.link);
            expect(clickableLink).toBeNull();
        });
        it('presents clickable link when error type is not NO_API_NAME_ERROR', () => {
            // create error message component with none NO_API_NAME_ERROR
            const errorMsgComponentCanvas = createComponentUnderTest({
                info: {
                    message: {
                        erroneousElementApiName: 'a1',
                        errorCode: 'NOT_CONNECTED',
                        message: 'a1(Assignment) - some error message'
                    }
                }
            });
            const clickableLink = errorMsgComponentCanvas.shadowRoot.querySelector(selectors.link);
            expect(clickableLink).not.toBeNull();
        });
        it('presents no link when erroneousElementApiName is null', () => {
            // create error message component with PROPERTY_EDITOR_ERROR but with no erroneousElementApiName
            const errorMsgComponentEditor = createComponentUnderTest({
                info: {
                    message: {
                        errorCode: 'RULE_MISSING_OPERATOR',
                        message: 'a1(Assignment) - some error message'
                    }
                }
            });
            const clickableLink = errorMsgComponentEditor.shadowRoot.querySelector(selectors.link);
            expect(clickableLink).toBeNull();
        });
    });
    describe('link text', () => {
        it('presents prepended part of message as link text when prepended info exists in message', () => {
            // create error message component with error message with prepend info
            const errorMsgComponentWithPre = createComponentUnderTest({
                info: {
                    message: {
                        erroneousElementApiName: 'a1',
                        errorCode: 'RULE_INVALID_ELEMENT',
                        message: 'a1(Assignment) - some error message'
                    }
                }
            });
            const link = errorMsgComponentWithPre.shadowRoot.querySelector(selectors.link);
            const li = errorMsgComponentWithPre.shadowRoot.querySelector(selectors.li);
            expect(link.textContent).toEqual('a1(Assignment)');
            expect(li.textContent).toEqual(errorMsgComponentWithPre.info.message.message);
        });
        it('presents apiName as link text when there is no prepended info in message', () => {
            // create error message component with error message without prepend info
            const errorMsgComponentWithoutPre = createComponentUnderTest({
                info: {
                    message: {
                        erroneousElementApiName: 'a1',
                        errorCode: 'RULE_INVALID_ELEMENT',
                        message: 'some error message'
                    }
                }
            });
            const link = errorMsgComponentWithoutPre.shadowRoot.querySelector(selectors.link);
            const li = errorMsgComponentWithoutPre.shadowRoot.querySelector(selectors.li);
            expect(link.textContent).toEqual(errorMsgComponentWithoutPre.info.message.erroneousElementApiName);
            const expected =
                errorMsgComponentWithoutPre.info.message.erroneousElementApiName +
                ' - ' +
                errorMsgComponentWithoutPre.info.message.message;
            expect(li.textContent).toEqual(expected);
        });
    });
    describe('error message', () => {
        it('presents error message without modification for NO_API_NAME_ERROR', () => {
            // create error message component with NO_API_NAME_ERROR
            const errorMsgComponentWithNoApi = createComponentUnderTest({
                info: {
                    message: {
                        errorCode: 'ELEMENT_HAS_INVALID_DEFAULT_VALUE',
                        message: 'a1(Assignment) - some error message'
                    }
                }
            });
            const li = errorMsgComponentWithNoApi.shadowRoot.querySelector(selectors.li);
            const expected = errorMsgComponentWithNoApi.info.message.message;
            expect(li.textContent).toEqual(expected);
        });
        it('presents error message without modification for error not exist in the errorTypeMap', () => {
            // create error message component with an error not exist in the errorTypeMap
            const errorMsgComponentWithNoApi = createComponentUnderTest({
                info: {
                    message: {
                        errorCode: 'FAKE_ERROR_CODE',
                        message: 'a1(Assignment) - some error message'
                    }
                }
            });
            const li = errorMsgComponentWithNoApi.shadowRoot.querySelector(selectors.li);
            const expected = errorMsgComponentWithNoApi.info.message.message;
            expect(li.textContent).toEqual(expected);
        });
        it('presents error message correctly when error is from Strategy Builder', () => {
            const errorMsgComponentFromStrategyBuilder = createComponentUnderTest({
                info: {
                    message: 'some error message from strategy builder'
                }
            });
            const li = errorMsgComponentFromStrategyBuilder.shadowRoot.querySelector(selectors.li);
            const expected = errorMsgComponentFromStrategyBuilder.info.message;
            expect(li.textContent).toEqual(expected);
        });
    });
    describe('clicking link', () => {
        beforeAll(() => {
            Store.setMockState(flowWithAllElementsUIModel);
        });
        afterAll(() => {
            Store.resetStore();
        });
        it('highlights erroneous element when error type is CANVAS_ERROR', () => {
            // create error message component with CANVAS_ERROR
            const errorMsgComponentCanvas = createComponentUnderTest({
                info: {
                    message: {
                        erroneousElementApiName: 'a1',
                        errorCode: 'NOT_CONNECTED',
                        message: 'a1(Assignment) - some error message'
                    }
                }
            });
            const element = getElementByDevName(errorMsgComponentCanvas.info.message.erroneousElementApiName);
            const locatorIconClickedEvent = new LocatorIconClickedEvent(element.guid);
            const highlightElementPayload = { elementGuid: element.guid };
            errorMsgComponentCanvas.shadowRoot.querySelector(selectors.link).click();
            expect(pubSub.publish.mock.calls[0][0]).toEqual(locatorIconClickedEvent.type);
            expect(pubSub.publish.mock.calls[0][1]).toEqual(highlightElementPayload);
        });
        it('highlights erroneous element and open its property editor when error type is PROPERTY_EDITOR_ERROR', async () => {
            // create error message component with PROPERTY_EDITOR_ERROR
            const errorMsgComponentEditor = createComponentUnderTest({
                info: {
                    message: {
                        erroneousElementApiName: 'a1',
                        errorCode: 'RULE_MISSING_OPERATOR',
                        message: 'a1(Assignment) - some error message'
                    }
                }
            });
            const element = getElementByDevName(errorMsgComponentEditor.info.message.erroneousElementApiName);
            const locatorIconClickedEvent = new LocatorIconClickedEvent(element.guid);
            const highlightElementPayload = { elementGuid: element.guid };
            const editElementEvent = new EditElementEvent(element.guid);
            const editElementPayload = {
                mode: editElementEvent.detail.mode,
                canvasElementGUID: element.guid
            };
            errorMsgComponentEditor.shadowRoot.querySelector(selectors.link).click();
            expect(pubSub.publish.mock.calls[0][0]).toEqual(locatorIconClickedEvent.type);
            expect(pubSub.publish.mock.calls[0][1]).toEqual(highlightElementPayload);
            expect(pubSub.publish.mock.calls[1][0]).toEqual(editElementEvent.type);
            expect(pubSub.publish.mock.calls[1][1]).toEqual(editElementPayload);
        });
        it('opens the property editor of erroneous element when error type is RESOURCE_ERROR', () => {
            // create error message component with RESOURCE_ERROR
            const errorMsgComponentResource = createComponentUnderTest({
                info: {
                    message: {
                        erroneousElementApiName: 'a1',
                        errorCode: 'FIELD_REQUIRED_FOR_DATATYPE',
                        message: 'a1(Assignment) - some error message'
                    }
                }
            });
            const element = getElementByDevName(errorMsgComponentResource.info.message.erroneousElementApiName);
            const editElementEvent = new EditElementEvent(element.guid);
            const editElementPayload = {
                mode: editElementEvent.detail.mode,
                canvasElementGUID: element.guid
            };
            errorMsgComponentResource.shadowRoot.querySelector(selectors.link).click();
            expect(pubSub.publish.mock.calls[0][0]).toEqual(editElementEvent.type);
            expect(pubSub.publish.mock.calls[0][1]).toEqual(editElementPayload);
        });
        it('highlights erroneous element and open its property editor when error type is PARENT_CHILD_ERROR', () => {
            // create error message component with PARENT_CHILD_ERROR
            const errorMsgComponentParentChild = createComponentUnderTest({
                info: {
                    message: {
                        erroneousElementApiName: mockOutcome.name,
                        errorCode: 'DYNAMIC_TYPE_MAPPING_MISSING',
                        message: mockOutcome.name + '(outcome) - some error message'
                    }
                }
            });
            const parent = mockDecision;
            const locatorIconClickedEvent = new LocatorIconClickedEvent(parent.guid);
            const highlightElementPayload = { elementGuid: parent.guid };
            const editElementEvent = new EditElementEvent(parent.guid);
            const editElementPayload = {
                mode: editElementEvent.detail.mode,
                canvasElementGUID: parent.guid
            };
            errorMsgComponentParentChild.shadowRoot.querySelector(selectors.link).click();
            expect(pubSub.publish.mock.calls[0][0]).toEqual(locatorIconClickedEvent.type);
            expect(pubSub.publish.mock.calls[0][1]).toEqual(highlightElementPayload);
            expect(pubSub.publish.mock.calls[1][0]).toEqual(editElementEvent.type);
            expect(pubSub.publish.mock.calls[1][1]).toEqual(editElementPayload);
        });
        it('opens the screen when error is for Section field type', () => {
            // create error message component with PARENT_CHILD_ERROR
            const errorMsgComponentParentChild = createComponentUnderTest({
                info: {
                    message: {
                        erroneousElementApiName: 'ScreenWithSection_Section1',
                        errorCode: 'PROCESSTYPE_SCREEN_FIELDTYPE_NOT_SUPPORTED',
                        message: 'Section1 - Flow type can\'t include "RegionContainer" screen component'
                    }
                }
            });
            const parent = screenWithSection;
            const locatorIconClickedEvent = new LocatorIconClickedEvent(parent.guid);
            const highlightElementPayload = { elementGuid: parent.guid };
            const editElementEvent = new EditElementEvent(parent.guid);
            const editElementPayload = {
                mode: editElementEvent.detail.mode,
                canvasElementGUID: parent.guid
            };
            errorMsgComponentParentChild.shadowRoot.querySelector(selectors.link).click();
            expect(pubSub.publish.mock.calls[0][0]).toEqual(locatorIconClickedEvent.type);
            expect(pubSub.publish.mock.calls[0][1]).toEqual(highlightElementPayload);
            expect(pubSub.publish.mock.calls[1][0]).toEqual(editElementEvent.type);
            expect(pubSub.publish.mock.calls[1][1]).toEqual(editElementPayload);
        });
        it('opens the screen when error is for Section Column field type', () => {
            // create error message component with PARENT_CHILD_ERROR
            const errorMsgComponentParentChild = createComponentUnderTest({
                info: {
                    message: {
                        erroneousElementApiName: 'ScreenWithSection_Section1_Column1',
                        errorCode: 'PROCESSTYPE_SCREEN_FIELDTYPE_NOT_SUPPORTED',
                        message: 'Section1_Column1 - Flow type can\'t include "Region" screen component'
                    }
                }
            });
            const parent = screenWithSection;
            const locatorIconClickedEvent = new LocatorIconClickedEvent(parent.guid);
            const highlightElementPayload = { elementGuid: parent.guid };
            const editElementEvent = new EditElementEvent(parent.guid);
            const editElementPayload = {
                mode: editElementEvent.detail.mode,
                canvasElementGUID: parent.guid
            };
            errorMsgComponentParentChild.shadowRoot.querySelector(selectors.link).click();
            expect(pubSub.publish.mock.calls[0][0]).toEqual(locatorIconClickedEvent.type);
            expect(pubSub.publish.mock.calls[0][1]).toEqual(highlightElementPayload);
            expect(pubSub.publish.mock.calls[1][0]).toEqual(editElementEvent.type);
            expect(pubSub.publish.mock.calls[1][1]).toEqual(editElementPayload);
        });
        it('highlights erroneous element when error type is START_ELEMENT_ERROR', () => {
            // create error message component with START_ELEMENT_ERROR
            const errorMsgComponentStartEl = createComponentUnderTest({
                info: {
                    message: {
                        erroneousElementApiName: 'a1',
                        errorCode: 'RECORD_FILTER_NON_PRIMITIVE',
                        message: 'a1(Assignment) - some error message'
                    }
                }
            });
            const element = getElementByDevName(errorMsgComponentStartEl.info.message.erroneousElementApiName);
            const locatorIconClickedEvent = new LocatorIconClickedEvent(element.guid);
            const highlightElementPayload = { elementGuid: element.guid };
            errorMsgComponentStartEl.shadowRoot.querySelector(selectors.link).click();
            expect(pubSub.publish.mock.calls[0][0]).toEqual(locatorIconClickedEvent.type);
            expect(pubSub.publish.mock.calls[0][1]).toEqual(highlightElementPayload);
        });
        it('highlights erroneous element and open its property editor when error type is not PARENT_CHILD_ERROR but erroneous element has a parent', () => {
            // create error message component with PROPERTY_EDITOR_ERROR
            const errorMsgComponentParentChild = createComponentUnderTest({
                info: {
                    message: {
                        erroneousElementApiName: mockOutcome.name,
                        errorCode: 'RULE_RIGHT_OPERAND_NULL',
                        message: mockOutcome + '(outcome) - some error message'
                    }
                }
            });
            const parent = mockDecision;
            const locatorIconClickedEvent = new LocatorIconClickedEvent(parent.guid);
            const highlightElementPayload = { elementGuid: parent.guid };
            const editElementEvent = new EditElementEvent(parent.guid);
            const editElementPayload = {
                mode: editElementEvent.detail.mode,
                canvasElementGUID: parent.guid
            };
            errorMsgComponentParentChild.shadowRoot.querySelector(selectors.link).click();
            expect(pubSub.publish.mock.calls[0][0]).toEqual(locatorIconClickedEvent.type);
            expect(pubSub.publish.mock.calls[0][1]).toEqual(highlightElementPayload);
            expect(pubSub.publish.mock.calls[1][0]).toEqual(editElementEvent.type);
            expect(pubSub.publish.mock.calls[1][1]).toEqual(editElementPayload);
        });
    });
});
