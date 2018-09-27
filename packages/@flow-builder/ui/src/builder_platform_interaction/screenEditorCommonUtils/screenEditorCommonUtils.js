// CONSIDER REMOVING THIS FILE AND MOVE THE FUNCTIONS TO SCREEN EDITOR UTILS ONCE
// THE MUTATION LAYER IS GONE (THERE IS A CYCLIC DEP BETWEEN SCREEN EDITOR UTILS AND SCREEN MUTATION)
import { PropertyChangedEvent } from "builder_platform_interaction/events";
import { hydrateIfNecessary } from "builder_platform_interaction/dataMutationLib";

export function addCurrentValueToEvent(event, field, currentValue) {
    return new PropertyChangedEvent(
        event.detail.propertyName,
        hydrateIfNecessary(event.detail.value),
        event.detail.error,
        field.guid,
        hydrateIfNecessary(currentValue)
    );
}