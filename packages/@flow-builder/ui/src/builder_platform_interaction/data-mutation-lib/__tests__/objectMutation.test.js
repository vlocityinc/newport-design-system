import { pick, omit, updateProperties} from '../objectMutation';

const obj = {
    name: 'ass1',
    label: 'assignment 1',
    description: 'desc 1'
};

const updatedProps = {
    name: 'ass2',
    createdBy: 'user1'
};

const allowedProps = ['name', 'label'];
const omitProps = ['description'];

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