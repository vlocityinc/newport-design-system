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
    component: LightningElement,
    selectors: Record<P, string>
) {
    const handler = {
        get(target: LightningElement, prop: P) {
            if (prop === 'all') {
                return new Proxy(component, {
                    get(target: LightningElement, prop: P) {
                        return Array.from(target.template!.querySelectorAll(selectors[prop]));
                    }
                });
            } else if (prop === 'as') {
                return () => proxy;
            }

            return target.template!.querySelector(selectors[prop]) as T;
        }
    };

    const proxy = new Proxy(component, handler) as unknown as Record<P, T> & { all: Record<P, T[]> } & {
        as: <T>() => Record<P, T> & { all: Record<P, T[]> };
    };

    return proxy;
}
