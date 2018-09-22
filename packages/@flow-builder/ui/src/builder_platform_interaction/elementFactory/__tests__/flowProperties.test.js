import {createFlowProperties} from '../flowProperties';

const flowMetadata = {
    metadata: {
        interviewLabel: 'interview label',
        label: 'flow label',
        processType: 'AutoLaunchedFlow',
        status: 'Draft',
        description: 'This is flow description'
    },
    versionNumber: 1,
    lastModifiedDate: '2018-09-21T19:19:16.000+0000',
    fullName: 'flow name'
};

const flowProperties = {
    interviewLabel: 'interview label',
    label: 'flow label',
    processType: 'AutoLaunchedFlow',
    status: 'Draft',
    description: 'This is flow description',
    versionNumber: 1,
    lastModifiedDate: '2018-09-21T19:19:16.000+0000',
    name: 'flow name'
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
                processType: 'AutoLaunchedFlow',
                status: 'Draft',
                elementType: 'FLOW_PROPERTIES'
            };
            const actualResult = createFlowProperties();
            expect(actualResult).toMatchObject(expectedResult);
        });
        describe('when existing flow properties is passed', () => {
            it('returns a new flow properties metadata object with same value', () => {
                const actualResult = createFlowProperties(flowMetadata);
                expect(actualResult).toMatchObject(flowProperties);
            });
            it('returns a new flow properties metadata object', () => {
                const actualResult = createFlowProperties(flowMetadata);
                expect(actualResult).not.toBe(flowProperties);
            });
            it('returns a new flow properties object with same value', () => {
                const actualResult = createFlowProperties(flowProperties);
                expect(actualResult).toMatchObject(flowProperties);
            });
            it('returns a new flow properties object', () => {
                const actualResult = createFlowProperties(flowProperties);
                expect(actualResult).not.toBe(flowProperties);
            });
        });
    });
});
