import {createFlowProperties} from '../flowProperties';

const flowMetadataSavedInCfd = {
    metadata: {
        interviewLabel: 'interview label',
        label: 'flow label',
        processType: 'AutoLaunchedFlow',
        status: 'Draft',
        description: 'This is flow description',
        processMetadataValues: []
    },
    versionNumber: 1,
    lastModifiedDate: '2018-09-21T19:19:16.000+0000',
    fullName: 'flow name'
};

const flowMetadataSavedInFlowBuilder = {
    metadata: {
        interviewLabel: 'interview label',
        label: 'flow label',
        processType: 'AutoLaunchedFlow',
        status: 'Draft',
        description: 'This is flow description',
        processMetadataValues: [
            {
                name: 'BuilderType',
                value: {
                    stringValue: 'LightningFlowBuilder'
                }
            }
        ]
    },
    versionNumber: 1,
    lastModifiedDate: '2018-09-21T19:19:16.000+0000',
    fullName: 'flow name'
};

const flowPropertiesSavedInCfd = {
    interviewLabel: 'interview label',
    label: 'flow label',
    processType: 'AutoLaunchedFlow',
    status: 'Draft',
    description: 'This is flow description',
    versionNumber: 1,
    lastModifiedDate: '2018-09-21T19:19:16.000+0000',
    name: 'flow name',
    isLightningFlowBuilder: false
};

const flowPropertiesSavedInFlowBuilder = {
    interviewLabel: 'interview label',
    label: 'flow label',
    processType: 'AutoLaunchedFlow',
    status: 'Draft',
    description: 'This is flow description',
    versionNumber: 1,
    lastModifiedDate: '2018-09-21T19:19:16.000+0000',
    name: 'flow name',
    isLightningFlowBuilder: true
};

describe('Flow properties', () => {
    describe('createFlowProperties function', () => {
        it('returns a new flow properties object when no argument is passed', () => {
            const expectedResult = {
                label: '',
                name: '',
                description: '',
                versionNumber: null,
                lastModifiedDate: null,
                interviewLabel: '',
                status: 'Draft',
                elementType: 'FLOW_PROPERTIES',
                isLightningFlowBuilder: true,
                hasUnsavedChanges: false
            };
            const actualResult = createFlowProperties();
            expect(actualResult).toMatchObject(expectedResult);
        });
        describe('when existing flow properties which is saved in CFD is passed', () => {
            it('returns a new flow properties metadata object with same value', () => {
                const actualResult = createFlowProperties(flowMetadataSavedInCfd);
                expect(actualResult).toMatchObject(flowPropertiesSavedInCfd);
            });
            it('returns a new flow properties metadata object', () => {
                const actualResult = createFlowProperties(flowMetadataSavedInCfd);
                expect(actualResult).not.toBe(flowPropertiesSavedInCfd);
            });
            it('returns a new flow properties object with same value', () => {
                const actualResult = createFlowProperties(flowPropertiesSavedInCfd);
                expect(actualResult).toMatchObject(flowPropertiesSavedInCfd);
            });
            it('returns a new flow properties object', () => {
                const actualResult = createFlowProperties(flowPropertiesSavedInCfd);
                expect(actualResult).not.toBe(flowPropertiesSavedInCfd);
            });
        });
        describe('when existing flow properties which is saved in flow builder is passed', () => {
            it('returns a new flow properties metadata object with same value', () => {
                const actualResult = createFlowProperties(flowMetadataSavedInFlowBuilder);
                expect(actualResult).toMatchObject(flowPropertiesSavedInFlowBuilder);
            });
            it('returns a new flow properties metadata object', () => {
                const actualResult = createFlowProperties(flowMetadataSavedInFlowBuilder);
                expect(actualResult).not.toBe(flowPropertiesSavedInFlowBuilder);
            });
            it('returns a new flow properties object with same value', () => {
                const actualResult = createFlowProperties(flowPropertiesSavedInFlowBuilder);
                expect(actualResult).toMatchObject(flowPropertiesSavedInFlowBuilder);
            });
            it('returns a new flow properties object', () => {
                const actualResult = createFlowProperties(flowPropertiesSavedInFlowBuilder);
                expect(actualResult).not.toBe(flowPropertiesSavedInFlowBuilder);
            });
        });
    });
});
