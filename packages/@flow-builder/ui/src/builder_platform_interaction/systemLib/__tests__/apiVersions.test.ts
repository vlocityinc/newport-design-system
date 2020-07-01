import {
    cacheVersioningDataForAllProcessTypes,
    initVersioningInfoForProcessType,
    isVersioningDataInitialized,
    isVersioningSupported,
    setVersioningDataInitialized,
    getApiVersionsList,
    getDefaultApiVersion,
    getLatestApiVersion,
    getMinApiVersion
} from '../apiVersions';

// Tests for the apiVersion
describe('Api Version', () => {
    let versioningDataByPT;
    beforeEach(() => {
        versioningDataByPT = {
            AutoLaunchedFlow: {
                apiVersionsList: [49, 50, 51],
                defaultApiVersion: 49
            }
        };
        jest.resetModules();
    });
    describe('initVersioningInfoForProcessType', () => {
        it('Inits the versioningData for selected Process Type', () => {
            cacheVersioningDataForAllProcessTypes(versioningDataByPT);
            initVersioningInfoForProcessType('AutoLaunchedFlow');

            expect(getDefaultApiVersion()).toEqual(49.0);
            expect(getApiVersionsList()).toEqual([49.0, 50.0, 51.0]);
            expect(isVersioningSupported()).toBe(true);
        });
        it('gets the min Api Version', () => {
            expect(getMinApiVersion()).toEqual(49.0);
        });
        it('gets the latest Api Version', () => {
            expect(getLatestApiVersion()).toEqual(51.0);
        });
    });
    describe('setVersioningDataInitialized', () => {
        it('checks to see if versioning Data is Initialized', () => {
            setVersioningDataInitialized(true);
            expect(isVersioningDataInitialized()).toEqual(true);
        });
    });
    describe('isVersioningSupported', () => {
        it('checks to see if versioning is Supported for a empty Version List', () => {
            versioningDataByPT = {
                FieldServiceMobile: {
                    apiVersionsList: [],
                    defaultApiVersion: 49
                }
            };
            cacheVersioningDataForAllProcessTypes(versioningDataByPT);
            initVersioningInfoForProcessType('FieldServiceMobile');
            expect(isVersioningSupported()).toBe(false);
        });
        it('checks to see if versioning is Supported for a invalid default version', () => {
            versioningDataByPT = {
                FieldServiceMobile: {
                    apiVersionsList: [49, 50],
                    defaultApiVersion: 0
                }
            };
            cacheVersioningDataForAllProcessTypes(versioningDataByPT);
            initVersioningInfoForProcessType('FieldServiceMobile');
            expect(isVersioningSupported()).toBe(false);
        });
        it('checks to see if versioning is Supported for a undefined apiVersionList', () => {
            versioningDataByPT = {
                FieldServiceMobile: {
                    apiVersionsList: undefined,
                    defaultApiVersion: 49
                }
            };
            // Module is re-required to reset its state
            const apiVersionModules = require('../apiVersions');
            apiVersionModules.cacheVersioningDataForAllProcessTypes(versioningDataByPT);
            apiVersionModules.initVersioningInfoForProcessType('FieldServiceMobile');
            expect(apiVersionModules.isVersioningSupported()).toBe(false);
        });
        it('checks to see if versioning is Supported for a null defaultApiVersionList', () => {
            versioningDataByPT = {
                FieldServiceMobile: {
                    apiVersionsList: [49, 50],
                    defaultApiVersion: null
                }
            };
            // Module is re-required to reset its state
            const apiVersionModules = require('../apiVersions');
            apiVersionModules.cacheVersioningDataForAllProcessTypes(versioningDataByPT);
            apiVersionModules.initVersioningInfoForProcessType('FieldServiceMobile');
            expect(apiVersionModules.isVersioningSupported()).toBe(false);
        });
    });
});
