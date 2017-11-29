<aura:application extends="force:slds" description="Flow Builder application" access="accessCheck://userCanEditFlowBuilder">
    <!--Attributes -->
    <aura:attribute name="flowId" type="String" description="The id of the flow to load" />

    <builder_platform_interaction:container flowId="{!v.flowId}"></builder_platform_interaction:container>
</aura:application>