// @ts-nocheck
import { APP_EXCHANGE_LINK } from 'builder_platform_interaction/commonUtils';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { LightningElement } from 'lwc';
import { LABELS } from './getTemplatesTileLabels';

export default class GetTemplatesTile extends LightningElement {
    labels = LABELS;

    appExchangeLink = APP_EXCHANGE_LINK;

    handleClick() {
        loggingUtils.logInteraction(`appexchange-get-templates`, 'new-flow-modal', null, 'click');
        return true;
    }
}
