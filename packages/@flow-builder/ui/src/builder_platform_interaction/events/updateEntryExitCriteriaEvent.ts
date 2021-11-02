import { ORCHESTRATED_ACTION_CATEGORY } from './orchestratedActionCategory';

const eventName = 'updateentryexitcriteria';

type UpdateEntryExitCriteriaEventDetail = {
    actionCategory: ORCHESTRATED_ACTION_CATEGORY;
    criteria;
};

export class UpdateEntryExitCriteriaEvent extends CustomEvent<UpdateEntryExitCriteriaEventDetail> {
    constructor(actionCategory, criteria) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                actionCategory,
                criteria
            }
        });
    }

    static EVENT_NAME = eventName;
}
