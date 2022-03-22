/**
 * Used by stageStepEditor to validate element
 */

const eventName = 'orchestrationstagestepeditorvalidate';

type OrchestrationStageStepEditorValidateEventDetail = {
    assigneePickerGuid: string;
    relatedRecordPickerGuid: string;
};

export class OrchestrationStageStepEditorValidateEvent extends CustomEvent<OrchestrationStageStepEditorValidateEventDetail> {
    constructor(assigneePickerGuid: string, relatedRecordPickerGuid: string) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                assigneePickerGuid,
                relatedRecordPickerGuid
            }
        });
    }

    static EVENT_NAME = eventName;
}
