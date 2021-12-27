// @ts-nocheck
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { parseDateTimeUTC } from 'lightning/internalLocalizationService';
import { createFEROVMetadataObject } from '../ferov';

describe('create FEROV Metadata Object', () => {
    it('stores invalid primitives as string values', () => {
        [
            FLOW_DATA_TYPE.NUMBER.value,
            FLOW_DATA_TYPE.CURRENCY.value,
            FLOW_DATA_TYPE.BOOLEAN.value,
            FLOW_DATA_TYPE.DATE.value,
            FLOW_DATA_TYPE.DATE_TIME.value
        ].forEach((type) => {
            expect(createFEROVMetadataObject({ value: 'asdf', dataType: type }, 'value', 'dataType')).toMatchObject({
                stringValue: 'asdf'
            });
        });
    });
    describe('saving valid primitives', () => {
        it('stores datetimes', () => {
            parseDateTimeUTC.mockReturnValueOnce(new Date());
            const mockDatetimeLiteral = '1999-12-31T23:59:00.000+0000';
            expect(
                createFEROVMetadataObject(
                    { value: mockDatetimeLiteral, dataType: FLOW_DATA_TYPE.DATE_TIME.value },
                    'value',
                    'dataType'
                )
            ).toMatchObject({
                dateTimeValue: '1999-12-31T23:59:00.000+0000'
            });
        });
        it('stores date', () => {
            parseDateTimeUTC.mockReturnValueOnce(new Date());
            const mockDateLiteral = '1999-12-31T00:00:00.000+0000';
            expect(
                createFEROVMetadataObject(
                    { value: mockDateLiteral, dataType: FLOW_DATA_TYPE.DATE.value },
                    'value',
                    'dataType'
                )
            ).toMatchObject({
                dateValue: '1999-12-31T00:00:00.000+0000'
            });
        });
        it('stores strings', () => {
            expect(
                createFEROVMetadataObject(
                    { value: 'valid', dataType: FLOW_DATA_TYPE.STRING.value },
                    'value',
                    'dataType'
                )
            ).toMatchObject({
                stringValue: 'valid'
            });
        });
        it('stores booleans', () => {
            expect(
                createFEROVMetadataObject({ value: true, dataType: FLOW_DATA_TYPE.BOOLEAN.value }, 'value', 'dataType')
            ).toMatchObject({
                booleanValue: true
            });
        });

        it('stores numbers', () => {
            expect(
                createFEROVMetadataObject({ value: 123, dataType: FLOW_DATA_TYPE.NUMBER.value }, 'value', 'dataType')
            ).toMatchObject({
                numberValue: 123
            });
        });

        it('stores zero passed as a number', () => {
            expect(
                createFEROVMetadataObject({ value: 0, dataType: FLOW_DATA_TYPE.NUMBER.value }, 'value', 'dataType')
            ).toMatchObject({
                numberValue: 0
            });
        });

        it('stores currency', () => {
            expect(
                createFEROVMetadataObject({ value: 123, dataType: FLOW_DATA_TYPE.CURRENCY.value }, 'value', 'dataType')
            ).toMatchObject({
                numberValue: 123
            });
        });
    });

    describe('saving valid case insensitive primitives', () => {
        it('stores datetimes', () => {
            parseDateTimeUTC.mockReturnValueOnce(new Date());
            const mockDatetimeLiteral = '1999-12-31T23:59:00.000+0000';
            expect(
                createFEROVMetadataObject({ value: mockDatetimeLiteral, dataType: 'datetime' }, 'value', 'dataType')
            ).toMatchObject({
                dateTimeValue: '1999-12-31T23:59:00.000+0000'
            });
        });
        it('stores date', () => {
            parseDateTimeUTC.mockReturnValueOnce(new Date());
            const mockDateLiteral = '1999-12-31T00:00:00.000+0000';
            expect(
                createFEROVMetadataObject({ value: mockDateLiteral, dataType: 'date' }, 'value', 'dataType')
            ).toMatchObject({
                dateValue: '1999-12-31T00:00:00.000+0000'
            });
        });
        it('stores strings case', () => {
            expect(
                createFEROVMetadataObject({ value: 'valid', dataType: 'string' }, 'value', 'dataType')
            ).toMatchObject({
                stringValue: 'valid'
            });
        });
        it('stores booleans', () => {
            expect(createFEROVMetadataObject({ value: true, dataType: 'boolean' }, 'value', 'dataType')).toMatchObject({
                booleanValue: true
            });
        });

        it('stores numbers', () => {
            expect(createFEROVMetadataObject({ value: 123, dataType: 'number' }, 'value', 'dataType')).toMatchObject({
                numberValue: 123
            });
        });

        it('stores currency', () => {
            expect(createFEROVMetadataObject({ value: 123, dataType: 'currency' }, 'value', 'dataType')).toMatchObject({
                numberValue: 123
            });
        });
    });
});
