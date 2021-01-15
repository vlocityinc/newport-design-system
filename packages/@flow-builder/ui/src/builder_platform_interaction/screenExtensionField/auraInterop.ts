// eslint-disable-next-line lwc-core/no-interop-create, lwc-core/no-interop-render
// @ts-nocheck
import { createComponent, renderComponent } from 'aura';
import { DummyPreviewModeEvent } from 'builder_platform_interaction/events';

/**
 * This code is based on the runtime version of auraInterop.js
 * with some changes based on differences needed for design time
 * vs runtime. As of January 2021 we are considering a possible shared
 * module that could hold utililties and common code between runtime and
 * design, but no such module exists now. We should definitely consider
 * refactoring this code to a shared module, if possible.
 *
 * In the meantime, any changes made to the runtime auraInterop.js should
 * be considered for this version and vise versa.
 */

let renderingRafId = null;
let renderingQueue = [];

// Instead of interleaving:
// create A, render A, create B, render B

// Pipeline to emulate how Aura renders:
// create A, create B, ... raf ..., render A, render B

function requestRender(cmp, parentElement) {
    renderingQueue.push([cmp, parentElement]);
    if (renderingRafId === null) {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        renderingRafId = requestAnimationFrame(flushRenderingQueue);
    }
}

function flushRenderingQueue() {
    // Snapshot the queue in this stack frame in case renderComponent causes a nested invocation to
    // the AuraComponent constructor below
    const queue = renderingQueue;
    renderingQueue = [];
    renderingRafId = null;
    queue.forEach(([cmp, parentElement]) => {
        if (cmp && cmp.isValid()) {
            renderComponent(cmp, parentElement);
        }
    });
}

export class AuraComponent {
    component;
    constructor(container, descriptor, attributes, createComponentCallback) {
        try {
            createComponent(descriptor, attributes, (cmp, status) => {
                this.component = cmp;
                if (status === 'SUCCESS') {
                    requestRender(cmp, container);
                    if (createComponentCallback) {
                        createComponentCallback(cmp);
                    }
                } else {
                    // If the component was not succesfully rendered, go into dummy mode.
                    container.dispatchEvent(new DummyPreviewModeEvent(true));
                }
            });
        } catch (error) {
            // If we get an error trying to render the component, signal that we need to
            // use a dummy preview instead.
            container.dispatchEvent(new DummyPreviewModeEvent(true));
        }
    }

    unrenderComponent() {
        if (this.component) {
            // eslint-disable-next-line lwc-core/no-aura
            window.$A.unrender(this.component);
            this.component.destroy();
        }
    }
}
