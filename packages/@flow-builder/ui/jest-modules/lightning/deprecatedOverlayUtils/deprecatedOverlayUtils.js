/*
 * Copyright 2018 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */
export const showCustomOverlayTestPanel = {
    close() {}
};

export function showCustomOverlay() {
    return Promise.resolve(showCustomOverlayTestPanel);
}
