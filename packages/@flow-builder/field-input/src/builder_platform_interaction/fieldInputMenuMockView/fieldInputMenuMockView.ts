import FieldInputMenuView from 'builder_platform_interaction/fieldInputMenuView';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { api } from 'lwc';

export default class FieldInputMenuMockView extends FieldInputMenuView<{}> {
    @api config;
    @api context;
    @api rules;

    count = 50;

    override updateSectionsWithData(data) {
        this.sections = [
            {
                label: 'Label',
                name: 'Constants',
                items: [
                    {
                        category: 'category',
                        dataType: 'Constant',
                        description: 'description',
                        iconName: 'utility:all',
                        iconSize: 'x-small',
                        isCollection: false,
                        label: 'Mock',
                        name: 'mock',
                        value: 'value',
                        view: { type: 'Mock' }
                    },
                    ...Array(this.count)
                        .fill(null)
                        .map((): FieldInput.MenuItem => {
                            const id = generateGuid();
                            return {
                                category: 'category',
                                dataType: 'Constant',
                                description: 'description',
                                iconName: 'utility:all',
                                iconSize: 'x-small',
                                isCollection: false,
                                label: id,
                                name: id,
                                value: id
                            };
                        })
                ]
            }
        ];
    }

    connectedCallback() {
        this.updateSectionsWithData({});
    }
}
