({
    onInit: function(cmp, event, helper) {
        helper.init(cmp);
    },

    handleAddNewResource: function(cmp, event, helper) {
        helper.handleAddNewResource(cmp);
    },
    
    handleClose: function(cmp, event, helper) {
        helper.closePanel(cmp);
    },
    
    setPropertyEditorTitle: function(cmp, event, helper) {
    	// panelInstance is set once the panel has been created. 
    	// It may not be set yet when we receive the setpropertyeditortitle event.
    	// Hence the panelInstance change handler.
    	cmp.set('v.title', event.detail.title);
    	helper.setHeaderTitle(cmp, event.detail.title);
    },
    
    panelInstanceChange: function(cmp, event, helper) {
    	var title = cmp.get('v.title');
    	if (!title) {
    		return;
    	}
    	helper.setHeaderTitle(cmp, title);
    }
})