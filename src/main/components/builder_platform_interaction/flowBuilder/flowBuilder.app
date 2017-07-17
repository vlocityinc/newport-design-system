<aura:application extends="force:slds" description="Flow Builder" access="accessCheck://userCanEditFlowBuilder"
    tokens="builder_platform_interaction:builder_platform_interactionNamespace">

    <aura:attribute name="flowId" type="String" description="The id of the flow to load" />

    <div class="flowBuilder">
        <div class="editor slds-grid">
            <builder_platform_interaction:editor flowId="{#v.flowId}" />
        </div>
    </div>

</aura:application>