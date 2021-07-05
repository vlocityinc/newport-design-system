import { createFEROVMetadataObject } from '../ferov';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

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
});
