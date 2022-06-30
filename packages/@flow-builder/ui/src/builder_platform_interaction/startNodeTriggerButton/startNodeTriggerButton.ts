import getTimeZones from '@salesforce/apex/interaction.FlowBuilderController.getTimeZones';
import { getFrequencyLabel, getScheduleTypeLabel } from 'builder_platform_interaction/elementFactory';
import { FLOW_TRIGGER_FREQUENCY, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getEventTypes, MANAGED_SETUP } from 'builder_platform_interaction/sobjectLib';
import StartNodeButton from 'builder_platform_interaction/startNodeButton';
import { isPlatformEvent, isScheduledTriggerType, isSegment } from 'builder_platform_interaction/triggerTypeLib';
import { wire } from 'lwc';
import { LABELS } from './startNodeTriggerButtonLabels';

const { SCHEDULED, SCHEDULED_JOURNEY, PLATFORM_EVENT, SEGMENT } = FLOW_TRIGGER_TYPE;

export default class StartNodeTriggerButton extends StartNodeButton {
    labels = LABELS;

    @wire(getTimeZones)
    timeZoneData;

    get chooseScheduleOrEvent() {
        const { triggerType } = this.node;
        if (isScheduledTriggerType(triggerType)) {
            return this.labels.startElementSetSchedule;
        }
        switch (triggerType) {
            case PLATFORM_EVENT:
                return this.labels.startElementAddEvent;
            default:
                return '';
        }
    }

    get isSetTrigger() {
        const { triggerType } = this.node;
        switch (triggerType) {
            case SCHEDULED:
            case SCHEDULED_JOURNEY:
                return !!this.node.startDate;
            case PLATFORM_EVENT:
                return !!this.node.object;
            case SEGMENT:
                return (
                    !!(this.node.startDate || this.node.startTime) ||
                    this.node.frequency !== FLOW_TRIGGER_FREQUENCY.ONCE
                );
            default:
                return false;
        }
    }

    get selectedTriggerLabel() {
        // Platform Event
        if (this.isPlatformEvent) {
            const item = getEventTypes(MANAGED_SETUP).find(
                (menuItem) => menuItem.qualifiedApiName === this.node.object
            );
            return item ? item.label : this.node.object;
        }
        // Segment Journey
        if (this.isSegment) {
            return getScheduleTypeLabel(this.node.frequency);
        }
        // Scheduled Flow
        return this.node.label;
    }

    get triggerLabel() {
        return this.isPlatformEvent
            ? this.labels.startElementEvent
            : this.isSegment
            ? this.labels.scheduleType
            : this.labels.startElementFlowStarts;
    }

    get isPlatformEvent() {
        return isPlatformEvent(this.node.triggerType);
    }

    get isSegment() {
        return isSegment(this.node.triggerType);
    }

    get runFlowLabel() {
        switch (this.node.triggerType) {
            case SCHEDULED:
            case SCHEDULED_JOURNEY:
                return this.labels.startElementFrequency;
            case SEGMENT:
                return this.labels.repeatSchedule;
            default:
                return '';
        }
    }

    get selectedRunFlowLabel() {
        if (isScheduledTriggerType(this.node.triggerType)) {
            return getFrequencyLabel(this.node.frequency);
        }
        return '';
    }

    get startDateString() {
        return this.node.startDate?.split('T')[0];
    }

    get startTime() {
        return this.node.startTime;
    }

    get timeZone() {
        return (this.timeZoneData?.data || []).find((timezone) => timezone.apiValue === this.node.timeZoneSidKey)
            ?.display;
    }
}
