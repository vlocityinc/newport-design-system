({
    onInit: function(cmp) {
        var assignmentEditorCallback = function() { 
                return true;
            };
        cmp.set('v.preNodeUpdateCallback', assignmentEditorCallback);
    }
})