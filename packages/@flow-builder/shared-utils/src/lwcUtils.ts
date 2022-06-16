import { LightningElement } from 'lwc';

export type ShadowRootTheGoodPart = typeof LightningElement.prototype.template;

/**
 * Utility function that creates a proxy to query the DOM of a lightning component.
 * The proxy exposes the component's selector keys as type-safe properties
 * that can be used to access the component's DOM elements.
 *
 * Example Usage:
 *
 *  const selectors = {
 *     button1: '.my-button',
 *     buttons: 'button'
 *  };
 *
 *  class MyComponent extends LightningElement {
 *     this.dom = lwcUtils.createDomProxy(this, selectors);
 *
 *     getButton1() {
 *          // typesafe equivalent of this.template.querySelector(selectors.button1)
 *          // button1 is typed as HTMLElement
 *          let button1 = this.dom.button1;
 *
 *          // typesafe equivalent of this.template.querySelector(selectors.button1)
 *          // button1 is now typed as HTMLButton
 *          let button1 = this.dom.as<HTMLButton>().button1;
 *
 *          // dynamic lookup
 *          const selector = done ? 'doneButton' : 'cancelButton';
 *          let button = this.dom[selector];
 *      }
 *
 *     getAllButtons() {
 *          // typesafe equivalent of this.template.querySelectorAll(selectors.buttons)
 *          // buttons is typed as HTMLElement[]
 *          let buttons = this.dom.all.buttons;
 *
 *          // typesafe equivalent of this.template.querySelectorAll(selectors.buttons)
 *          // buttons is typed as HTMLButton[]
 *          let buttons = this.dom.as<HTMLButton[]>().all.buttons;
 *
 *          // dynamic lookup
 *          const selector = done ? 'doneButton' : 'cancelButton';
 *          let button = this.dom.as<HTMLButton[]>().all[selector];
 *      }
 *
 *
 *  }
 *
 * @param component - A lightning component
 * @param selectors - The selectors for the component
 * @returns a type-safe proxy for the component's DOM
 */
export function createDomProxy<P extends string, T extends HTMLElement = HTMLElement>(
    component: LightningElement | { template: ShadowRootTheGoodPart },
    selectors?: Record<P, string | Function>
) {
    /**
     * Resolves the selector for a property
     *
     * @param prop - The property
     * @returns The selector
     */
    function resolveSelector(prop: P) {
        let selector;

        if (selectors != null) {
            selector = selectors[prop];
        }

        // the selector can be null if we are using a dynamic property lookup
        // eg:  this.dom[canvasSelector] for example. In that case prop acts as the selector.
        return selector || prop;
    }

    const handler = {
        get(target: LightningElement, prop: P) {
            if (prop === 'all') {
                return new Proxy(component, {
                    get(target: LightningElement, prop: P) {
                        const selector = resolveSelector(prop);
                        return Array.from(getQueryable(target).querySelectorAll(selector));
                    }
                });
            } else if (prop === 'as') {
                return () => proxy;
            }

            const selector = resolveSelector(prop);
            return getQueryable(target).querySelector(selector) as T;
        }
    };

    const proxy = new Proxy(component, handler) as unknown as Record<P, T> & { all: Record<P, T[]> } & {
        as: <T>() => Record<P, T> & { all: Record<P, T[]> };
    };

    return proxy;
}

/**
 * @param target
 */
function getQueryable(target: LightningElement) {
    return target.template || target.shadowRoot;
}
