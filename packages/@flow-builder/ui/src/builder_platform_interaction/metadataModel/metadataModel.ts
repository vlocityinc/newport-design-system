/*
 * TODO: IMPORTANT: These interfaces represent the metadata.
 * This is based on https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_visual_workflow.htm
 */

interface ElementReferenceOrValueMetadata {
    booleanValue: boolean;
    dateTimeValue: Date;
    dateValue: Date;
    elementReference: string;
    numberValue: number;
    stringValue: string;
}

interface valueMetadata {
    name: string;
    value?: ElementReferenceOrValueMetadata;
}

interface BaseElementMetadata {
    processMetadataValues?: valueMetadata[];
}

interface RecordFilterMetadata extends BaseElementMetadata {
    field: string;
    operator: string;
    value?: ElementReferenceOrValueMetadata;
}

export interface ElementMetadata {
    name?: string;
    description?: string;
}

export interface NodeMetadata extends ElementMetadata {
    label: string;
    locationX: number;
    locationY: number;
}

export interface ScreenMetadata extends NodeMetadata {
    fields: ScreenFieldMetadata[];
}

export interface ScreenFieldMetadata extends ElementMetadata {
    storeOutputAutomatically?: boolean;
    extensionName?: string;
    fieldType: string;
    fields: ScreenFieldMetadata[];
    inputsNextBehavior?: 'Remember' | 'Recalculate';
}

export interface StartMetadata extends NodeMetadata {
    filters?: RecordFilterMetadata[];
    filterLogic: string;
    object?: string;
    recordTriggerType?: string;
    schedule: ScheduleMetadata;
    triggerType?: string;
    scheduledPaths?: ScheduledPathMetadata[];
    doesRequireRecordChangedToMeetCriteria?: boolean;
    connector: ConnectorMetadata;
}

export interface ScheduledPathMetadata extends ElementMetadata {
    name: string;
    timeSource: string;
    offsetUnit: string;
    offsetNumber: string;
    recordField?: string;
    connector: ConnectorMetadata;
}

export interface ConnectorMetadata extends BaseElementMetadata {
    targetReference: string;
}

interface ScheduleMetadata {
    startDate: string;
    startTime: StartTime;
    recordTriggerType?: string;
    frequency: string;
}

interface StartTime {
    timeInMillis?: number;
}
