/* eslint-disable @lwc/lwc/no-async-operation */
// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { EditElementEvent, LocatorIconClickedEvent } from 'builder_platform_interaction/events';
import { errorTypeMap, errorType } from 'builder_platform_interaction/errorUtils';
import { pubSub } from 'builder_platform_interaction/pubSub';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';

export default class ClickableMessage extends LightningElement {
    @api info;

    warningLabel = 'Warning';

    handleClickErrorMessage() {
        if (this.elementApiName) {
            const element: any = getElementByDevName(this.elementApiName);
            const editElementEvent: any = new EditElementEvent(element.guid);
            const locatorIconClickedEvent: any = new LocatorIconClickedEvent(element.guid);

            const editElementPayload: any = {
                mode: editElementEvent.detail.mode,
                canvasElementGUID: element.guid
            };
            const highlightElementPayload: any = { elementGuid: element.guid };
            const currentErrorType: string = errorTypeMap[this.errorCode];
            if (currentErrorType) {
                switch (currentErrorType) {
                    case errorType.CANVAS_ERROR:
                        pubSub.publish(locatorIconClickedEvent.type, highlightElementPayload);
                        break;
                    case errorType.PROPERTY_EDITOR_ERROR:
                        pubSub.publish(locatorIconClickedEvent.type, highlightElementPayload);
                        pubSub.publish(editElementEvent.type, editElementPayload);
                        break;
                    case errorType.RESOURCE_ERROR:
                        pubSub.publish(editElementEvent.type, editElementPayload);
                        break;
                    case errorType.PARENT_CHILD_ERROR:
                        pubSub.publish(locatorIconClickedEvent.type, highlightElementPayload);
                        pubSub.publish(editElementEvent.type, editElementPayload);
                        break;
                    case errorType.START_ELEMENT_ERROR:
                        pubSub.publish(locatorIconClickedEvent.type, highlightElementPayload);
                        break;
                    default:
                }
            }
        }
    }

    get linkText() {
        const [pre, msg] = this.info.message.message.split(' - ');
        return pre && msg ? pre : this.elementApiName;
    }

    get elementApiName() {
        return this.info && this.info.message && this.info.message.erroneousElementApiName;
    }

    get errorMessage() {
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
