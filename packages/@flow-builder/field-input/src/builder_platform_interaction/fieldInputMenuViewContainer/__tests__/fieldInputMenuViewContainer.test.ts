import { createComponent, mockLabel } from 'builder_platform_interaction/builderTestUtils';
import { getViewProps } from '../utils';

const tag = 'builder_platform_interaction-field-input-box';

const createComponentUnderTest = async (props) => {
    const overrideProps = {};

    return createComponent(tag, props, overrideProps);
};

mockLabel(jest, 'FlowBuilderFieldInput.allResources');

describe('Field Input Menu View Container Tests', () => {
    describe('component', () => {
        let cmp;

        beforeEach(async () => {
            cmp = await createComponentUnderTest({});
        });

        it('sanity', async () => {
            expect(cmp).toBeTruthy();
        });
    });

    describe('utils', () => {
        it('getViewProps > All', () => {
            const view: FieldInput.MenuItemView = { type: 'All' };

            expect(getViewProps(view)).toEqual({
                type: 'All',
                isAllView: true
            });
        });

        it('getViewProps > ObjectFields', () => {
            const objectApiName = 'Account';
            const view: FieldInput.MenuItemViewObjectFields = {
                type: 'ObjectFields',
                objectApiName
            };

            expect(getViewProps(view)).toEqual({
                type: 'ObjectFields',
                isObjectFieldsView: true,
                objectApiName
            });
        });

        it('getViewProps > PicklistValues', () => {
            const fieldApiName = 'Account.AddressType';
            const recordTypeId = '012RO00000055zsYAA';

            const view: FieldInput.MenuItemViewPicklistValues = {
                type: 'PicklistValues',
                fieldApiName,
                recordTypeId
            };

            expect(getViewProps(view)).toEqual({
                type: 'PicklistValues',
                isPicklistValuesView: true,
                fieldApiName,
                recordTypeId
            });
        });
    });
});
