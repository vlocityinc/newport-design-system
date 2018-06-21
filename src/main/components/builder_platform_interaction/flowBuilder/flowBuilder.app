<aura:application extends="force:slds" description="Lightning Flow Builder" access="accessCheck://Interaction.userCanEditFlowBuilder" services="lightning:configProvider" template="builder_platform_interaction:flowBuilderTemplate">
    <!--Attributes -->
    <aura:attribute name="flowId" type="String" description="The id of the flow to load" />

    <!--Temp fix: Till we can leverage wire to get data-->
    <builder_platform_interaction:serverDataLibInit></builder_platform_interaction:serverDataLibInit>

    <builder_platform_interaction:container flowId="{!v.flowId}"></builder_platform_interaction:container>


    <!-- panel manager component with custom css -->
    <builder_platform_interaction:panelManagerWrapper></builder_platform_interaction:panelManagerWrapper>
    
</aura:application>
