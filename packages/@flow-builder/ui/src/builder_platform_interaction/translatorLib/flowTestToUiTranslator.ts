import {
    createFlowTestAssertionsUIModel,
    createFlowTestRecordsUIModel,
    FlowTestParameterType,
    FlowTestPointValidator
} from 'builder_platform_interaction/elementFactory';
import { FLOW_TRIGGER_SAVE_TYPE, SCHEDULED_PATH_TYPE } from 'builder_platform_interaction/flowMetadata';
import { Store } from 'builder_platform_interaction/storeLib';
import { swapDevNamesToGuids } from './uidSwapping';

/**
 * Convert FlowTest tooling object to UI data model
 *
 * @param flowTest flow test data from Flow Test tooling object
 * @returns FlowTest tooling object
 */
export function translateFlowTestToUIModel(flowTest): UI.FlowTestData {
    let testTriggerType = FLOW_TRIGGER_SAVE_TYPE.CREATE;
    let tp;
    let assertionArr;
    let records;
    if (flowTest && flowTest.metadata) {
        tp = flowTest.metadata.testPoints.find((n) => n.elementApiName === FlowTestPointValidator.Start);
        if (
            tp.parameters.length === 2 &&
            tp.parameters.some((e) => e.type === FlowTestParameterType.Input) &&
            tp.parameters.some((e) => e.type === FlowTestParameterType.UpdateRecord)
        ) {
            testTriggerType = FLOW_TRIGGER_SAVE_TYPE.UPDATE;
        }
        assertionArr = createFlowTestAssertionsUIModel(flowTest.metadata);
        records = createFlowTestRecordsUIModel(flowTest.metadata, testTriggerType);
    }

    swapDevNamesToGuids(Store.getStore().getCurrentState().elements, assertionArr);

    const label = flowTest?.metadata?.label;
    const name = flowTest?.fullName;
    const description = flowTest?.metadata?.description;
    const testInitialRecordData = records?.length >= 1 ? records[0] : undefined;
    const testUpdatedRecordData = records?.length >= 2 ? records[1] : undefined;

    return {
        label,
        name,
        description,
        runPathValue: SCHEDULED_PATH_TYPE.IMMEDIATE_SCHEDULED_PATH,
        testTriggerType,
        testInitialRecordData,
        testUpdatedRecordData,
        testAssertions: assertionArr
    };
}
