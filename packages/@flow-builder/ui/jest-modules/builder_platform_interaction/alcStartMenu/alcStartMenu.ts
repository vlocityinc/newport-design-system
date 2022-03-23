// @ts-nocheck
import AlcNodeMenu from 'builder_platform_interaction/alcNodeMenu';
import { api } from 'lwc';

export default class AlcStartMenu extends AlcNodeMenu {
    static className = 'start-menu';

    @api
    override isEmpty() {
        const { hasTrigger, hasContext, isRecordTriggeredFlow, supportsScheduledPaths } = this.elementMetadata;
        return (
            this.flowElement == null || !(hasTrigger || hasContext || isRecordTriggeredFlow || supportsScheduledPaths)
        );
    }
}
