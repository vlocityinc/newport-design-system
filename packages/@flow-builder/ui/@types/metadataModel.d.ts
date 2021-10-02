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

    interface Element {
        name?: string;
        description?: string;
        isNew?: boolean;
    }

    interface Node extends Element {
        label: string;
        locationX: number;
        locationY: number;
    }

    interface Screen extends Node {
        fields: ScreenField[];
    }

    interface ScreenField extends Element {
        storeOutputAutomatically?: boolean;
        extensionName?: string;
        fieldType: string;
        fields: ScreenField[];
        inputsNextBehavior?: 'Remember' | 'Recalculate';
    }

    interface Start extends Node {
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

    interface ScheduledPath extends Element {
        name: string;
        timeSource: string;
        offsetUnit: string;
        offsetNumber: string;
        recordField?: string;
        pathType?: string;
        connector: Connector;
        label?: string;
        maxBatchSize?: string;
    }

    interface Connector extends BaseElement {
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

    interface CollectionChoiceSetMetadata extends Element {
        displayField?: string;
        valueField?: string;
        collectionReference?: string;
    }
}
