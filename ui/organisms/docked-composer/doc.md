# Docked Composer

Docked Composer is a persistent utility bar that allows a user to continually use the app to complete tasks or gather information while expanding/collapsing a composer window.

The docked composer relies heavily on utility classes to piece together the layout so please pay close attention to the markup and classes.

The overflow menu for docked composer, `.nds-docked-composer_overflow`, displays when the number of docked composers exceeds the width of the viewport. The overflow pill displays with a number indicator for all hidden docked composers. A user can invoke a popover with all available docked composers and replace the furthest left docked composer with the one being selected.

When a user clicks on the "pop out" icon in the `.nds-docked-composer__header`, a modal displays and contains the task that was currently in the docked composer.
