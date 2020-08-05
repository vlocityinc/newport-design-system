// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { EditElementEvent, LocatorIconClickedEvent } from 'builder_platform_interaction/events';
import { errorTypeMap, errorType } from 'builder_platform_interaction/errorUtils';
import { pubSub } from 'builder_platform_interaction/pubSub';
import { getElementByDevName, getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { usedBy } from 'builder_platform_interaction/usedByLib';

export default class ClickableMessage extends LightningElement {
    @api info;

    warningLabel = 'Warning';

    handleClickErrorMessage() {
        if (this.elementApiName) {
            const element: any = getElementByDevName(this.elementApiName);
            // find the parent of element, if parent exists errorType should be parent-child error
            const parentGuid = this.findParentElementGuid(element);
            const currentErrorType: string = parentGuid ? errorType.PARENT_CHILD_ERROR : errorTypeMap[this.errorCode];
            // create edit, highlight event and payload
            const editElementEvent: any = new EditElementEvent(parentGuid ? parentGuid : element.guid);
            const locatorIconClickedEvent: any = new LocatorIconClickedEvent(parentGuid ? parentGuid : element.guid);
            const editElementPayload: any = {
                mode: editElementEvent.detail.mode,
                canvasElementGUID: parentGuid ? parentGuid : element.guid
            };
            const highlightElementPayload: any = { elementGuid: parentGuid ? parentGuid : element.guid };

            if (currentErrorType) {
                switch (currentErrorType) {
                    case errorType.CANVAS_ERROR:
                        pubSub.publish(locatorIconClickedEvent.type, highlightElementPayload);
                        break;
                    case errorType.PROPERTY_EDITOR_ERROR: {
                        pubSub.publish(locatorIconClickedEvent.type, highlightElementPayload);
                        pubSub.publish(editElementEvent.type, editElementPayload);
                        break;
                    }
                    case errorType.RESOURCE_ERROR:
                        pubSub.publish(editElementEvent.type, editElementPayload);
                        break;
                    case errorType.PARENT_CHILD_ERROR: {
                        const editElementEventPC: any = new EditElementEvent(parentGuid);
                        const locatorIconClickedEventPC: any = new LocatorIconClickedEvent(parentGuid);

                        const editElementPayloadPC: any = {
                            mode: editElementEvent.detail.mode,
                            canvasElementGUID: parentGuid
                        };
                        const highlightElementPayloadPC: any = { elementGuid: parentGuid };
                        pubSub.publish(locatorIconClickedEventPC.type, highlightElementPayloadPC);
                        pubSub.publish(editElementEventPC.type, editElementPayloadPC);
                        break;
                    }
                    case errorType.START_ELEMENT_ERROR:
                        pubSub.publish(locatorIconClickedEvent.type, highlightElementPayload);
                        break;
                    default:
                }
            }
        }
    }

    findParentElementGuid(element) {
        const usedByElements = [];
        usedBy([element.guid]).forEach((el) => usedByElements.push(getElementByGuid(el.guid)));
        for (let i = 0; i < usedByElements.length; i++) {
            if (usedByElements[i].childReferences) {
                for (let j = 0; j < usedByElements[i].childReferences.length; j++) {
                    if (usedByElements[i].childReferences[j].childReference === element.guid) {
                        return usedByElements[i].guid;
                    }
                }
            }
        }
        return null;
    }

    get linkText() {
        const [pre, msg] = this.info.message.message.split(' - ');
        return pre && msg ? pre : this.elementApiName;
    }

    get elementApiName() {
        return this.info && this.info.message && this.info.message.erroneousElementApiName;
    }

    get errorMessage() {
        const currentErrorType: string = errorTypeMap[this.errorCode];
        if (!this.elementApiName || !currentErrorType || currentErrorType === errorType.NO_API_NAME_ERROR) {
            return this.info.message.message;
        }
        const [pre, msg] = this.info.message.message.split(' - ');
        return pre && msg ? msg : this.info && this.info.message && this.info.message.message;
    }

    get errorCode() {
        return this.info && this.info.message && this.info.message.errorCode;
    }

    get showLink() {
        const currentErrorType: string = errorTypeMap[this.errorCode];
        return !this.elementApiName || !currentErrorType || currentErrorType === errorType.NO_API_NAME_ERROR
            ? false
            : true;
    }
}
