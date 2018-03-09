<aura:application extends="force:slds" description="Flow Builder application" access="accessCheck://Interaction.userCanEditFlowBuilder">
    <!--Attributes -->
    <aura:attribute name="flowId" type="String" description="The id of the flow to load" />

    <builder_platform_interaction:container flowId="{!v.flowId}"></builder_platform_interaction:container>

    <!-- panel manager component with custom css -->
    <builder_platform_interaction:panelManagerWrapper></builder_platform_interaction:panelManagerWrapper>
    
</aura:application>
