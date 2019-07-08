import {
    formatLhs,
    formatOperator,
    formatRhs
} from 'builder_platform_interaction/conditionListItemUtil';
import {
    getResourceByUniqueIdentifier,
    mutateFlowResourceToComboboxShape
} from 'builder_platform_interaction/expressionUtils';
import { normalizeDateTime } from 'builder_platform_interaction/dateTimeUtils';
import { transformOperatorsForCombobox } from 'builder_platform_interaction/ruleLib';

jest.mock('builder_platform_interaction/drawingLib', () =>
    require('builder_platform_interaction_mocks/drawingLib')
);

jest.mock('builder_platform_interaction/expressionUtils', () => ({
    getResourceByUniqueIdentifier: jest.fn(),
    mutateFlowResourceToComboboxShape: jest.fn()
}));

jest.mock('builder_platform_interaction/dateTimeUtils', () => ({
    normalizeDateTime: jest.fn()
}));

jest.mock('builder_platform_interaction/ruleLib', () => ({
    transformOperatorsForCombobox: jest.fn()
}));

describe('formatLhs', () => {
    it('Variable referencing a SObject', () => {
        const comboboxShapeMockValue = {
            text: 'a',
            displayText: '{!a}',
            dataType: 'SObject'
        };
        const lhs = 'a9015c2f-4ac2-48b7-8d7a-5bda7a5046e4.testText';

        getResourceByUniqueIdentifier.mockReturnValue(true);
        mutateFlowResourceToComboboxShape.mockReturnValue(
            comboboxShapeMockValue
        );
        const { displayText, dataType } = formatLhs(lhs);
        expect(displayText).toEqual('{!a.testText}');
        expect(dataType).toEqual('SObject');
    });
    it('Flow constant', () => {
        const comboboxShapeMockValue = {
            text: '$Flow.CurrentDateTime',
            displayText: '{!$Flow.CurrentDateTime}',
            dataType: 'DateTime'
        };
        const lhs = '$Flow.CurrentDateTime';

        getResourceByUniqueIdentifier.mockReturnValue(true);
        mutateFlowResourceToComboboxShape.mockReturnValue(
            comboboxShapeMockValue
        );
        const { displayText, dataType } = formatLhs(lhs);
        expect(displayText).toEqual('{!Flow.CurrentDateTime}');
        expect(dataType).toEqual('DateTime');
    });
});

describe('formatOperator', () => {
    it('EqualTo -> Equals', () => {
        const op = 'EqualTo';
        const transformOp = [{ label: 'Equals' }];
        transformOperatorsForCombobox.mockReturnValue(transformOp);

        const formattedOp = formatOperator(op);
        expect(formattedOp).toEqual('Equals');
    });
});

describe('formatRhs', () => {
    it('No input', () => {
        const rhs = '';
        const dataType = 'String';
        const formattedRhs = formatRhs(rhs, dataType);
        expect(formattedRhs).toEqual('Null');
    });
    it('Date input', () => {
        const rhs = '2019-08-09T00:00:00.000Z';
        const dataType = 'Date';
        normalizeDateTime.mockReturnValue('8/9/2019');
        const formattedRhs = formatRhs(rhs, dataType);
        expect(formattedRhs).toEqual('8/9/2019');
    });
    it('DateTime input', () => {
        const rhs = '2019-08-09T07:00:00.000Z';
        const dataType = 'DateTime';
        normalizeDateTime.mockReturnValue('8/9/2019 12:00 AM');
        const formattedRhs = formatRhs(rhs, dataType);
        expect(formattedRhs).toEqual('8/9/2019 12:00 AM');
    });
    it('Variable referencing a SObject', () => {
        const comboboxShapeMockValue = {
            text: 'a',
            displayText: '{!a}',
            dataType: 'SObject'
        };
        const rhs = 'a9015c2f-4ac2-48b7-8d7a-5bda7a5046e4.testText';

        getResourceByUniqueIdentifier.mockReturnValue(true);
        mutateFlowResourceToComboboxShape.mockReturnValue(
            comboboxShapeMockValue
        );
        const formattedRhs = formatRhs(rhs);
        expect(formattedRhs).toEqual('{!a.testText}');
    });
    it('Flow constant', () => {
        const comboboxShapeMockValue = {
            text: '$Flow.CurrentDateTime',
            displayText: '{!$Flow.CurrentDateTime}',
            dataType: 'DateTime'
        };
        const rhs = '$Flow.CurrentDateTime';

        getResourceByUniqueIdentifier.mockReturnValue(true);
        mutateFlowResourceToComboboxShape.mockReturnValue(
            comboboxShapeMockValue
        );
        const formattedRhs = formatRhs(rhs);
        expect(formattedRhs).toEqual('{!Flow.CurrentDateTime}');
    });
});
