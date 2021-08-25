// alias LightningElement to 'any' here since we can't import 'lwc' is currently defined as a namespace,
// so it can't be referenced as a type
type LightningElement = any;

/**
 * Utility function that creates a proxy to query the DOM of a lightning component.
 * The proxy exposes the component's selector keys as type-safe properties
 * that can be used to access the component's DOM elements.
 *
 * @param component - A lightning component
 * @param selectors - The selectors for the component
 * @returns a type-safe proxy for the component's DOM
 */
export function createDomProxy<P extends string>(component: LightningElement, selectors: Record<P, string>) {
    const handler = {
        get(target: LightningElement, prop: P) {
            return target.template!.querySelector(selectors[prop]) as HTMLElement;
        }
    };

    return new Proxy(component, handler) as unknown as Record<P, HTMLElement>;
}
