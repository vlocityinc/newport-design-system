<aura:application extends="force:sldsDynamic" description="Lightning Flow Builder" access="accessCheck://Interaction.userCanEditDesigner" services="lightning:configProvider" template="builder_platform_interaction:flowBuilderTemplate">
    <!--Attributes -->
    <aura:attribute name="flowId" type="String" default="" description="The id of the flow to load" />

    <aura:attribute name="ready" type="Boolean" access="private" description="Flag used to render the editor." />

    <aura:handler name="init" value="{!this}" action="{!c.onInit}" />

    <!--Temp fix: Till we can leverage wire to get data-->
    <builder_platform_interaction:serverDataLibInit aura:id="serverDataLibInit"></builder_platform_interaction:serverDataLibInit>
    <builder_platform_interaction:contextLib aura:id="contextLib"></builder_platform_interaction:contextLib>
    <builder_platform_interaction:userPreferencesLib aura:id="userPreferencesLib"></builder_platform_interaction:userPreferencesLib>

    <aura:if isTrue="{!v.ready}">
        <builder_platform_interaction:container flowId="{!v.flowId}"></builder_platform_interaction:container>
    </aura:if>

    <!-- panel manager component with custom css -->
    <builder_platform_interaction:panelManagerWrapper></builder_platform_interaction:panelManagerWrapper>

    <!-- Metrics Service beacon  -->
    <instrumentation:beacon></instrumentation:beacon>
</aura:application>
