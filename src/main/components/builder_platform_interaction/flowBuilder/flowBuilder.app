<aura:application extends="force:slds" description="Flow Builder application" access="accessCheck://userCanEditFlowBuilder">
    <!--Attributes -->
    <aura:attribute name="flowId" type="String" description="The id of the flow to load" />

    <builder_platform_interaction:container flowId="{!v.flowId}"></builder_platform_interaction:container>

    <!-- panel manager component with custom css -->
    <builder_platform_interaction:panelManagerWrapper></builder_platform_interaction:panelManagerWrapper>
    
    <!-- Importing jsplumb as an aura lib. This attaches jsplumb in window scope, but one should only use the instance created in drawing-lib from the canvas component -->
    <aura:import library="builder_platform_interaction:jsplumb" property="lib" />
</aura:application>