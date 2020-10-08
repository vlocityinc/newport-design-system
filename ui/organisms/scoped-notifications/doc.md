# Scoped Notifications

Scoped notifications serve advisory information for the user that is not important enough to justify an alert. It is often presented as a status bar scoped to the container. They are not dismissable.

## Accessibility

Scoped notifications contain `role="status"` on the container to signal to the browser to send an accessible status event to assistive technology. The assistive technology then notifies the user.
