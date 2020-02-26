import { LegacyElement } from '../legacyElement';
import { Result } from 'analyzer_framework/api';

const mockGetData = jest.fn();
const mockReport = jest.fn();
const context = {
    getData: mockGetData,
    report: mockReport
};
const legacyElementData = { name: 'apexPluginCall1', label: 'apexLabel' };

describe('legacyElement', () => {
    const rule = new LegacyElement();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('no elements', () => {
        mockGetData.mockReturnValue({});

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(0);
    });

    it('key with no elements', () => {
        mockGetData.mockReturnValue({
            apexPluginCalls: []
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(0);
    });

    it('key with 1 element', () => {
        mockGetData.mockReturnValue({
            apexPluginCalls: [legacyElementData]
        });

        rule.invoke(context);

        expect(mockReport).toHaveBeenCalledTimes(1);
    });

    it('key with multiple elements', () => {
        const legacyElement2Data = { name: 'apexPluginCall2', label: 'apexLabel2' };
        mockGetData.mockReturnValue({
            apexPluginCalls: [legacyElementData, legacyElement2Data]
        });

        rule.invoke(context);
        expect(mockReport).toHaveBeenCalledTimes(2);
        expect(mockReport.mock.calls[0][0]).toEqual(new Result(legacyElementData, [legacyElementData.label]));
        expect(mockReport.mock.calls[1][0]).toEqual(new Result(legacyElement2Data, [legacyElement2Data.label]));
    });
});
