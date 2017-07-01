({
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
    }
});
