import { EDIT_START_SCHEDULED_PATHS } from 'builder_platform_interaction/elementConfig';
import { EditElementEvent } from 'builder_platform_interaction/events';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import StartNodeButton from 'builder_platform_interaction/startNodeButton';
import { LABELS } from './startNodeScheduledPathButtonLabels';
const { format } = commonUtils;

export default class StartNodeScheduledPathButton extends StartNodeButton {
    get addScheduledPathsLabel() {
        return LABELS.startElementAddScheduledPathsLabel;
    }

    get hasScheduledPaths() {
        return this.node.childReferences && this.node.childReferences.length > 0;
    }

    get scheduledPathsLabel() {
        return LABELS.startElementScheduledPaths;
    }

    get scheduledPathsAmount() {
        return this.node.childReferences.length + 1;
    }

    get scheduledPathsTitle() {
        return format(LABELS.startElementScheduledPathsTitle, this.node.childReferences.length + 1);
    }

    override createEditElementEvent(): EditElementEvent {
        return new EditElementEvent(this.node.guid, EDIT_START_SCHEDULED_PATHS, undefined, true);
    }
}
