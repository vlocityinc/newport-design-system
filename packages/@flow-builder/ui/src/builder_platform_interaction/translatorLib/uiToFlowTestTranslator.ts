import {
    createFlowTestAssertionsMetadataObject,
    createFlowTestParametersMetadataObject,
    FlowTestPointValidator
} from 'builder_platform_interaction/elementFactory';
import { Store } from 'builder_platform_interaction/storeLib';
import { swapUidsForDevNames } from './uidSwapping';

export type FlowTest = {
    fullName: string;
    metadata: Metadata.FlowTestMetadata;
};

/**
 * Convert UI data model to FlowTest tooling object
 *
 * @param uiModel flow test data from UI
 * @returns FlowTest tooling object
 */
export function translateUIModelToFlowTest(uiModel: UI.FlowTestData): FlowTest {
    const testPoints: Metadata.FlowTestPoint[] = [];
    testPoints.push({
        elementApiName: FlowTestPointValidator.Start,
        parameters: createFlowTestParametersMetadataObject(uiModel),
        assertions: []
    });
    testPoints.push({
        elementApiName: FlowTestPointValidator.Finish,
        parameters: [],
        assertions: createFlowTestAssertionsMetadataObject(uiModel)
    });
    const flowStoreState = Store.getStore().getCurrentState();
    const metadata = {
        label: uiModel.label,
        description: uiModel.description,
        flowApiName: constructFlowApiNameWithVersion(
            flowStoreState.properties.name,
            flowStoreState.properties.versionNumber
        ),
        testPoints
    };
    swapUidsForDevNames(flowStoreState.elements, metadata);
    return {
        fullName: uiModel.name,
        metadata
    };
}

/**
 * @param flowApiName
 * @param versionNumber
 * @returns [flow api name]-[number] formatted name
 * Helper function to append version number into Flow Api Name
 */
export function constructFlowApiNameWithVersion(flowApiName: string, versionNumber): string {
    let name = flowApiName ?? '';
    if (versionNumber && typeof versionNumber == 'number') {
        name += '-' + versionNumber;
    }
    return name;
}
