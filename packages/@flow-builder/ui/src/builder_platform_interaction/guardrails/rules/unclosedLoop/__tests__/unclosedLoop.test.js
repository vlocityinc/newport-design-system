import { UnclosedLoop } from '../unclosedLoop';
import { Result } from 'analyzer_framework/api';

const mockGetData = jest.fn();
const mockReport = jest.fn();
const context = {
    getData: mockGetData,
    report: mockReport
};
const loopData = { name: 'loop1', label: 'loopLabel' };

describe('unclosedLoop', () => {
    const rule = new UnclosedLoop();

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

    it('multiple paths loop', () => {
        mockGetData.mockReturnValue({
            loops: [loopData],
            consumerProperties: {
                connectorTargets: {
                    loop1: { next: ['element1'] },
                    element1: { next: ['somethingElse1', 'somethingElse2'] },
                    somethingElse1: { next: ['loop1'] },
                    somethingElse2: { next: ['element1'] }
                }
            }
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

        expect(mockReport).toHaveBeenCalledTimes(1);
    });

    it('circular loop', () => {
        mockGetData.mockReturnValue({
            loops: [loopData],
            consumerProperties: {
                connectorTargets: {
                    loop1: { next: ['element1'] },
                    element1: { next: ['somethingElse1'] },
                    somethingElse1: { next: ['somethingElse2'] },
                    somethingElse2: { next: ['element1'] }
                }
            }
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(1);
    });

    it('multiple unclosed loops', () => {
        const loop2Data = { name: 'loop2', label: 'loop2Label' };
        mockGetData.mockReturnValue({
            loops: [loopData, loop2Data],
            consumerProperties: {
                connectorTargets: {
                    loop1: { next: ['somethingElse1'] },
                    loop2: { next: ['somethingElse1'] },
                    somethingElse1: { next: ['somethingElse2'] },
                    somethingElse2: { next: ['somethingElse1'] }
                }
            }
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(2);
        expect(mockReport.mock.calls[0][0]).toEqual(new Result([loopData], [loopData.label]));
        expect(mockReport.mock.calls[1][0]).toEqual(new Result([loop2Data], [loop2Data.label]));
    });

    it('closed loop in loop', () => {
        const loop2Data = { name: 'loop2', label: 'loop2Label' };
        mockGetData.mockReturnValue({
            loops: [loopData, loop2Data],
            consumerProperties: {
                connectorTargets: {
                    loop1: { next: ['loop2'] },
                    loop2: { next: ['somethingElse1', 'loop1'] },
                    somethingElse1: { next: ['loop1'] }
                }
            }
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(0);
    });

    it('unclosed loop in loop', () => {
        const loop2Data = { name: 'loop2', label: 'loop2Label' };
        mockGetData.mockReturnValue({
            loops: [loopData, loop2Data],
            consumerProperties: {
                connectorTargets: {
                    loop1: { next: ['loop2', 'somethingElse2'] },
                    loop2: { next: ['somethingElse1'] },
                    somethingElse2: { next: ['loop1'] }
                }
            }
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(1);
        expect(mockReport.mock.calls[0][0]).toEqual(new Result([loop2Data], [loop2Data.label]));
    });
});
