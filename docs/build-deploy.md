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

## 3. (105+ release) Setting the default Newport for your org

From release 105 upwards we've simplified how Newport can be overridden in an entire org using a single Custom Setting. For pre-105 orgs please see alternative steps using custom VF pages below.

In a 105 org go to Settings in your org and query for Custom Settings. Look for "UISetting", click "Manage" and add a new entry with the following values:

- `Name` - `newportZipUrl`
- `Key` - `NULL`
- `Value` - You will need to go to the staticresource you uploaded in step 2. Right click on `view file` in your browser and from the context menu choose `Copy Link Address`:

![Preview tool](./docs/copy_link_address_of_static_resource.png)

Now paste this value into `Value` field and you will need to edit it to be in the format: `/resource/{sobjectid}/{ns_}ResourceName`.

So for example in my org my clipboard gave me: `https://vloc-ouidesigner-dev-ed--vloc-mg.na74.visual.force.com/resource/1559749458000/vloc_mg__MattNewportTest?` - I would change this to be: `/resource/1559749458000/vloc_mg__MattNewportTest` - essentially stripping the host name and any trailing characters like `?` or `#`.

Save this and load your omniscript with the Newport theme option. You should now see it with your custom version loaded. This will work the same for Cards using the URL parameter `vlocitytheme=newport` or in Vlocity Lightning components that set the `theme` to `Newport`.

### (105+ release) Other deployment options

With 105+ release you can change the value in `newportZipUrl` to point to any hosted version of newport. This means you can deploy Newport to a CDN you might have and provide the address to it hosted there in the `value` field. The important thing to maintain is the directory structure of the zip `newport-design-system.zip` file. The Vlocity package will simply try to append the known directories to the value in `newportZipUrl`. So if you provide a CDN url like: `https://www.acme.com/cdn/newport`, then Vlocity will try to load the stylesheets from `https://www.acme.com/cdn/newport/assets/styles/vlocity-newport-design-system.min.css`.

To re-iterate **do not change the folder structure and file names in the generated zip file**.

## Pre 105 release

In older releases there are several manual steps that need to be followed in order to switch to your custom version of Newport:

### Adding to a custom OmniScript Page

Now go to _Setup_ and search _Visualforce Pages_ and click _New_.

- `Label` - choose an appropriate name, for example `OmniScriptNDS`
- `Name` - Make a note of this you will need it for Step 4. I recommend leaving it as the default Salesforce generates for you.
- `Description` - Optional
- `Available for Lightning Experience, Lightning Communities, and the mobile app` - Check this
- `Require CSRF protection on GET requests` - Optional

For the contents enter:

```
<apex:page standardStylesheets="false"
           showHeader="false"
           sidebar="false"
           docType="html-5.0"
           lightningStylesheets="true"
           controller="vlocity_ins.VFPageControllerBase"
           applyHtmlTag="false"
           applyBodyTag="false"
           language="{!$CurrentPage.parameters.LanguageCode}">
    <html xmlns:xlink="http://www.w3.org/1999/xlink">
        <head>
            <meta name="viewport"
                  content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0" />
            <link rel="stylesheet" href="{!URLFOR($Resource.newportdesignsystem, '/assets/styles/vlocity-newport-design-system.css')}" />
        </head>

        <body >
            <div ng-app="OmniScriptUniversal" class="vlocity via-nds">
                <vlc-slds-lightning-banner title="OmniScriptTitle"></vlc-slds-lightning-banner>
                <vlocity_ins:BusinessProcessComponent strOmniScriptId="{!$CurrentPage.parameters.designerPreviewId}"
                                                     previewMode="{!$CurrentPage.parameters.previewEmbedded}"
                                                     scriptLayout="newport"
                                                     strCSSFileList="[]" />
                <script type="text/javascript">
                    var modules = ['vlocity-business-process'];
                    var myModule = angular.module('OmniScriptUniversal', modules);
                </script>
            </div>
            <vlocity_ins:VFActionFunction />
        </body>
   </html>
</apex:page>
```

NOTE: If you're using our CMT package then change `vlocity_ins` to be `vlocity_cmt`. If you're using our PS package then change `vlocity_ins` to be `vlocity_ps`.

Hit _Save_.

Now head over to the _Vlocity Omniscript Designer_ and open your OmniScript. In the _Script Configuration_ find the _Visualforce Pages Available In Preview_ property and click _Add New Visualforce Page For Preview_. In the first column enter the `Name` of your Visualforce page from step 3. In the second column enter `c__{NAME OF YOUR VF PAGE}`. The `c__` is important for the designer to be able to load the Visualforce page.

With the changes done, click the _Preview_ tab and on the top right change the drop down to be your Visualforce page name. You should now be looking at your OmniScript rendered with the newport css you generated!
