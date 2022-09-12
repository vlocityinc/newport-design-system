import { ParameterListConfig } from 'builder_platform_interaction/calloutEditorLib';
import {
    OrchestrationActionValueChangedEvent,
    RequiresAsyncProcessingChangedEvent,
    ValueChangedEvent
} from 'builder_platform_interaction/events';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getFlowIdsForNames, openFlow } from 'builder_platform_interaction/inlineOpenFlowUtils';
import { InvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { api, LightningElement } from 'lwc';
import { LABELS } from './actionAndParametersLabels';

/**
 * Encapsulates the action selector and its associated input parameters with features
 * explicitly needed by the StagedStepEditor and OrchestratedStageEditor.
 *
 * These features are factored out for re-use by standard step types
 */
export default class ActionAndParameters extends LightningElement {
    @api
    selectedAction: InvocableAction | undefined;
    @api
    isActionsFetched = false;
    @api
    selectedCategory: string | undefined;
    @api
    selectedFilterBy: string | undefined;
    @api
    handleCannotRetrieveActions: ((e: Event) => void) | undefined;
    @api
    processType: string | undefined;
    @api
    actionSelectorLabel: string | undefined;
    @api
    required = false;
    @api
    actionTooltipLabel: string | undefined;
    @api
    showExternalCalloutsCheckbox = false;
    @api
    requiresAsyncProcessing = false;
    @api
    actionParameterListConfig: ParameterListConfig | undefined;
    @api
    actionErrorMessage: string | undefined;

    _availableActions: InvocableAction[] = [];
    @api
    get availableActions() {
        return this._availableActions;
    }
    set availableActions(actions) {
        (async () => {
            this._availableActions = actions;
            this.flowNamesToIds = await getFlowIdsForNames(this.availableActions.map((action) => action.name));
        })();
    }

    labels = LABELS;

    actionElementType = ELEMENT_TYPE.ACTION_CALL;

    flowNamesToIds: {} = {};

    get showParameterList(): boolean {
        return this.selectedAction?.actionName && !this.actionErrorMessage && !!this.actionParameterListConfig;
    }

    get isActionInputsEmpty() {
        return this.actionParameterListConfig?.inputs.length === 0;
    }

    get showOpenFlow(): boolean {
        return this.selectedAction?.actionName && !this.actionErrorMessage;
    }

    async handleActionSelected(e: ValueChangedEvent<InvocableAction>) {
        this.dispatchEvent(new OrchestrationActionValueChangedEvent(null, e.detail.value, e.detail.error));
    }

    handleOpenFlowClicked() {
        const actionId = this.flowNamesToIds[this.selectedAction?.actionName];
        openFlow(actionId);
    }

    handleCheckboxClicked(event: CustomEvent) {
        event.stopPropagation();
        this.dispatchEvent(new RequiresAsyncProcessingChangedEvent(event.detail.checked));
    }
}
