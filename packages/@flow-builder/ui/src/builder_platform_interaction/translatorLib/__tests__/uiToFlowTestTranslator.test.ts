import { FlowTestPointValidator } from 'builder_platform_interaction/elementFactory';
import { Store } from 'builder_platform_interaction/storeLib';
import { translateUIModelToFlowTest } from '../uiToFlowTestTranslator';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const uiModel = {
    guid: 'e12622d1-ca96-40cd-98f1-ee7cb8d10311',
    name: 'test',
    description: 'testDescription',
    elementType: 'FLOW_TEST_EDITOR',
    label: 'testLabel',
    runPathValue: 'RunImmediately',
    testTriggerType: 'Create',
    testAssertions: [
        {
            expression: {
                rowIndex: '6c6e8656-aced-4115-a62a-e9b6e40b55f8',
                leftHandSide: '$Record.AccountNumber',
                rightHandSide: 'testAcc',
                rightHandSideDataType: 'String',
                operator: 'EqualTo'
            },
            message: 'Failed!'
        }
    ],
    testInitialRecordData: {
        AccountNumber: null,
        Name: 'testAcc2',
        OwnerId: '005xx000001X7ttAAC'
    }
};

describe('UI to Flow Test Translation', () => {
    describe('translateUIModelToFlowTest', () => {
        beforeAll(() => {
            Store.setMockState({
                properties: {
                    name: 'flowTestApi',
                    versionNumber: 1
                },
                elements: {}
            });
        });
        afterAll(() => {
            Store.resetStore();
        });
        it('return fullName, description and label ', () => {
            const { fullName, metadata } = translateUIModelToFlowTest(uiModel);
            expect(fullName).toBe('test');
            expect(metadata.description).toBe('testDescription');
            expect(metadata.flowApiName).toBe('flowTestApi-1');
            expect(metadata.label).toBe('testLabel');
        });
        it('return 2 test points ', () => {
            const { metadata } = translateUIModelToFlowTest(uiModel);
            expect(metadata.testPoints.length).toBe(2);
        });
        it('return START and FINISH test points ', () => {
            const { metadata } = translateUIModelToFlowTest(uiModel);
            expect(metadata.testPoints[0].elementApiName).toBe(FlowTestPointValidator.Start);
            expect(metadata.testPoints[1].elementApiName).toBe(FlowTestPointValidator.Finish);
        });
        it('return 1 parameter for START test point', () => {
            const { metadata } = translateUIModelToFlowTest(uiModel);
            expect(metadata.testPoints[0].parameters.length).toBe(1);
        });
        it('return empty assertion for START test point', () => {
            const { metadata } = translateUIModelToFlowTest(uiModel);
            expect(metadata.testPoints[0].assertions.length).toBe(0);
        });
        it('return empty parameters for FINISH test point', () => {
            const { metadata } = translateUIModelToFlowTest(uiModel);
            expect(metadata.testPoints[1].parameters.length).toBe(0);
        });
        it('return 1 assertion for FINISH test point', () => {
            const { metadata } = translateUIModelToFlowTest(uiModel);
            expect(metadata.testPoints[1].assertions.length).toBe(1);
        });
    });
});
