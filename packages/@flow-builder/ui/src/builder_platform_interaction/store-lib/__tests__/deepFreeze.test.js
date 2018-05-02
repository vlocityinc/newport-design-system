import { deepFreeze } from '../deepFreeze';

const obj = {
    name: 'ass1',
    label: 'assignment 1',
    description: 'desc 1'
};

const assignmentItem = {
    lhs: {
        menuData: ['testmenudata'],
        value: 'testvalue',
    },
    operator: {
        value: 'add',
    },
    rhs: {
        value: 'defaultrhs',
    }
};

const items = [
    { value: 'name' },
    { value: 'label' },
];

describe('deep freeze function', () => {
    it('should freeze object with one level', () => {
        deepFreeze(obj);
        expect(() => {
            obj.count = 5;
        }).toThrow();
    });

    it('should freeze object with two level', () => {
        deepFreeze(assignmentItem);
        expect(() => {
            assignmentItem.operator = { value: 'assign' };
        }).toThrow();
    });

    it('should freeze an array', () => {
        deepFreeze(items);
        expect(() => {
            items.push({ value: 'test' });
        }).toThrow();
    });
});