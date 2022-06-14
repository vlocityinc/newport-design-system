declare module '@salesforce*';
declare module 'instrumentation/service';
declare module 'o11y/client';
declare module 'force/onboardingManagerLib';

type Labels<T> = Record<keyof T, string>;

/**
 * Add missing methods declarations to lwc
 */
declare module 'lwc' {
    export const unwrap: (value: any) => any;
    export const createElement: (tagName: string, config?: any) => any;
    export const readonly: any;
}
