/*
 * TODO: IMPORTANT: These interfaces represent the metadata.
 * This is based on https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_visual_workflow.htm
 */

declare namespace Metadata {
    interface ElementReferenceOrValue {
        booleanValue: boolean;
        dateTimeValue: Date;
        dateValue: Date;
        elementReference: string;
        numberValue: number;
        stringValue: string;
    }

    type Value = {
        name: string;
        value?: ElementReferenceOrValue;
    };

    interface BaseElement {
        processMetadataValues?: Value[];
    }

    interface RecordFilter extends BaseElement {
        field: string;
        operator: string;
        value?: ElementReferenceOrValue;
    }

    export interface Element {
        name?: string;
        description?: string;
    }

    export interface Node extends Element {
        label: string;
        locationX: number;
        locationY: number;
    }

    export interface Screen extends Node {
        fields: ScreenField[];
    }

    export interface ScreenField extends Element {
        storeOutputAutomatically?: boolean;
        extensionName?: string;
        fieldType: string;
        fields: ScreenField[];
        inputsNextBehavior?: 'Remember' | 'Recalculate';
    }

    export interface Start extends Node {
        filters?: RecordFilter[];
        filterLogic: string;
        object?: string;
        recordTriggerType?: string;
        schedule: Schedule;
        triggerType?: string;
        scheduledPaths?: ScheduledPath[];
        doesRequireRecordChangedToMeetCriteria?: boolean;
        connector: Connector;
    }

    export interface ScheduledPath extends Element {
        name: string;
        timeSource: string;
        offsetUnit: string;
        offsetNumber: string;
        recordField?: string;
        connector: Connector;
    }

    export interface Connector extends BaseElement {
        targetReference: string;
    }

    interface Schedule {
        startDate: string;
        startTime: StartTime;
        recordTriggerType?: string;
        frequency: string;
    }

    type StartTime = {
        timeInMillis?: number;
    };
}
