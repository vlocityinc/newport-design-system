# Stateful Button

The stateful button requires the `.nds-button_neutral` class in addition to the `.nds-button` class.

The stateful inverse button works just like the stateful button. It requires the `.nds-button--inverse` class in addition to the `.nds-button` class.

It uses the class `.nds-not-selected` in its initial state. When the user activates the button, use JavaScript to toggle the class to `.nds-is-selected`. The button contains three spans with classes that hide or show the content of the spans based on the class on the button. Each span contains text and a corresponding icon. The SVG will have the `.nds-button__icon--stateful` class as well as the `.nds-button__icon--left` class setting the icon on the left.

Stateful icons can be toggled on and off and retain their state. Like stateful buttons, the initial state is `.nds-not-selected`, and JavaScript is used to toggle it to `.nds-is-selected` when activated.

## Accessibility

For accessibility, include the attribute `aria-live="assertive"` on the button. The `aria-live="assertive"` attribute means the value of the `<span>` inside the button will be spoken whenever it changes.
