import { LightningElement } from 'lwc';
import { LABELS } from "./getTemplatesTileLabels";
import { APP_EXCHANGE_LINK } from "builder_platform_interaction/commonUtils";

export default class GetTemplatesTile extends LightningElement {
    labels = LABELS;

    appExchangeLink = APP_EXCHANGE_LINK;
}