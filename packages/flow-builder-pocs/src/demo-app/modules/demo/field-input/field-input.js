import { updateFlow } from 'builder_platform_interaction/actions';
import { reducer } from 'builder_platform_interaction/reducers';
import { setRules } from 'builder_platform_interaction/ruleLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { setGlobalVariables, setProcessTypeFeatures } from 'builder_platform_interaction/systemLib';
import { LightningElement } from 'lwc';
import globalVariables from './data/globalVariables';
import rules from './data/rules';
import storeState from './data/storeState';

const features = [
    'ConditionalFieldVisibility',
    'StoreOutputAutomatically',
    'LookupTraversal',
    'DynamicTypes',
    'IsDebugAsUserAllowedInNonPrd',
    'GlobalVariables',
    'TransactionControlledActions'
];

setRules(rules.rules);
setProcessTypeFeatures('Flow', features);
setGlobalVariables(globalVariables);

// @ts-ignore
const storeInstance = Store.getStore(reducer);
storeInstance.dispatch(updateFlow(storeState));

export default class FieldInput extends LightningElement {
    static delegatesFocus = true;

    renderedCallback() {
        this.template.querySelector('builder_platform_interaction-field-input')?.focus();
    }
}
