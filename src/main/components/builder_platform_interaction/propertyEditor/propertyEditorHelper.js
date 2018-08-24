({
    init: function (cmp) {
        var bodyComponent = cmp.get('v.bodyComponent');
        if (bodyComponent){
            $A.createComponent(bodyComponent.desc, bodyComponent.attr, function(newCmp, status, errorMessage){
                if (status === 'SUCCESS') {
                    var body = cmp.find('body-content');
                    body && body.set('v.body', newCmp); // setting the newly created assignment editor here in body
                } else if (status === 'ERROR') {
                    // TODO: handle it more elegantly using a generic user friendly error message popup instead of a stack trace.
                    throw new Error('Error creating the property editor: ' + errorMessage);
                }              
            });
        }
    },

    handleAddNewResource: function(cmp) {
        var newResourceCallback = cmp.get('v.newResourceCallback');
        if (newResourceCallback && typeof newResourceCallback === 'function') {
            newResourceCallback();
        }
    }
})