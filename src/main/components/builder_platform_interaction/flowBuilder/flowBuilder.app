<aura:application extends="force:slds" description="Flow Builder application" access="accessCheck://userCanEditFlowBuilder">
    <!--Attributes -->
    <aura:attribute name="flowId" type="String" description="The id of the flow to load" />

    <builder_platform_interaction:container flowId="{!v.flowId}"></builder_platform_interaction:container>

    <ui:panelManager2 aura:id="pm">
        <aura:set attribute="registeredPanels">
            <ui:modal alias="modal" aura:id="modal">
                <aura:set attribute="closeButton">
                    <ui:button aura:id="closeModal" aura:flavor="modal-closeBtn" variant="slds-button slds-button--icon-inverse slds-modal__close" label="{!$Label.Buttons.closeWindow}" labelDisplay="false" buttonTitle="{!$Label.Buttons.closeWindow}">
                        <force:icon class="closeIcon slds-button__icon slds-button__icon--large" key="close" />
                    </ui:button>
                </aura:set>
            </ui:modal>
        </aura:set>
    </ui:panelManager2>

    <!-- Importing jsplumb as an aura lib. This attaches jsplumb in window scope, but one should only use the instance created in drawing-lib from the canvas component -->
    <aura:import library="builder_platform_interaction:jsplumb" property="lib" />
</aura:application>