import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap
} from "./base/baseElement";
import { baseCanvasElementMetadataObject } from "./base/baseMetadata";
import { createScreenField, createScreenFieldMetadataObject } from './screenField';
import { createConnectorObjects } from './connector';

const elementType = ELEMENT_TYPE.SCREEN;
const maxConnections = 1;

export function createScreen(screen = {}) {
    const newScreen = baseCanvasElement(screen);

    const {
        allowBack = true,
        allowFinish = true,
        allowPause = true,
        helpText = '',
        pausedText = '',
        showFooter = true,
        showHeader = true
    } = screen;

    let { fields = [] } = screen;
    fields = fields.map(field => createScreenField(field));

    const getFieldIndex = function (field) {
        if (this.fields) {
            return this.fields.findIndex(sfield => {
                return sfield.guid === field.guid;
            });
        }

        return -1;
    };

    const getFieldByGUID = function (guid) {
        if (this.fields) {
            return this.fields.find(field => {
                return field.guid === guid;
            });
        }

        return undefined;
    };

    const getFieldIndexByGUID = function (guid) {
        if (this.fields) {
            return this.fields.findIndex(field => {
                return field.guid === guid;
            });
        }

        return -1;
    };

    const screenObject = Object.assign(newScreen, {
        fields,
        allowBack,
        allowFinish,
        allowPause,
        helpText,
        pausedText,
        showFooter,
        showHeader,
        maxConnections,
        elementType,
        getFieldIndexByGUID,
        getFieldByGUID,
        getFieldIndex
    });

    return screenObject;
}

export function createScreenWithConnectors(screen) {
    const newScreen = createScreen(screen);
    const connectors = createConnectorObjects(screen, newScreen.guid);
    const connectorCount = connectors ? connectors.length : 0;

    const screenObject = Object.assign(newScreen, { connectorCount });

    return baseCanvasElementsArrayToMap([screenObject], connectors);
}

export function createScreenMetadataObject(screen, config) {
    if (!screen) {
        throw new Error('screen is not defined');
    }

    const newScreen = baseCanvasElementMetadataObject(screen, config);

    const {
        allowBack,
        allowFinish,
        allowPause,
        helpText,
        pausedText,
        showFooter,
        showHeader
    } = screen;

    let { fields = [] } = screen;
    fields = fields.map(field => createScreenFieldMetadataObject(field));

    return Object.assign(newScreen, {
        fields,
        allowBack,
        allowFinish,
        allowPause,
        helpText,
        pausedText,
        showFooter,
        showHeader
    });
}