# Progress Indicator

A progress indicator component communicates to the user the progress of a particular process.

The progress indicator communicates to the user which step of a process they
may be on. The length of the progress bar can be changed by modifying the
value on `<progress class="nds-progress-bar" />` with JavaScript. The
`.nds-progress-bar` accepts a range from 0% to 100%.

When a step becomes active, the `.nds-progress__item` should get the class
`.nds-is-active`. This class should be applied through JavaScript. When the
step is completed, the `.nds-is-active` class should be replaced with the
class `.nds-is-completed` on `.nds-progress__item`. At that point, the
`.nds-progress__item` element should receive a "success" icon, providing
feedback that the step has been completed.
