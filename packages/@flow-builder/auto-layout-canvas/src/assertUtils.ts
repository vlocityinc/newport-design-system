/**
 * Utils to do assertions in dev mode
 */

enum NodeEnv {
    DEVELOPMENT = 'development'
}

export function assertInDev(assertCallback: Function) {
    // eslint-disable-next-line dot-notation
    const processEnv = (window as any)['processEnv'];

    if (processEnv && processEnv.NODE_ENV === NodeEnv.DEVELOPMENT) {
        assertCallback();
    }
}
