({
    browsers: ["S1_DESKTOP"],
    
    testRulesAreInitialized: {
        attributes: {
            flowId: "301xx00000000AB"
        },
        mocks : [{
            type : "ACTION",
            descriptor : "serviceComponent://ui.interaction.builder.components.controllers.FlowBuilderController",
            stubs : [{
                method : { name : "retrieveAllRules" },
                answers : [{
                    value : "[{\"ruleType\":\"comparison\",\"left\":{\"paramType\":\"Data\",\"paramIndex\":1,\"dataType\":{\"value\":\"String\"},\"canBeField\":\"CanBe\",\"canBeSystemVar\":\"CanBe\",\"elementType\":null,\"collection\":false},\"operator\":\"EQUAL\",\"rhsParams\":[{\"paramType\":\"Data\",\"paramIndex\":1,\"dataType\":{\"value\":\"String\"},\"canBeField\":\"CanBe\",\"canBeSystemVar\":\"CanBe\",\"elementType\":null,\"collection\":false},{\"paramType\":\"Data\",\"paramIndex\":1,\"dataType\":{\"value\":\"Date\"},\"canBeField\":\"CanBe\",\"canBeSystemVar\":\"CanBe\",\"elementType\":null,\"collection\":false},{\"paramType\":\"Data\",\"paramIndex\":1,\"dataType\":{\"value\":\"DateTime\"},\"canBeField\":\"CanBe\",\"canBeSystemVar\":\"CanBe\",\"elementType\":null,\"collection\":false},{\"paramType\":\"Data\",\"paramIndex\":1,\"dataType\":{\"value\":\"Number\"},\"canBeField\":\"CanBe\",\"canBeSystemVar\":\"CanBe\",\"elementType\":null,\"collection\":false},{\"paramType\":\"Data\",\"paramIndex\":1,\"dataType\":{\"value\":\"Currency\"},\"canBeField\":\"CanBe\",\"canBeSystemVar\":\"CanBe\",\"elementType\":null,\"collection\":false},{\"paramType\":\"Data\",\"paramIndex\":1,\"dataType\":{\"value\":\"Boolean\"},\"canBeField\":\"CanBe\",\"canBeSystemVar\":\"CanBe\",\"elementType\":null,\"collection\":false},{\"paramType\":\"Data\",\"paramIndex\":1,\"dataType\":{\"value\":\"Picklist\"},\"canBeField\":\"CanBe\",\"canBeSystemVar\":\"CanBe\",\"elementType\":null,\"collection\":false},{\"paramType\":\"Data\",\"paramIndex\":1,\"dataType\":{\"value\":\"Multipicklist\"},\"canBeField\":\"CanBe\",\"canBeSystemVar\":\"CanBe\",\"elementType\":null,\"collection\":false},{\"paramType\":\"Element\",\"paramIndex\":1,\"dataType\":null,\"canBeField\":\"CanBe\",\"canBeSystemVar\":\"CanBe\",\"elementType\":\"STAGE\",\"collection\":false}],\"includeElems\":null,\"excludeElems\":null}]"
                }]
            }]
        }],
        test: [function (cmp) {
            // This is to make sure that the rules are loaded (callback executed) before testing anything.
            $A.test.addWaitForWithFailureMessage(true, function () {
                return Object.keys(cmp.getDef().getHelper().ruleLib.getRules()).length > 0;
            }, "Rules are not loaded.");
        },
            function(cmp) {
                const storedRules = cmp.getDef().getHelper().ruleLib.getRules();
                $A.test.assert(Object.keys(storedRules).length === 2, "The rules variable should have 2 properties.");
                $A.test.assert(storedRules.comparison.length === 1, "There rules variable should have 1 comparison rule.");
                $A.test.assert(storedRules.assignment.length === 0, "There rules variable should have no assignment rule.");
            }
        ]}
})
