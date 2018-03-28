({
    init: function (cmp) {
        var override = cmp.get('v.override');
        if (override && override.body){
            $A.createComponent(override.body.descriptor, override.body.attr, function(newCmp, status, errorMessage){
                if (status === 'SUCCESS') {
                  cmp.set('v.body', newCmp); // setting the newly created assignment editor here in body
              } else if (status === 'ERROR') {
                  // TODO: handle it more elegantly using a generic user friendly error message popup instead of a stack trace.
                  throw new Error('Error creating the property editor: ' + errorMessage);
              }              
            }.bind(this));
        }
    },
    
    closePanel: function(cmp) {
        cmp.getEvent('notify').setParams({
            action: 'closePanel',
            typeOf: 'ui:closePanel'
        }).fire();
    }
})