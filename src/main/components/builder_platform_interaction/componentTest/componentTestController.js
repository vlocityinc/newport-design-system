({
    onInit: function(cmp, event, helper) {
        var builderTestLib = helper.builderTestLib;

        builderTestLib.raptorLibs.updateLibs(cmp);
        builderTestLib.nodeUtils.initializeStore();

        var reducers = cmp.find('reducers');
        var storeLib = cmp.find('storeLib');

        var elementType = cmp.get('v.elementType');

        var elementConfig = cmp.find('elementConfig');
        var config = elementConfig.getConfigForElementType( elementType );

        var node = builderTestLib.nodeUtils.getNewNodeForPropertyEditor(elementType);

        // Configuration passed to the propertyEditor
        cmp.set('v.node', node);
        cmp.set('v.override', {
            desc: config.descriptor,
            attr: {
                node: node
            }
        });

        // Sobject entities might be required in the future
        // var sobjectLib = cmp.find('sobjectLib');
        // sobjectLib.setEntities([]);

        // Fetch rules to allow Expression Builder to work properly
        var ruleLib = cmp.find('ruleLib');
        var action = cmp.get('c.retrieveAllRules');
        action.setCallback(this, $A.getCallback(function (result) {
            if (result.getState() === 'SUCCESS') {
                var rules = result.getReturnValue();
                ruleLib.setRules(rules);
                cmp.set('v.initialized', true);
            } else {
                throw 'Failed to fetch rules';
            }
        }));
        $A.enqueueAction(action);
    }
})
