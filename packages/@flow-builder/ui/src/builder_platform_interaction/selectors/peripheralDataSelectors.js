import { createSelector } from 'builder_platform_interaction/storeLib';

const peripheralDataSelector = state => state.peripheralData;

export const apexClassesSelector = createSelector(
    [peripheralDataSelector],
    peripheralData => peripheralData.apexClasses
);
