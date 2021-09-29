/**
 * Checks if we are running on a Mac
 *
 * @returns true if we are on a Mac, false otherwise
 */
export function isMacPlatform() {
    return navigator.userAgent.indexOf('Macintosh') !== -1;
}
