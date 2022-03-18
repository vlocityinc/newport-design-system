import AlcNodeMenu from 'builder_platform_interaction/alcNodeMenu';
import { shouldSupportScheduledPaths } from 'builder_platform_interaction/elementFactory';
import { api } from 'lwc';

/**
 *  Start element specific node menu
 */
export default class AlcStartMenu extends AlcNodeMenu {
    static className = 'start-menu';

    get supportsScheduledPaths() {
        return this.flowElement && shouldSupportScheduledPaths(this.flowElement);
    }

    get hasTrigger() {
        return this.elementMetadata.hasTrigger;
    }

    get hasContext() {
        return this.elementMetadata.hasContext;
    }

    get isRecordTriggeredFlow() {
        return this.elementMetadata.isRecordTriggeredFlow;
    }

    get hasBody() {
        return !this.isEmpty();
    }

    @api
    override isEmpty() {
        const { hasTrigger, hasContext, isRecordTriggeredFlow, supportsScheduledPaths } = this;
        return (
            this.flowElement == null || !(hasTrigger || hasContext || isRecordTriggeredFlow || supportsScheduledPaths)
        );
    }

    /**
     * Handles space or enter keys on a button
     */
    override handleSpaceOrEnter() {
        this.performButtonAction();
    }

    /**
     * Handles a button click event
     *
     * @param event - The click event
     */
    handleButtonClick(event) {
        event?.stopPropagation();
        this.performButtonAction();
    }

    /**
     * Delegates the button action to the corresponding button component
     */
    performButtonAction() {
        const button = this.template.activeElement;
        button.performAction();
    }
}
