import { pick, omit, set, updateProperties, stringToPath} from '../objectMutation';

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

// our mock assignment with an array of assignment items
const mockAssignment = {
    items: [
        {
            lhs: {
                menuData: ['firstmenudata'],
                value: 'firstlhs',
            },
            operator: {
                value: 'add',
            },
            rhs: {
                value: 'firstrhs',
            }
        },
        {
            lhs: {
                menuData: ['secondmenudata'],
                value: 'secondlhs',
            },
            operator: {
                value: 'setTo',
            },
            rhs: {
                value: 'secondrhs',
            }
        },
    ],
    label: 'mockassignment',
};

const updatedProps = {
    name: 'ass2',
    createdBy: 'user1',
};

const allowedProps = ['name', 'label'];
const omitProps = ['description'];

describe('Set function', () => {
    // test suite for the helper function that converts a string to a path array
    describe('stringToPath helper function', () => {
        it('should return the given path if already an array', () => {
            const path = stringToPath(['testvalue']);
            expect(path).toBeDefined();
            expect(Array.isArray(path)).toBeTruthy();
            expect(path[0]).toEqual('testvalue');
        });

        it('should return an empty array if not given an array or string', () => {
            const path = stringToPath(42);
            expect(Array.isArray(path)).toBeTruthy();
            expect(path).toHaveLength(0);
        });

        it('should return a path given a period deliminated string with no indexing', () => {
            const path = stringToPath('item.value.lhs');
            expect(path).toHaveLength(3);
            expect(path[0]).toEqual('item');
            expect(path[1]).toEqual('value');
            expect(path[2]).toEqual('lhs');
        });

        it('should return a path given a period deliminated string wth indexing', () => {
            const path = stringToPath('item[0].value.lhs');
            expect(path).toHaveLength(4);
            expect(path[0]).toEqual('item');
            expect(path[1]).toEqual('0');
            expect(path[2]).toEqual('value');
            expect(path[3]).toEqual('lhs');
        });

        it('should treat strings with non digits inside brackets as normal keys', () => {
            const path = stringToPath('item[n].value');
            expect(path).toHaveLength(2);
            expect(path[0]).toEqual('item[n]');
            expect(path[1]).toEqual('value');
        });

        it('should return a path with both non digit and digit indexes', () => {
            const path = stringToPath('item[n][0].value');
            expect(path).toHaveLength(3);
            expect(path[0]).toEqual('item[n]');
            expect(path[1]).toEqual('0');
            expect(path[2]).toEqual('value');
        });

        it('should return a path with multiple digit indexing ', () => {
            const path = stringToPath('item[0][1]');
            expect(path).toHaveLength(3);
            expect(path[0]).toEqual('item');
            expect(path[1]).toEqual('0');
            expect(path[2]).toEqual('1');
        });
    });

    it('should be defined', () => {
        expect(set).toBeDefined();
    });

    it('should return a new object', () => {
        const newObj = set(assignmentItem, ['lhs', 'value'], 'newvalue');
        expect(newObj).not.toBe(assignmentItem);
    });

    it('should accept a period deliminated string path', () => {
        expect(() => {
            set(assignmentItem, 'lhs.value', 'newvalue');
        }).not.toThrow();
    });

    it('should update the value at the given path using string path', () => {
        const newObj = set(assignmentItem, 'lhs.value', 'newvalue');
        expect(newObj.lhs.value).toEqual('newvalue');
    });

    it('should update the value with a string path using indexing', () => {
        const newObj = set(mockAssignment, 'items[0].lhs.value', 'newvalue');
        expect(newObj.items[0].lhs.value).toEqual('newvalue');
    });

    it('should update the value at the given path', () => {
        const newObj = set(assignmentItem, ['lhs', 'value'], 'newvalue');
        expect(newObj.lhs.value).toEqual('newvalue');
    });

    it('should update the value at the given path using idexing', () => {
        const newObj = set(mockAssignment, ['items', '0', 'lhs', 'value'], 'newvalue');
        expect(newObj.items[0].lhs.value).toEqual('newvalue');
    });

    it('should return an object with keys from the given path if such a path does not already exist', () => {
        const newObj = set(assignmentItem, ['firstNewKey', 'secondNewKey'], 'newvalue');
        expect(newObj.firstNewKey.secondNewKey).toEqual('newvalue');
    });

    it('should only change the value at the given path', () => {
        const newObj = set(assignmentItem, ['lhs', 'value'], 'newvalue');
        expect(newObj.lhs.menudata).toEqual(assignmentItem.lhs.menudata);
        expect(newObj.operator).toBeDefined();
        expect(newObj.operator).toEqual(assignmentItem.operator);
        expect(newObj.rhs).toBeDefined();
        expect(newObj.rhs).toEqual(assignmentItem.rhs);
    });

    it('should only change the value at the given path using indexing', () => {
        const newObj = set(mockAssignment, ['items', '0', 'lhs', 'value'], 'newvalue');
        expect(newObj.items[0].lhs.menudata).toEqual(mockAssignment.items[0].lhs.menudata);
        expect(newObj.items[0].operator).toEqual(mockAssignment.items[0].operator);
        expect(newObj.items[0].rhs).toEqual(mockAssignment.items[0].rhs);
        expect(newObj.items[1]).toEqual(mockAssignment.items[1]);
    });

    it('should return a clone of the object if no path is given', () => {
        const newObj = set(assignmentItem, undefined, 'newvalue');
        expect(newObj.lhs.value).toEqual('testvalue');
    });

    it('should set the value to undefined if no value is given', () => {
        const newObj = set(assignmentItem, ['lhs', 'value'], undefined);
        expect(newObj.lhs.value).toEqual(undefined);
    });

    it('should return a new object with keys from the given path if no object is given', () => {
        const newObj = set(undefined, ['lhs', 'value'], 'newvalue');
        expect(newObj).toBeDefined();
        expect(newObj.lhs).toBeDefined();
        expect(newObj.lhs.value).toBeDefined();
        expect(newObj.lhs.value).toEqual('newvalue');
    });
});

