import { LightningElement, api } from 'lwc';
import { LABELS } from './transactionControlPickerLabels';
import { FLOW_TRANSACTION_MODEL } from 'builder_platform_interaction/flowMetadata';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';

const FLOW_TRANSACTION_MODEL_PROPERTY = 'flowTransactionModel';

export default class TransactionControlPicker extends LightningElement {
    _flowTransactionModel;

    get labels() {
        return LABELS;
    }

    @api
    get flowTransactionModel() {
        return this._flowTransactionModel;
    }

    set flowTransactionModel(newValue) {
        this._flowTransactionModel = newValue;
    }

    get whetherToStartTxnOptions() {
        return [
            {
                label: LABELS.automaticallyChooseLabel,
                value: FLOW_TRANSACTION_MODEL.AUTOMATIC,
                description: LABELS.automaticallyChooseDescLabel,
                checked: this.flowTransactionModel === FLOW_TRANSACTION_MODEL.AUTOMATIC
            },
            {
                label: LABELS.alwaysStartNewTxnLabel,
                value: FLOW_TRANSACTION_MODEL.NEW_TRANSACTION,
                description: LABELS.alwaysStartNewTxnDescLabel,
                checked: this.flowTransactionModel === FLOW_TRANSACTION_MODEL.NEW_TRANSACTION
            },
            {
                label: LABELS.alwaysContExistingTxnLabel,
                value: FLOW_TRANSACTION_MODEL.CURRENT_TRANSACTION,
                description: LABELS.alwaysContExistingTxnDescLabel,
                checked: this.flowTransactionModel === FLOW_TRANSACTION_MODEL.CURRENT_TRANSACTION
            }
        ];
    }

    handleTransactionControlOption(event) {
        event.stopPropagation();
        const index = this.whetherToStartTxnOptions.findIndex((option) => {
            return option.value === event.currentTarget.value;
        });
        this.whetherToStartTxnOptions[index].checked = true;
        this.whetherToStartTxnOptions.forEach((item) => {
            if (item.value !== event.currentTarget.value) {
                item.checked = false;
            }
        });
        const propertyChangedEvent = new PropertyChangedEvent(
            FLOW_TRANSACTION_MODEL_PROPERTY,
            event.currentTarget.value,
            null,
            null,
            this.flowTransactionModel,
            undefined,
            null
        );
        this.dispatchEvent(propertyChangedEvent);
    }
}
