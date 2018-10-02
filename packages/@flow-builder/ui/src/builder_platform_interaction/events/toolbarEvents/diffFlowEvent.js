/*
 * Copyright 2018 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

/**
 * Used to diff a flow.
 */
const eventName = 'diffflow';

export class DiffFlowEvent {
    constructor(type = null) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                type
            }
        });
    }

    static EVENT_NAME = eventName;
}