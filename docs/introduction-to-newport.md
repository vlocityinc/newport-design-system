# Introduction to Newport

Every customer we work with at Vlocity has their own set of brand guidelines and design specs. Just because a customer bought into Vlocity and Salesforce, doesn't mean they should be forced into having an app and site that looks like "Vlocity and Salesforce".

Newport is our CSS framework that allows a customer to retheme all our Vlocity components in one place. It is targetted as a tool for designers and web developers to easily restyle all of vlocity components in a single place and generate a custom, optimized CSS file that can be used in all future pages. This includes non-Vlocity and non-Salesforce pages... this is just CSS.

![Preview tool](./docs/previewer.v1.png)

The examples you see in this tool show the HTML needed to produce them. Many of the these HTML templates are used throughout the Vlocity product today, and hence retheming them in the tool here will also retheme the same templates in the orgs once the generated css is uploaded.

![Set Sail with Newport Design System](./docs/set-sail-with-newport.png)

## Frequently Asked Questions

### How do I add javascript to Newport

Newport is purely CSS. This tool will build a CSS file that can be used in your org and pages to override the default look and feel that we ship. It does not have any JavaScript. The JavaScript features would need to be put into the templates and pages where you need those features.
