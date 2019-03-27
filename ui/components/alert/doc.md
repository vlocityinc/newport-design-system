# Alert

Alert banners communicate a state that affects the entire system, not just a feature or page. It persists over a session and appears without the user initiating the action.

## Accessibility

Notifications should contain `role="alert"` on the container to signal to
assistive technology that they require the user’s immediate attention. Use a
span with `.nds-assistive-text` to let the user know what type of notification it is.
