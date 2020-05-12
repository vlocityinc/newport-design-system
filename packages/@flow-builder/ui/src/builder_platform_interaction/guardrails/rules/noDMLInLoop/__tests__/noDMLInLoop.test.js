// @ts-nocheck
import { NoDMLInLoop } from '../noDMLInLoop';
import { Result } from 'analyzer_framework/api';

const mockGetData = jest.fn();
const mockReport = jest.fn();
const context = {
    getData: mockGetData,
    report: mockReport
};
const loopData = { name: 'loop1', label: 'loopLabel' };
const dmlElementData = {
    next: 'somethingElse3',
    type: 'RecordCreate',
    id: 'Create_Market_Reps',
    label: 'Create Market Reps'
};
const dmlElementData01 = {
    next: 'somethingElse',
    type: 'RecordCreate',
    id: 'Create_Market_Reps_1',
    label: 'Create Market Reps'
};

describe('noDMLInLoop', () => {
    const rule = new NoDMLInLoop();
    const spy = jest.spyOn(rule, 'findDMLElement');

    beforeEach(() => {
        jest.clearAllMocks();
        spy.mockImplementation(() => dmlElementData);
    });

    it('no loop', () => {
        mockGetData.mockReturnValue({
            loops: []
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(0);
    });

    it('loop not closed', () => {
        mockGetData.mockReturnValue({
            loops: [loopData],
            consumerProperties: {
                connectorTargets: {
                    loop1: { next: ['dml1'] },
                    dml1: { next: ['somethingElse'], type: 'RecordCreate' },
                    somethingElse: { next: ['unknown'] }
                }
            }
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(0);
    });

    it('circular loop', () => {
        mockGetData.mockReturnValue({
            loops: [loopData],
            consumerProperties: {
                connectorTargets: {
                    loop1: { next: ['dml1'] },
                    dml1: { next: ['somethingElse1'], type: 'RecordCreate' },
                    somethingElse1: { next: ['somethingElse2'] },
                    somethingElse2: { next: ['dml1'] }
                }
            }
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(0);
    });

    it('loop without DML', () => {
        mockGetData.mockReturnValue({
            loops: [loopData],
            consumerProperties: {
                connectorTargets: {
                    loop1: { next: ['somethingElse1'] },
                    somethingElse1: { next: ['somethingElse2'] },
                    somethingElse2: { next: ['somethingElse3'] },
                    somethingElse3: { next: ['loop1'] }
                }
            }
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(0);
    });

    it('create DML in loop', () => {
        mockGetData.mockReturnValue({
            loops: [loopData],
            consumerProperties: {
                connectorTargets: {
                    loop1: { next: ['somethingElse1'] },
                    somethingElse1: { next: ['dml1'] },
                    dml1: { next: ['somethingElse3'], type: 'RecordCreate' },
                    somethingElse3: { next: ['loop1'] }
                }
            }
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(1);
        expect(mockReport.mock.calls[0][0]).toEqual(
            new Result(
                [dmlElementData],
                ['FlowBuilderLeftPanelElements.createDataOperationLabel', 'Create Market Reps']
            )
        );
    });

    it('lookup DML in loop', () => {
        mockGetData.mockReturnValue({
            loops: [loopData],
            consumerProperties: {
                connectorTargets: {
                    loop1: { next: ['somethingElse1'] },
                    somethingElse1: { next: ['dml1'] },
                    dml1: { next: ['somethingElse3'], type: 'RecordQuery' },
                    somethingElse3: { next: ['loop1'] }
                }
            }
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(1);
        expect(mockReport.mock.calls[0][0]).toEqual(
            new Result(
                [dmlElementData],
                ['FlowBuilderLeftPanelElements.lookupDataOperationLabel', 'Create Market Reps']
            )
        );
    });

    it('update DML in loop', () => {
        mockGetData.mockReturnValue({
            loops: [loopData],
            consumerProperties: {
                connectorTargets: {
                    loop1: { next: ['somethingElse1'] },
                    somethingElse1: { next: ['dml1'] },
                    dml1: { next: ['somethingElse3'], type: 'RecordUpdate' },
                    somethingElse3: { next: ['loop1'] }
                }
            }
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(1);
        expect(mockReport.mock.calls[0][0]).toEqual(
            new Result(
                [dmlElementData],
                ['FlowBuilderLeftPanelElements.updateDataOperationLabel', 'Create Market Reps']
            )
        );
    });

    it('delete DML in loop', () => {
        mockGetData.mockReturnValue({
            loops: [loopData],
            consumerProperties: {
                connectorTargets: {
                    loop1: { next: ['somethingElse1'] },
                    somethingElse1: { next: ['dml1'] },
                    dml1: { next: ['somethingElse3'], type: 'RecordDelete' },
                    somethingElse3: { next: ['loop1'] }
                }
            }
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(1);
        expect(mockReport.mock.calls[0][0]).toEqual(
            new Result(
                [dmlElementData],
                ['FlowBuilderLeftPanelElements.deleteDataOperationLabel', 'Create Market Reps']
            )
        );
    });

    it('multiple DML in loop', () => {
        spy.mockImplementationOnce(() => dmlElementData).mockImplementationOnce(() => dmlElementData01);
        mockGetData.mockReturnValue({
            loops: [loopData],
            consumerProperties: {
                connectorTargets: {
                    loop1: { next: ['somethingElse1'] },
                    somethingElse1: { next: ['dml1', 'somethingElse4'] },
                    dml1: { next: ['somethingElse2'], type: 'RecordCreate' },
                    somethingElse2: { next: ['dml2'] },
                    dml2: { next: ['somethingElse3'], type: 'RecordDelete' },
                    somethingElse3: { next: ['loop1'] }
                }
            }
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(2);
        expect(mockReport.mock.calls[0][0]).toEqual(
            new Result(
                [dmlElementData],
                ['FlowBuilderLeftPanelElements.createDataOperationLabel', 'Create Market Reps']
            )
        );
        expect(mockReport.mock.calls[1][0]).toEqual(
            new Result(
                [dmlElementData01],
                ['FlowBuilderLeftPanelElements.deleteDataOperationLabel', 'Create Market Reps']
            )
        );
    });
});

describe('findDMLElement', () => {
    const rule = new NoDMLInLoop();

    const flowdata = {
        id: 'flow1',
        label: 'flow1',
        recordCreates: [
            {
                id: 'Create_Market_Reps',
                name: 'Create_Market_Reps',
                type: 'RecordCreate',
                label: 'Create Market Reps'
            },
            {
                id: 'Create_Market_Reps_0',
                name: 'Create_Market_Reps_0',
                type: 'RecordCreate',
                label: 'Create Market Reps'
            }
        ],
        recordLookups: [
            {
                id: 'Get_Sales_Reps',
                name: 'Get_Sales_Reps',
                type: 'RecordQuery',
                label: 'Get Sales Reps'
            }
        ]
    };

    const expectedDml = {
        id: 'Create_Market_Reps_0',
        name: 'Create_Market_Reps_0',
        type: 'RecordCreate',
        label: 'Create Market Reps'
    };

    it('find dml', () => {
        const dml = rule.findDMLElement(flowdata, 'RecordCreate', 'Create_Market_Reps_0');
        expect(dml).toEqual(expectedDml);
    });

    it('does not find dml', () => {
        const dml = rule.findDMLElement(flowdata, 'RecordCreate', 'Create_Market_Reps_1');
        expect(dml).toEqual(null);
    });
});