describe('Pick function', () => {
    it('should return new object', () => {
        const newObj = pick(obj, allowedProps);
        expect(newObj).not.toBe(obj);
    });

    it('should return object with name and label properties', () => {
        const newObj = pick(obj, allowedProps);
        expect(newObj).toHaveProperty('name');
        expect(newObj).toHaveProperty('label');
    });

    it('should return object with no description property', () => {
        const newObj = pick(obj, allowedProps);
        expect(newObj).not.toHaveProperty('description');
    });

    it('should return new object with no props if no allowed props are passed', () => {
        const newObj = pick(obj);
        expect(newObj).not.toHaveProperty('name');
        expect(newObj).not.toHaveProperty('label');
        expect(newObj).not.toHaveProperty('description');
    });
});

describe('Omit function', () => {
    it('should return new object', () => {
        const newObj = omit(obj, omitProps);
        expect(newObj).not.toBe(obj);
    });

    it('should return object with name and label properties', () => {
        const newObj = omit(obj, omitProps);
        expect(newObj).toHaveProperty('name');
        expect(newObj).toHaveProperty('label');
    });

    it('should return object with no description property', () => {
        const newObj = omit(obj, omitProps);
        expect(newObj).not.toHaveProperty('description');
    });

    it('show return object with all the properties if no omitProps are passed', () => {
        const newObj = omit(obj);
        expect(newObj).toHaveProperty('name');
        expect(newObj).toHaveProperty('label');
        expect(newObj).toHaveProperty('description');
    });
});

describe('update properties function', () => {
    it('should return new object', () => {
        const newObj =  updateProperties(obj, updatedProps);
        expect(newObj).not.toBe(obj);
    });

    it('should return new object with new values for name props', () => {
        const newObj =  updateProperties(obj, updatedProps);
        expect(newObj.name).toBe('ass2');
    });

    it('should return new object with new props', () => {
        const newObj =  updateProperties(obj, updatedProps);
        expect(newObj).toHaveProperty('createdBy');
    });
});
