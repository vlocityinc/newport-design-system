import { getEntitiesMenuData } from 'builder_platform_interaction/expressionUtils';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { getWorkflowEnabledEntities } from 'builder_platform_interaction/sobjectLib';
import StartNodeButton from 'builder_platform_interaction/startNodeButton';
import { LABELS } from './startNodeFlowExplorerEntryPointLabels';

const { format } = commonUtils;

const explorerUrlWithObj = '/interaction_explorer/flowExplorer.app?object={0}&trigger={1}';
const explorerUrlWithoutObj = '/interaction_explorer/flowExplorer.app?trigger={1}';

export default class StartNodeFlowExplorerEntryPoint extends StartNodeButton {
    _explorerUrl: string = explorerUrlWithoutObj;

    getDurableId() {
        return getWorkflowEnabledEntities()
            .filter((entity) => entity.apiName === this.node.object)
            .map((e) => e.durableId)?.[0];
    }

    get entryPointLabel() {
        if (this.node.object) {
            const item = getEntitiesMenuData().find((menuItem) => menuItem.value === this.node.object);
            const sObject = item ? item.displayText : this.node.object;
            this._explorerUrl = explorerUrlWithObj;
            return format(LABELS.startNodeExplorerWithObjectLabel, sObject);
        }
        return LABELS.startNodeExplorerWithoutObjectLabel;
    }

    override performAction() {
        window.open(format(this._explorerUrl, this.getDurableId(), this.node.recordTriggerType), '_blank');
    }
}
