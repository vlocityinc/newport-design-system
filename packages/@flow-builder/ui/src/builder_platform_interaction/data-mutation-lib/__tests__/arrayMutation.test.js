import { addItem, insertItem, replaceItem, deleteItem, shallowCopyArray } from '../arrayMutation';

const arr = [{
    name: 'ass1',
    label: 'assignment 1',
    description: 'desc 1'
}, {
    name: 'ass2',
    label: 'assignment 2',
    description: 'desc 2'
}];
const newItem = {
    name: 'ass3',
    label: 'assignment 3',
    description: 'desc 3'
};
describe('Array mutation library', () => {
    describe('add item in an array', () => {
        it('should return a new array', () => {
            const newArr = addItem(arr, newItem);
            expect(newArr).not.toBe(arr);
        });

        it('should have array length equals to 3', () => {
            const newArr = addItem(arr, newItem);
            expect(newArr).toHaveLength(3);
        });

        it('should be same item in the array', () => {
            const newArr = addItem(arr, newItem);
            expect(newArr[newArr.length - 1]).toEqual(newItem);
        });

        it('should throw an error if given an undefined item', () => {
            expect(() => {
                addItem(arr);
            }).toThrow();
        });
    });

    describe('shallow copy an array', () => {
        it('should return a new array', () => {
            const myArray = [1];
            const newArray = shallowCopyArray(myArray);
            expect(myArray).not.toBe(newArray);
        });

        it('should throw an error when given a non iterable object', () => {
            expect(() => {
                const myValue = 42;
                shallowCopyArray(myValue);
            }).toThrow();
        });
    });

    describe('insert item in an array', () => {
        it('should return a new array', () => {
            const index = 2;
            const newArr = insertItem(arr, newItem, index);
            expect(newArr).not.toBe(arr);
        });
        it('should have last item in the array as new item if inserted in the end', () => {
            const index = arr.length;
            const newArr = insertItem(arr, newItem, index);
            expect(newArr[index]).toEqual(newItem);
        });

        it('should have same item in the array as new item if inserted in the middle', () => {
            const index = 1;
            const newArr = insertItem(arr, newItem, index);
            expect(newArr[index]).toEqual(newItem);
        });

        it('should have same item in the array as new item if inserted in the beginning', () => {
            const index = 0;
            const newArr = insertItem(arr, newItem, index);
            expect(newArr[index]).not.toEqual(arr[index]);
        });

        it('should throw an error if index is not valid', () => {
            expect(() => {
                const index = 10;
                insertItem(arr, newItem, index);
            }).toThrow();
            expect(() => {
                const index = -1;
                insertItem(arr, newItem, index);
            }).toThrow();
        });
    });

    describe('replace item in an array', () => {
        it('should return a new array', () => {
            const index = 2;
            const newArr = replaceItem(arr, newItem, index);
            expect(newArr).not.toBe(arr);
        });

        it('should insert the item at the end of the array if given length of array', () => {
            const index = arr.length;
            const newArr = replaceItem(arr, newItem, index);
            expect(newArr[index]).toEqual(newItem);
        });

        it('should set the value at the given index', () => {
            const index = 1;
            const newArr = replaceItem(arr, newItem, index);
            expect(newArr[index]).toEqual(newItem);
        });

        it('should throw an error if index is not valid', () => {
            expect(() => {
                const index = 10;
                replaceItem(arr, newItem, index);
            }).toThrow();
            expect(() => {
                const index = -1;
                replaceItem(arr, newItem, index);
            }).toThrow();
        });

        it('should insert in the middle without deleting the end', () => {
            const index = 1;
            const testArr = [...arr, newItem];
            const newArr = replaceItem(testArr, newItem, index);
            expect(newArr).toHaveLength(3);
        });
    });

    describe('delete item in an array', () => {
        it('should return a new array', () => {
            const index = 1;
            const newArr = deleteItem(arr, index);
            expect(newArr).not.toBe(arr);
        });

        it('should decrease length of new array by 1', () => {
            const index = 1;
            const newArr = deleteItem(arr, index);
            expect(newArr).toHaveLength(arr.length - 1);
        });

        it('should remove last item if index is of last item', () => {
            const index = arr.length - 1;
            const newArr = deleteItem(arr, index);
            expect(newArr[newArr.length - 1]).not.toEqual(arr[index]);
        });

        it('should remove first item if index is of first item', () => {
            const index = 0;
            const newArr = deleteItem(arr, index);
            expect(newArr[index]).not.toEqual(arr[index]);
        });

        it('should throw an error if index is not valid', () => {
            expect(() => {
                const index = 10;
                deleteItem(arr, index);
            }).toThrow();
            expect(() => {
                const index = -1;
                deleteItem(arr, index);
            }).toThrow();
        });
    });
});