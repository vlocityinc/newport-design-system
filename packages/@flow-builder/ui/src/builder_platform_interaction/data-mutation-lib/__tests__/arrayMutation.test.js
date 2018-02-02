import { addItem, insertItem, deleteItem } from '../arrayMutation';

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
            expect(newArr.length).toBe(3);
        });

        it('should be same item in the array', () => {
            const newArr = addItem(arr, newItem);
            expect(newArr[newArr.length - 1]).toEqual(newItem);
        });

        it('should be same array if new item is undefined', () => {
            const newArr = addItem(arr);
            expect(newArr).toBe(arr);
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

        it('should return same array if index is not valid', () => {
            const index = 10;
            const newArr = insertItem(arr, newItem, index);
            expect(newArr).toBe(arr);
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
            expect(newArr.length).toBe(arr.length - 1);
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
    });
});