(window.webpackJsonpAdministration=window.webpackJsonpAdministration||[]).push([[82360],{33322:function(){},82360:function(e,d,t){"use strict";t.r(d),t.d(d,{default:function(){return o}}),t(74844);let{Component:r,State:s}=Shopware,{Criteria:n}=Shopware.Data,{mapGetters:a,mapState:l,mapPropertyErrors:i}=r.getComponentHelper();var o={template:'\n{% block sw_order_detail_details %}\n<div class="sw-order-detail-details">\n\n    \n    {% block sw_order_detail_details_payment %}\n    <sw-order-details-state-card\n        v-if="transaction"\n        :title="$tc(\'sw-order.detailsTab.labelTransactionCard\')"\n        :order="order"\n        :entity="transaction"\n        :state-label="$tc(\'sw-order.stateCard.headlineTransactionState\')"\n        :disabled="!acl.can(\'order.editor\')"\n        @show-status-history="showStateHistoryModal = true"\n        @save-edits="onSaveEdits"\n    >\n\n        \n        {% block sw_order_detail_details_payment_billing_address %}\n        <sw-order-address-selection\n            class="sw-order-detail-details__billing-address"\n            type="billing"\n            :address="billingAddress"\n            :address-id="selectedBillingAddressId"\n            :disabled="!acl.can(\'order.editor\')"\n            :label="$tc(\'sw-order.createBase.detailsBody.labelBillingAddress\')"\n            @change-address="onChangeOrderAddress"\n        />\n        {% endblock %}\n\n        \n        {% block sw_order_detail_details_payment_method_select %}\n        <sw-entity-single-select\n            v-model:value="transaction.paymentMethodId"\n            entity="payment_method"\n            label-property="distinguishableName"\n            disabled\n            :criteria="paymentMethodCriteria"\n            :label="$tc(\'sw-order.createBase.detailsFooter.labelPaymentMethod\')"\n            :placeholder="$tc(\'sw-order.createBase.detailsFooter.placeholderPaymentMethod\')"\n            show-clearable-button\n        />\n        {% endblock %}\n\n    </sw-order-details-state-card>\n    {% endblock %}\n\n    \n    {% block sw_order_detail_details_shipping %}\n    <sw-order-details-state-card\n        v-if="delivery"\n        :title="$tc(\'sw-order.detailsTab.labelDeliveryCard\')"\n        :order="order"\n        :entity="delivery"\n        :state-label="$tc(\'sw-order.stateCard.headlineDeliveryState\')"\n        :disabled="!acl.can(\'order.editor\')"\n        @show-status-history="showStateHistoryModal = true"\n        @save-edits="onSaveEdits"\n    >\n\n        \n        {% block sw_order_detail_details_shipping_address %}\n        <sw-order-address-selection\n            class="sw-order-detail-details__shipping-address"\n            type="shipping"\n            :address="shippingAddress"\n            :address-id="selectedShippingAddressId"\n            :disabled="!acl.can(\'order.editor\')"\n            :label="$tc(\'sw-order.createBase.detailsBody.labelShippingAddress\')"\n            @change-address="onChangeOrderAddress"\n        />\n        {% endblock %}\n\n        \n        {% block sw_order_detail_details_shipping_method_select %}\n        <sw-entity-single-select\n            v-model:value="delivery.shippingMethodId"\n            entity="shipping_method"\n            disabled\n            :criteria="salesChannelCriteria"\n            :label="$tc(\'sw-order.createBase.detailsFooter.labelShippingMethod\')"\n            :placeholder="$tc(\'sw-order.createBase.detailsFooter.placeholderShippingMethod\')"\n            show-clearable-button\n        />\n        {% endblock %}\n\n        \n        {% block sw_order_detail_details_shipping_costs %}\n        <sw-number-field\n            v-model:value="shippingCosts"\n            class="sw-order-detail-details__shipping-cost"\n            :disabled="!acl.can(\'order.editor\')"\n            fill-digits\n            :label="$tc(\'sw-order.detailDeliveries.labelShippingCosts\')"\n        >\n            <template #suffix>\n                {{ order.currency.symbol }}\n            </template>\n        </sw-number-field>\n        {% endblock %}\n\n        \n        {% block sw_order_detail_details_shipping_date %}\n        <sw-datepicker\n            v-model:value="delivery.shippingDateEarliest"\n            disabled\n            :label="$tc(\'sw-order.detailDeliveries.labelDeliveryDate\')"\n        />\n        {% endblock %}\n\n        \n        {% block sw_order_detail_details_shipping_tracking_codes %}\n        <sw-multi-tag-select\n            v-model:value="delivery.trackingCodes"\n            class="sw-order-user-card__tracking-code-select"\n            :disabled="!acl.can(\'order.editor\')"\n            :placeholder="$tc(\'sw-order.detailBase.placeholderTrackingCodeSelect\')"\n            :label="$tc(\'sw-order.detailBase.labelTrackingCodes\')"\n            :validate="validateTrackingCode"\n            @update:value="saveAndReload"\n        >\n            <template #message-add-data>\n                <span>{{ $tc(\'sw-order.detailBase.addTrackingCode\') }}</span>\n            </template>\n            <template #message-enter-valid-data>\n                <span>{{ $tc(\'sw-order.detailBase.enterValidTrackingCode\') }}</span>\n            </template>\n        </sw-multi-tag-select>\n        {% endblock %}\n\n    </sw-order-details-state-card>\n    {% endblock %}\n\n    \n    {% block sw_order_detail_details_order %}\n    <sw-order-details-state-card\n        :title="$tc(\'sw-order.detailsTab.labelOrderCard\')"\n        :order="order"\n        :entity="order"\n        :disabled="!acl.can(\'order.editor\')"\n        :state-label="$tc(\'sw-order.stateCard.headlineOrderState\')"\n        @show-status-history="showStateHistoryModal = true"\n        @save-edits="onSaveEdits"\n    >\n\n        \n        {% block sw_order_detail_details_order_email %}\n        <sw-text-field\n            v-model:value="order.orderCustomer.email"\n            class="sw-order-detail-details__email"\n            :disabled="!acl.can(\'order.editor\')"\n            :label="$tc(\'sw-order.createBase.detailsBody.labelEmail\')"\n            :placeholder="$tc(\'sw-order.createBase.detailsBody.placeholderEmail\')"\n            :error="orderOrderCustomerEmailError"\n            required\n        />\n        {% endblock %}\n\n        \n        {% block sw_order_detail_details_order_phone_number %}\n        <sw-text-field\n            v-model:value="order.addresses.get(order.billingAddressId).phoneNumber"\n            class="sw-order-detail-details__phone-number"\n            :disabled="!acl.can(\'order.editor\')"\n            :label="$tc(\'sw-order.createBase.detailsBody.labelPhoneNumber\')"\n            :placeholder="$tc(\'sw-order.createBase.detailsBody.placeholderPhoneNumber\')"\n        />\n        {% endblock %}\n\n        \n        {% block sw_order_detail_details_order_sales_channel %}\n        <sw-entity-single-select\n            v-model:value="order.salesChannelId"\n            entity="sales_channel"\n            disabled\n            :label="$tc(\'sw-order.createBase.detailsFooter.labelSalesChannel\')"\n            :placeholder="$tc(\'sw-order.createBase.detailsFooter.placeholderSalesChannel\')"\n            show-clearable-button\n        />\n        {% endblock %}\n\n        \n        {% block sw_order_detail_details_order_language %}\n        <sw-entity-single-select\n            v-model:value="order.languageId"\n            entity="language"\n            disabled\n            :criteria="salesChannelCriteria"\n            :label="$tc(\'sw-order.createBase.detailsFooter.labelOrderLanguage\')"\n            :placeholder="$tc(\'sw-order.createBase.detailsFooter.placeholderOrderLanguage\')"\n            show-clearable-button\n        />\n        {% endblock %}\n\n        \n        {% block sw_order_detail_details_order_affiliate %}\n        <sw-text-field\n            v-model:value="order.affiliateCode"\n            class="sw-order-detail-details__affiliate-code"\n            :disabled="!acl.can(\'order.editor\')"\n            :label="$tc(\'sw-order.detailBase.labelAffiliateCode\')"\n        />\n        {% endblock %}\n\n        \n        {% block sw_order_detail_details_order_campaign %}\n        <sw-text-field\n            v-model:value="order.campaignCode"\n            class="sw-order-detail-details__campaign-code"\n            :disabled="!acl.can(\'order.editor\')"\n            :label="$tc(\'sw-order.detailBase.labelCampaignCode\')"\n        />\n        {% endblock %}\n\n        \n        {% block sw_order_detail_details_order_customer_comment %}\n        <sw-textarea-field\n            v-model:value="order.customerComment"\n            class="sw-order-detail-details__customer-comment"\n            :disabled="!acl.can(\'order.editor\')"\n            :label="$tc(\'sw-order.detailBase.labelCustomerComment\')"\n        />\n        {% endblock %}\n\n        \n        {% block sw_order_detail_details_order_promotion %}\n        <sw-order-promotion-field\n            class="sw-order-detail-details__promotion"\n            @loading-change="updateLoading"\n            @reload-entity-data="reloadEntityData"\n            @error="showError"\n        />\n        {% endblock %}\n\n    </sw-order-details-state-card>\n    {% endblock %}\n\n    \n    {% block sw_order_detail_details_custom_fields %}\n    <sw-extension-component-section\n        position-identifier="sw-order-detail-base-custom-fields__before"\n    />\n\n    <sw-card\n        v-if="customFieldSets.length > 0"\n        position-identifier="sw-order-detail-details-custom-fields"\n        :title="$tc(\'sw-settings-custom-field.general.mainMenuItemGeneral\')"\n    >\n        <sw-custom-field-set-renderer\n            :entity="order"\n            :disabled="!acl.can(\'order.editor\')"\n            :sets="customFieldSets"\n        />\n    </sw-card>\n\n    <sw-extension-component-section\n        position-identifier="sw-order-detail-base-custom-fields__after"\n    />\n    {% endblock %}\n    \n    {% block sw_order_detail_base_state_history_modal %}\n    <sw-order-state-history-modal\n        v-if="showStateHistoryModal"\n        :order="order"\n        :is-loading="isLoading"\n        @modal-close="showStateHistoryModal = false"\n    />\n    {% endblock %}\n</div>\n{% endblock %}\n',inject:["repositoryFactory","acl"],props:{orderId:{type:String,required:!0},isSaveSuccessful:{type:Boolean,required:!0}},data(){return{customFieldSets:[],showStateHistoryModal:!1}},computed:{...a("swOrderDetail",["isLoading"]),...l("swOrderDetail",["order","versionContext","orderAddressIds"]),...i("order",["orderCustomer.email"]),delivery(){return this.order.deliveries.length>0&&this.order.deliveries[0]},transaction(){for(let e=0;e<this.order.transactions.length;e+=1)if(!["cancelled","failed"].includes(this.order.transactions[e].stateMachineState.technicalName))return this.order.transactions[e];return this.order.transactions.last()},customFieldSetRepository(){return this.repositoryFactory.create("custom_field_set")},customFieldSetCriteria(){let e=new n(1,null);return e.addFilter(n.equals("relations.entityName","order")),e},salesChannelCriteria(){let e=new n(1,25);return this.order.salesChannelId&&e.addFilter(n.equals("salesChannels.id",this.order.salesChannelId)),e},paymentMethodCriteria(){return new n(1,25)},taxStatus(){return this.order.price.taxStatus},currency(){return this.order.currency},billingAddress(){return this.order.addresses.find(e=>e.id===this.order.billingAddressId)},shippingAddress(){return this.delivery.shippingOrderAddress},selectedBillingAddressId(){let e=this.orderAddressIds.find(e=>"billing"===e.type);return e?.customerAddressId||this.billingAddress.id},selectedShippingAddressId(){let e=this.orderAddressIds.find(e=>"shipping"===e.type);return e?.customerAddressId||this.shippingAddress.id},shippingCosts:{get(){return this.delivery?.shippingCosts.totalPrice||0},set(e){this.onShippingChargeEdited(e)}}},created(){this.createdComponent()},methods:{createdComponent(){this.$emit("update-loading",!0),this.customFieldSetRepository.search(this.customFieldSetCriteria).then(e=>{this.customFieldSets=e,this.$emit("update-loading",!1)})},onShippingChargeEdited(e){this.delivery.shippingCosts.unitPrice=e,this.delivery.shippingCosts.totalPrice=e,this.saveAndRecalculate()},saveAndRecalculate(){this.$emit("save-and-recalculate")},saveAndReload(){this.$emit("save-and-reload")},onSaveEdits(){this.$emit("save-edits")},reloadEntityData(){this.$emit("reload-entity-data")},showError(e){this.$emit("error",e)},updateLoading(e){s.commit("swOrderDetail/setLoading",["order",e])},validateTrackingCode(e){let d=e.trim();return!(d.length<=0)&&!this.delivery?.trackingCodes?.find(e=>e===d)},onChangeOrderAddress(e){s.commit("swOrderDetail/setOrderAddressIds",e)}}}},74844:function(e,d,t){var r=t(33322);r.__esModule&&(r=r.default),"string"==typeof r&&(r=[[e.id,r,""]]),r.locals&&(e.exports=r.locals),t(45346).Z("deb2d752",r,!0,{})}}]);