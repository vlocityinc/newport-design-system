({
    updateBreadcrumb : function(cmp, label, id, enablePageLink,
            showInvalidWarning) {
        var breadcrumb = cmp.find('breadcrumb');
        breadcrumb.set('v.selectedComponentLabel', label);
        breadcrumb.set('v.selectedComponentId', id);
        breadcrumb.set('v.enablePageLink', enablePageLink);
        breadcrumb.set('v.showInvalidWarning', showInvalidWarning);
    },

    triggerPropertyEditorValidation : function(cmp, validateUnchanged) {
        var panelBody = cmp.get("v.body");
        if (panelBody
                && panelBody.length > 0
                && panelBody[0].isValid()
                && panelBody[0]
                        .isInstanceOf("visualEditor:componentPropertiesEditor")) {
            panelBody[0].validateProperties(validateUnchanged);
            return true;
        }
        return false;
    },

    doPendingSave : function(cmp) {
        if (cmp.get("v._pendingSave")) {
            $A.getEvt("markup://flexipageEditor:save").fire();

            cmp.set("v._pendingSave", false);
        }
    }
});
