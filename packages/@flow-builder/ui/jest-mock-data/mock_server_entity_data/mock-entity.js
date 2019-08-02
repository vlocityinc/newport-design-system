import { allEntities } from 'serverData/GetEntities/allEntities.json';

export const mockEntities = JSON.parse(allEntities).slice(0,20);

export const mockEntitiesWithNoLabel = [
    {
        "apiName":"AcceptedEventRelation",
        "deletable":false,
        "queryable":true,
        "updateable":false,
        "createable":false,
    },
];

