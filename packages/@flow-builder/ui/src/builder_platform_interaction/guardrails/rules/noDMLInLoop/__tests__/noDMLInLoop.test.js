import { NoDMLInLoop } from '../noDMLInLoop';
import { Result } from 'analyzer_framework/api';

const mockGetData = jest.fn();
const mockReport = jest.fn();
const context = {
    getData: mockGetData,
    report: mockReport
};
const loopData = { name: 'loop1', label: 'loopLabel' };

describe('noDMLInLoop', () => {
    const rule = new NoDMLInLoop();

    beforeEach(() => {
        jest.clearAllMocks();
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
                    loop1: { next: 'dml1' },
                    dml1: { next: 'somethingElse', type: 'RecordCreate' },
                    somethingElse: { next: 'unknown' }
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
                    loop1: { next: 'dml1' },
                    dml1: { next: 'somethingElse1', type: 'RecordCreate' },
                    somethingElse1: { next: 'somethingElse2' },
                    somethingElse2: { next: 'dml1' }
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
                    loop1: { next: 'somethingElse1' },
                    somethingElse1: { next: 'somethingElse2' },
                    somethingElse2: { next: 'somethingElse3' },
                    somethingElse3: { next: 'loop1' }
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
                    loop1: { next: 'somethingElse1' },
                    somethingElse1: { next: 'dml1' },
                    dml1: { next: 'somethingElse3', type: 'RecordCreate' },
                    somethingElse3: { next: 'loop1' }
                }
            }
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(1);
        expect(mockReport.mock.calls[0][0]).toEqual(
            new Result(loopData, [loopData.label, 'FlowBuilderLeftPanelElements.createDataOperationLabel'])
        );
    });

    it('lookup DML in loop', () => {
        mockGetData.mockReturnValue({
            loops: [loopData],
            consumerProperties: {
                connectorTargets: {
                    loop1: { next: 'somethingElse1' },
                    somethingElse1: { next: 'dml1' },
                    dml1: { next: 'somethingElse3', type: 'RecordQuery' },
                    somethingElse3: { next: 'loop1' }
                }
            }
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(1);
        expect(mockReport.mock.calls[0][0]).toEqual(
            new Result(loopData, [loopData.label, 'FlowBuilderLeftPanelElements.lookupDataOperationLabel'])
        );
    });

    it('update DML in loop', () => {
        mockGetData.mockReturnValue({
            loops: [loopData],
            consumerProperties: {
                connectorTargets: {
                    loop1: { next: 'somethingElse1' },
                    somethingElse1: { next: 'dml1' },
                    dml1: { next: 'somethingElse3', type: 'RecordUpdate' },
                    somethingElse3: { next: 'loop1' }
                }
            }
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(1);
        expect(mockReport.mock.calls[0][0]).toEqual(
            new Result(loopData, [loopData.label, 'FlowBuilderLeftPanelElements.updateDataOperationLabel'])
        );
    });

    it('delete DML in loop', () => {
        mockGetData.mockReturnValue({
            loops: [loopData],
            consumerProperties: {
                connectorTargets: {
                    loop1: { next: 'somethingElse1' },
                    somethingElse1: { next: 'dml1' },
                    dml1: { next: 'somethingElse3', type: 'RecordDelete' },
                    somethingElse3: { next: 'loop1' }
                }
            }
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(1);
        expect(mockReport.mock.calls[0][0]).toEqual(
            new Result(loopData, [loopData.label, 'FlowBuilderLeftPanelElements.deleteDataOperationLabel'])
        );
    });

    it('multiple DML in loop', () => {
        mockGetData.mockReturnValue({
            loops: [loopData],
            consumerProperties: {
                connectorTargets: {
                    loop1: { next: 'somethingElse1' },
                    somethingElse1: { next: 'dml1' },
                    dml1: { next: 'somethingElse2', type: 'RecordCreate' },
                    somethingElse2: { next: 'dml2' },
                    dml2: { next: 'somethingElse3', type: 'RecordDelete' },
                    somethingElse3: { next: 'loop1' }
                }
            }
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(2);
        expect(mockReport.mock.calls[0][0]).toEqual(
            new Result(loopData, [loopData.label, 'FlowBuilderLeftPanelElements.createDataOperationLabel'])
        );
        expect(mockReport.mock.calls[1][0]).toEqual(
            new Result(loopData, [loopData.label, 'FlowBuilderLeftPanelElements.deleteDataOperationLabel'])
        );
    });
});
