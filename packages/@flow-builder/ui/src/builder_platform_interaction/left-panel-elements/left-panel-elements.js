import { Element } from 'engine';

export default class LeftPanelElements extends Element {
    // The data format should be compatible with lightning-tree-grid.
    // TODO: This should eventually come from a service.
    data = [
        {
            guid: 'SECTION_LOGIC',
            label: 'Logic',
            _children: [
                {
                    guid: 'ELEMENT_ASSIGNMENT',
                    iconName: 'standard:lead_list',
                    label: 'Assignment'
                }
            ]
        }
    ];
}