(window.webpackJsonpAdministration=window.webpackJsonpAdministration||[]).push([[8007],{78964:function(){},8007:function(n,e,o){"use strict";o.r(e),o.d(e,{default:function(){return s}}),o(56274);let{Component:t,State:l}=Shopware,{EntityCollection:a}=Shopware.Data,{mapGetters:c}=t.getComponentHelper();var s={template:'\n{% block sw_flow_event_change_confirm_modal %}\n<sw-modal\n    class="sw-flow-event-change-confirm-modal"\n    variant="small"\n    @modal-close="onClose"\n>\n    <template #modal-header>\n        \n        {% block sw_flow_event_change_confirm_modal_header %}\n        <sw-icon\n            name="regular-exclamation-triangle"\n        />\n\n        <h4 class="sw-flow-event-change-confirm-modal__title">\n            {{ $tc(\'global.default.warning\') }}\n        </h4>\n        {% endblock %}\n    </template>\n    \n    {% block sw_flow_event_change_confirm_modal_text_confirmation %}\n    <p\n        class="sw-flow-event-change-confirm-modal__text-confirmation"\n        v-html="$tc(\'sw-flow.modals.confirmation.textConfirmChangeTrigger\')"\n    ></p>\n    {% endblock %}\n\n    <template #modal-footer>\n        \n        {% block sw_flow_event_change_confirm_footer_cancel_button %}\n        <sw-button\n            class="sw-flow-event-change-confirm-modal__cancel-button"\n            size="small"\n            @click="onClose"\n        >\n            {{ $tc(\'global.default.cancel\') }}\n        </sw-button>\n        {% endblock %}\n\n        \n        {% block sw_flow_event_change_confirm_footer_save_button %}\n        <sw-button\n            class="sw-flow-event-change-confirm-modal__confirm-button"\n            variant="primary"\n            size="small"\n            @click="onConfirm"\n        >\n            {{ $tc(\'global.default.confirm\') }}\n        </sw-button>\n        {% endblock %}\n    </template>\n</sw-modal>\n{% endblock %}\n',computed:{...c("swFlowState",["sequences"])},methods:{onConfirm(){let n=new a(this.sequences.source,this.sequences.entity,Shopware.Context.api,null,[]);l.commit("swFlowState/setSequences",n),this.$emit("modal-confirm"),this.onClose()},onClose(){this.$emit("modal-close")}}}},56274:function(n,e,o){var t=o(78964);t.__esModule&&(t=t.default),"string"==typeof t&&(t=[[n.id,t,""]]),t.locals&&(n.exports=t.locals),o(45346).Z("7bb235fd",t,!0,{})}}]);