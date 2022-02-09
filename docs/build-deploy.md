# How to build and deploy Newport to your org

Once you have Newport installed the next step is build a copy of it to deploy to your own org. The first step is to compile and generate the folder of css files and assets:

## 1. Compile css and generate assets

```
npm run build
npm run dist
```

These commands will generated the css and also turn it into a zip file in `dist/newport-design-system.zip` ready to upload into your org.

## 2. Upload zip into static resources

Now log into your org, go to _Setup_ and search for _Static Resources_. Open the Static Resources page and choose _New_. For the values in the form:

- `Name` - choose an appropriate name, for example `newportdesignsystem` (name can only contain alphanumeric characters, must begin with a letter, and must be unique.)
- `Description` - optional
- `File` - Choose the generated `newport-design-system.zip` file from the steps above
- `Cache Control` - Choose `Public`

Hit _Save_ and it will create your static resource.
## 3.Setting the default Newport for your org
### 3.1 By Static Resource name

New from 236 - you can now set just the static resource name in Custom Settings.

Go to Settings in your org and query for Custom Settings. Look for "UISetting", click "Manage" and add a new entry with the following values:
- `Name` - `newportStaticResource`
- `Key` - `NULL`
- `Value` - The name of your staticresource.

***NOTE:*** If you're in an OmniStudio package instead of doing this in "UISetting" instead you'll need to do it in "Omni Interaction Config" in the "Settings" of your org.

### 3.2 By Static Resource URL

Go to Settings in your org and query for Custom Settings. Look for "UISetting", click "Manage" and add a new entry with the following values:

- `Name` - `newportZipUrl`
- `Key` - `NULL`
- `Value` - You will need to go to the staticresource you uploaded in step 2. Right click on `view file` in your browser and from the context menu choose `Copy Link Address`:

***NOTE:*** If you're in an OmniStudio package instead of doing this in "UISetting" instead you'll need to do it in "Omni Interaction Config" in the "Settings" of your org.

![Preview tool](./docs/copy_link_address_of_static_resource.png)

Now paste this value into `Value` field and you will need to edit it to be in the format: `/resource/{sobjectid}/{ns_}ResourceName`.

So for example in my org my clipboard gave me: `https://vloc-ouidesigner-dev-ed--vloc-mg.na74.visual.force.com/resource/1559749458000/vloc_mg__MattNewportTest?` - I would change this to be: `/resource/1559749458000/vloc_mg__MattNewportTest` - essentially stripping the host name and any trailing characters like `?` or `#`.

Save this and load your omniscript with the Newport theme option. You should now see it with your custom version loaded. This will work the same for Cards using the URL parameter `vlocitytheme=newport` or in Vlocity Lightning components that set the `theme` to `Newport`.

### 3.3 Other deployment options

You can change the value in `newportZipUrl` to point to any hosted version of newport. This means you can deploy Newport to a CDN you might have and provide the address to it hosted there in the `value` field. The important thing to maintain is the directory structure of the zip `newport-design-system.zip` file. The Vlocity package will simply try to append the known directories to the value in `newportZipUrl`. So if you provide a CDN url like: `https://www.acme.com/cdn/newport`, then Vlocity will try to load the stylesheets from `https://www.acme.com/cdn/newport/assets/styles/vlocity-newport-design-system.min.css`.

To re-iterate **do not change the folder structure and file names in the generated zip file**.

### 3.4 Enforce use of scoped styles

If you want to always use Newport's scoped styles then you can set:

- `Name` - `newportUseScopedStyles`
- `Key` - `NULL`
- `Value` - `true`

This will ensure that the scoped css file is loaded. All rules in the scoped css file are prefixed with `.via-nds` class selector which means you also need that class in your DOM tree in a parent element to have the styles enforce. This is useful to ensure your newport styles to don't leak out and affect other parts of the page you're not expecting them to.
