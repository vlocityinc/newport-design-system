# How to build and deploy Newport to your org

Once you have Newport installed the next step is build a copy of it to deploy to your own org. The first step is to compile and generate the folder of css files and assets:

## 1. Compile css and generate assets

```
npm run build
npm run dist
```

These commands will generated the css and also turn it into a zip file in `dist/newport-design-system.zip` ready to upload into your org.

## 2. Upload zip into static resources

Now log into your org, go to *Setup*  and search for *Static Resources*. Open the Static Resources page and choose *New*. For the values in the form:

* `Name` - choose an appropriate name, for example `newportdesignsystem` (name can only contain alphanumeric characters, must begin with a letter, and must be unique.)
* `Description` - optional
* `File` - Choose the generated `newport-design-system.zip` file from the steps above
* `Cache Control` - Choose `Public`

Hit *Save* and it will create your static resource.

## 3. Adding to a custom OmniScript Page

Now go to *Setup* and search *Visualforce Pages* and click *New*.

* `Label` - choose an appropriate name, for example `OmniScriptNDS`
* `Name` - Make a note of this you will need it for Step 4. I recommend leaving it as the default Salesforce generates for you.
* `Description` - Optional
* `Available for Lightning Experience, Lightning Communities, and the mobile app` - Check this
* `Require CSRF protection on GET requests` - Optional

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

Hit *Save*.

## 4. Adding your page to OmniScript Designer

Now head over to the *Vlocity Omniscript Designer* and open your OmniScript. In the *Script Configuration* find the *Visualforce Pages Available In Preview* property and click *Add New Visualforce Page For Preview*. In the first column enter the `Name` of your Visualforce page from step 3. In the second column enter `c__{NAME OF YOUR VF PAGE}`. The `c__` is important for the designer to be able to load the Visualforce page.

With the changes done, click the *Preview* tab and on the top right change the drop down to be your Visualforce page name. You should now be looking at your OmniScript rendered with the newport css you generated!
