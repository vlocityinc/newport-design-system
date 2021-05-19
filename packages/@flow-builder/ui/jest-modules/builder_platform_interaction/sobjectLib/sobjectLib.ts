import { allEntities as mockEntities } from 'serverData/GetEntities/allEntities.json';

export const getEntity = jest.fn().mockImplementation((apiName) => {
    return mockEntities.find((entity) => entity.apiName === apiName);
});
