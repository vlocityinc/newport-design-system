import {
    createFlowTestAssertionsUIModel,
    FlowTestParameterType,
    FlowTestPointValidator
} from 'builder_platform_interaction/elementFactory';
import { FLOW_TRIGGER_SAVE_TYPE, SCHEDULED_PATH_TYPE } from 'builder_platform_interaction/flowMetadata';

/**
 * Convert FlowTest tooling object to UI data model
 *
 * @param flowTest flow test data from Flow Test tooling object
 * @returns FlowTest tooling object
 */
export function translateFlowTestToUIModel(flowTest): UI.FlowTestData {
    let testTriggerType = FLOW_TRIGGER_SAVE_TYPE.CREATE;
    const tp = flowTest.metadata.testPoints.find((n) => n.elementApiName === FlowTestPointValidator.Start);
    if (
        tp.parameters.length === 2 &&
        tp.parameters.some((e) => e.type === FlowTestParameterType.Input) &&
        tp.parameters.some((e) => e.type === FlowTestParameterType.UpdateRecord)
    ) {
        testTriggerType = FLOW_TRIGGER_SAVE_TYPE.UPDATE;
    }
    const assertionArr = createFlowTestAssertionsUIModel(flowTest.metadata);
    return {
        label: flowTest.metadata.label,
        name: flowTest.fullName,
        description: flowTest.metadata.description,
        runPathValue: SCHEDULED_PATH_TYPE.IMMEDIATE_SCHEDULED_PATH,
        testTriggerType,
        testInitialRecordData: {},
        testUpdatedRecordData: {},
        testAssertions: assertionArr
    };
}
