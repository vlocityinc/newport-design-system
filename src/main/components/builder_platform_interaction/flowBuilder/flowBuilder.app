<aura:application extends="force:slds" description="Flow Builder" access="accessCheck://userCanEditFlowBuilder"
    tokens="builder_platform_interaction:builder_platform_interactionNamespace">

    <aura:attribute name="flowId" type="String" description="The id of the flow to load" />

    <div class="flowBuilder">
        <div class="editor slds-grid">
            <builder_platform_interaction:editor flowId="{#v.flowId}" />
        </div>
    </div>

    <div class="panelContainer">
        <ui:panelManager2>
            <aura:set attribute="registeredPanels">
                <force:modal alias="actionModal"/>
                <ui:panel alias="panel"/>
                <ui:modal alias="modal">
                    <aura:set attribute="closeButton">
                        <ui:button aura:id="modal-close" class="closeButton" aura:flavor="modal-closeBtn" variant="slds-button slds-button--icon-inverse slds-modal__close" label="{!$Label.Buttons.closeWindow}" labelDisplay="false" buttonTitle="{!$Label.Buttons.closeWindow}">
                            <force:icon class="closeIcon slds-button__icon slds-button__icon--large" key="close" />
                        </ui:button>
                    </aura:set>
                </ui:modal>
            </aura:set>
        </ui:panelManager2>
    </div>

    <ui:containerManager />
</aura:application>