(window.webpackJsonpAdministration=window.webpackJsonpAdministration||[]).push([[84874],{57461:function(){},84874:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return m}}),t(73375);let{Component:i,Mixin:s}=Shopware,{get:a,cloneDeep:o}=Shopware.Utils.object,{Criteria:l,EntityCollection:d}=Shopware.Data,{mapPropertyErrors:c}=i.getComponentHelper();var m={template:'\n{% block sw_settings_document_detail %}\n<sw-page class="sw-settings-document-detail">\n\n    \n    {% block sw_settings_document_detail_header %}\n    <template #smart-bar-header>\n        <h2 v-if="documentConfig.name">\n            {{ documentConfig.name }}\n        </h2>\n        <h2 v-else>\n            {{ $tc(\'sw-settings-document.detail.textHeadline\') }}\n        </h2>\n    </template>\n    {% endblock %}\n\n    \n    {% block sw_settings_document_detail_actions %}\n    <template #smart-bar-actions>\n        \n        {% block sw_settings_document_detail_actions_abort %}\n        <sw-button\n            v-tooltip.bottom="tooltipCancel"\n            :disabled="isLoading"\n            @click="onCancel"\n        >\n            {{ $tc(\'sw-settings-document.detail.buttonCancel\') }}\n        </sw-button>\n        {% endblock %}\n\n        \n        {% block sw_settings_document_detail_actions_save %}\n        <sw-button-process\n            v-model:processSuccess="isSaveSuccessful"\n            v-tooltip.bottom="tooltipSave"\n            class="sw-settings-document-detail__save-action"\n            :disabled="isLoading || !acl.can(\'document.editor\')"\n            variant="primary"\n            @update:process-success="saveFinish"\n            @click.prevent="onSave"\n        >\n            {{ $tc(\'sw-settings-document.detail.buttonSave\') }}\n        </sw-button-process>\n        {% endblock %}\n    </template>\n    {% endblock %}\n\n    <template #language-switch>\n        <sw-language-switch\n            :save-changes-function="saveOnLanguageChange"\n            :abort-change-function="abortOnLanguageChange"\n            @on-change="onChangeLanguage"\n        />\n    </template>\n\n    \n    {% block sw_settings_document_detail_content %}\n    <template #content>\n        <sw-card-view>\n            <template v-if="isLoading">\n                <sw-skeleton />\n                <sw-skeleton />\n            </template>\n\n            <template v-else>\n                \n                {% block sw_settings_document_detail_assignment_card %}\n                <sw-card\n                    position-identifier="sw-settings-document-detail-assignment"\n                    :title="$tc(\'sw-settings-document.detail.assignmentCard\')"\n                    :is-loading="isLoading || typeIsLoading"\n                >\n                    <sw-container\n                        columns="repeat(auto-fit, minmax(100%, 1fr))"\n                        gap="0px 30px"\n                    >\n                        \n                        {% block sw_document_detail_base_general_input_type %}\n                        <sw-entity-single-select\n                            id="documentConfigTypes"\n                            v-model:value="documentConfig.documentTypeId"\n                            name="sw-field--documentConfig-documentTypeId"\n                            @update:value="(id, type) => onChangeType(type)"\n                            v-tooltip="{\n                                showDelay: 300,\n                                message: $tc(\'sw-settings-document.detail.disabledTypeSelect\'),\n                                disabled: !documentConfig.global || !acl.can(\'document.editor\')\n                            }"\n                            required\n                            show-clearable-button\n                            :error="documentBaseConfigDocumentTypeIdError"\n                            entity="document_type"\n                            :label="$tc(\'sw-settings-document.detail.labelType\')"\n                            class="sw-settings-document-detail__select-type"\n                            :disabled="documentConfig.global || !acl.can(\'document.editor\')"\n                        />\n                        {% endblock %}\n                        \n                        {% block sw_document_detail_base_general_input_sales_channel %}\n                        <sw-multi-select\n                            v-if="documentConfig.salesChannels && (!documentConfig.global || documentConfig.global === false)"\n                            id="documentSalesChannel"\n                            v-model:value="documentConfigSalesChannels"\n                            @update:value="(v) => documentConfigSalesChannels = v"\n                            name="sw-field--documentConfigSalesChannels"\n                            v-tooltip="{\n                                showDelay: 300,\n                                message: $tc(\'sw-settings-document.detail.disabledSalesChannelSelect\'),\n                                disabled: !!documentConfig.documentType\n                            }"\n                            required\n                            label-property="name"\n                            value-property="id"\n                            :options="documentConfigSalesChannelOptionsCollection"\n                            :label="$tc(\'sw-settings-document.detail.labelSalesChannel\')"\n                            :disabled="!documentConfig.documentType || !acl.can(\'document.editor\')"\n                            class="sw-document-detail__select-type"\n                        >\n                            \n                            {% block sw_document_detail_base_general_input_sales_channel_label %}\n                            <template #selection-label-property="{ item }">\n                                {{ item.salesChannel.translated.name }}\n                            </template>\n                            {% endblock %}\n                            \n                            {% block sw_document_detail_base_general_input_sales_channel_result_item %}\n                            <template #result-item="{ item, index, labelProperty, valueProperty, searchTerm, highlightSearchTerm, isSelected, addItem, getKey }">\n                                <sw-select-result\n                                    v-tooltip="{\n                                        showDelay: 300,\n                                        message: $tc(\'sw-settings-document.detail.disabledSalesChannel\'),\n                                        disabled: !alreadyAssignedSalesChannelIdsToType.includes(item.salesChannel.id)\n                                    }"\n                                    :selected="isSelected(item)"\n                                    :disabled="alreadyAssignedSalesChannelIdsToType.includes(item.salesChannel.id)"\n                                    v-bind="{ item, index }"\n                                    @item-select="addItem"\n                                >\n                                    <sw-highlight-text\n                                        v-if="highlightSearchTerm"\n                                        :text="item.salesChannel.translated.name"\n                                        :search-term="searchTerm"\n                                    />\n                                    <template v-else>\n                                        {{ item.salesChannel.translated.name }}\n                                    </template>\n                                </sw-select-result>\n                            </template>\n                            {% endblock %}\n                        </sw-multi-select>\n                        {% endblock %}\n                    </sw-container>\n                </sw-card>\n                {% endblock %}\n\n                \n                {% block sw_settings_document_detail_content_card %}\n                <sw-card\n                    position-identifier="sw-settings-document-detail-content"\n                    :title="$tc(\'sw-settings-document.detail.configCard\')"\n                    :is-loading="isLoading"\n                >\n                    <sw-container\n                        columns="repeat(auto-fit, minmax(250px, 1fr))"\n                        gap="0px 30px"\n                    >\n                        \n                        {% block sw_settings_document_detail_content_field_name %}\n                        <div class="sw-settings-document-detail__field_name">\n                            <sw-text-field\n                                v-model:value="documentConfig.name"\n                                name="sw-field--documentConfig-name"\n                                :label="$tc(\'sw-settings-document.detail.labelName\')"\n                                :placeholder="$tc(\'sw-settings-document.detail.placeholderName\')"\n                                :disabled="!acl.can(\'document.editor\')"\n                                validation="required"\n                                :error="documentBaseConfigNameError"\n                                required\n                            />\n                        </div>\n                        {% endblock %}\n                        \n                        {% block sw_settings_document_detail_content_field_media %}\n                        <div\n                            flex="250px"\n                            align="stretch"\n                            class="media-column"\n                        >\n                            <sw-media-field\n                                :value="documentConfig.logoId"\n                                @update:value="(v) => documentConfig.logoId = v"\n                                name="sw-field--documentConfig-logoId"\n                                :disabled="!acl.can(\'document.editor\')"\n                                :label="$tc(\'sw-settings-document.detail.labelOptionMedia\')"\n                            />\n                        </div>\n                        {% endblock %}\n                        \n                        {% block sw_settings_document_detail_content_field_file_name_prefix %}\n                        <div class="sw-settings-document-detail__field_file_name_prefix">\n                            <sw-text-field\n                                v-model:value="documentConfig.filenamePrefix"\n                                name="sw-field--documentConfig-filenamePrefix"\n                                :disabled="!acl.can(\'document.editor\')"\n                                :label="$tc(\'sw-settings-document.detail.labelFileNamePrefix\')"\n                            />\n                        </div>\n                        {% endblock %}\n                        \n                        {% block sw_settings_document_detail_content_field_file_name_suffix %}\n                        <div class="sw-settings-document-detail__field_file_name_suffix">\n                            <sw-text-field\n                                v-model:value="documentConfig.filenameSuffix"\n                                name="sw-field--documentConfig-filenameSuffix"\n                                :disabled="!acl.can(\'document.editor\')"\n                                :label="$tc(\'sw-settings-document.detail.labelFileNameSuffix\')"\n                            />\n                        </div>\n                        {% endblock %}\n                        \n                        {% block sw_settings_document_detail_content_form_field_renderer_content %}\n                        \n                        <template\n                            v-for="(formField, index) in generalFormFields"\n                            v-if="documentConfig.config"\n                            :key="`formField-${index}`"\n                        >\n                            \n                            {% block sw_settings_document_detail_content_form_field_renderer %}\n                            <sw-form-field-renderer\n                                v-if="formField"\n                                v-model:value="documentConfig.config[formField.name]"\n                                :disabled="!acl.can(\'document.editor\')"\n                                class="sw-settings-document-detail__form-field-renderer"\n                                v-bind="formField"\n                            />\n                            <div\n                                v-else\n                                :key="`else-formField-${index}`"\n                            ></div>\n                            {% endblock %}\n                        </template>\n                        {% endblock %}\n\n                        \n                        {% block sw_settings_document_detail_content_field_display_divergent_delivery_address %}\n                        <sw-checkbox-field\n                            v-if="isShowDivergentDeliveryAddress"\n                            v-model:value="documentConfig.config.displayDivergentDeliveryAddress"\n                            name="sw-field--documentConfig-config-displayDivergentDeliveryAddress"\n                            class="sw-settings-document-detail__field_divergent_delivery_address"\n                            :disabled="!acl.can(\'document.editor\')"\n                            :label="$tc(\'sw-settings-document.detail.labelDisplayDivergentDeliveryAddress\')"\n                        />\n                        {% endblock %}\n\n                        \n                        {% block sw_settings_document_detail_content_field_additional_note_delivery %}\n                        <sw-checkbox-field\n                            v-if="isShowDisplayNoteDelivery"\n                            v-model:value="documentConfig.config.displayAdditionalNoteDelivery"\n                            name="sw-field--documentConfig-config-displayAdditionalNoteDelivery"\n                            class="sw-settings-document-detail__field_additional_note_delivery"\n                            :disabled="!acl.can(\'document.editor\')"\n                            :label="$tc(\'sw-settings-document.detail.labelDisplayAdditionalNoteDelivery\')"\n                        />\n                        {% endblock %}\n\n                        \n                        {% block sw_settings_document_detail_content_field_customer_vat_id %}\n                        <sw-checkbox-field\n                            v-if="isShowDisplayNoteDelivery"\n                            v-model:value="documentConfig.config.displayCustomerVatId"\n                            name="sw-field--documentConfig-config-displayCustomerVatId"\n                            class="sw-settings-document-detail__field_customer_vat_id"\n                            :disabled="!acl.can(\'document.editor\')"\n                            :label="$tc(\'sw-settings-document.detail.labelDisplayCustomerVatId\')"\n                        />\n                        {% endblock %}\n\n                        \n                        {% block sw_settings_document_detail_content_field_delivery_countries %}\n                        <sw-entity-multi-id-select\n                            v-if="showCountriesSelect"\n                            v-model:value="documentConfig.config.deliveryCountries"\n                            name="sw-field--documentConfig-config-deliveryCountries"\n                            class="sw-settings-document-detail__field_delivery_countries"\n                            :repository="countryRepository"\n                            :disabled="!acl.can(\'document.editor\')"\n                            :help-text="$tc(\'sw-settings-document.detail.helpTextDisplayDeliveryCountries\')"\n                            :label="$tc(\'sw-settings-document.detail.labelDeliveryCountries\')"\n                            :placeholder="$tc(\'sw-settings-document.detail.placeholderDisplayDeliveryCountries\')"\n                        />\n                        {% endblock %}\n                    </sw-container>\n                </sw-card>\n                {% endblock %}\n\n                \n                {% block sw_settings_document_detail_company_card %}\n                <sw-card\n                    position-identifier="sw-settings-document-detail-company"\n                    :title="$tc(\'sw-settings-document.detail.companyCard\')"\n                    :is-loading="isLoading"\n                >\n                    <sw-container\n                        columns="repeat(auto-fit, minmax(250px, 1fr))"\n                        gap="0px 30px"\n                        align="end"\n                    >\n                        \n                        {% block sw_settings_document_detail_company_form_field_renderer_content %}\n                        <template v-if="documentConfig.config">\n                            <template\n                                v-for="formField in companyFormFields"\n                                :key="formField.name"\n                            >\n                                \n                                {% block sw_settings_document_detail_company_form_field_renderer %}\n                                <sw-form-field-renderer\n                                    v-model:value="documentConfig.config[formField.name]"\n                                    :disabled="!acl.can(\'document.editor\')"\n                                    v-bind="formField"\n                                />\n                                {% endblock %}\n                            </template>\n                        </template>\n                        {% endblock %}\n                    </sw-container>\n                </sw-card>\n                {% endblock %}\n\n                \n                {% block sw_settings_document_detail_custom_field_sets %}\n                <sw-card\n                    v-if="showCustomFields"\n                    position-identifier="sw-settings-document-detail-custom-field-sets"\n                    :title="$tc(\'sw-settings-custom-field.general.mainMenuItemGeneral\')"\n                    :is-loading="isLoading"\n                >\n                    <sw-custom-field-set-renderer\n                        :entity="documentConfig"\n                        :disabled="!acl.can(\'document.editor\')"\n                        :sets="customFieldSets"\n                    />\n                </sw-card>\n                {% endblock %}\n            </template>\n        </sw-card-view>\n    </template>\n    {% endblock %}\n</sw-page>\n{% endblock %}\n',inject:["repositoryFactory","acl","feature","customFieldDataProviderService"],mixins:[s.getByName("notification"),s.getByName("placeholder")],shortcuts:{"SYSTEMKEY+S":"onSave",ESCAPE:"onCancel"},props:{documentConfigId:{type:String,required:!1,default:null}},data(){return{documentConfig:{config:{displayAdditionalNoteDelivery:!1}},documentConfigSalesChannelOptionsCollection:[],documentConfigSalesChannels:[],isLoading:!1,isSaveSuccessful:!1,salesChannels:{},selectedType:{},isShowDisplayNoteDelivery:!1,isShowDivergentDeliveryAddress:!1,isShowCountriesSelect:!1,generalFormFields:[{name:"pageOrientation",type:"radio",config:{componentName:"sw-single-select",labelProperty:"name",valueProperty:"id",options:[{id:"portrait",name:"Portrait"},{id:"landscape",name:"Landscape"}],label:this.$tc("sw-settings-document.detail.labelPageOrientation")}},{name:"pageSize",type:"radio",config:{componentName:"sw-single-select",labelProperty:"name",valueProperty:"id",options:[{id:"a4",name:"A4"},{id:"a5",name:"A5"},{id:"legal",name:"Legal"},{id:"letter",name:"Letter"}],label:this.$tc("sw-settings-document.detail.labelPageSize")}},{name:"itemsPerPage",type:"text",config:{type:"text",label:this.$tc("sw-settings-document.detail.labelItemsPerPage")}},null,{name:"displayHeader",type:"bool",config:{type:"checkbox",label:this.$tc("sw-settings-document.detail.labelDisplayHeader")}},{name:"displayFooter",type:"bool",config:{type:"checkbox",label:this.$tc("sw-settings-document.detail.labelDisplayFooter")}},{name:"displayPageCount",type:"bool",config:{type:"checkbox",label:this.$tc("sw-settings-document.detail.labelDisplayPageCount")}},{name:"displayLineItems",type:"bool",config:{type:"checkbox",label:this.$tc("sw-settings-document.detail.labelDisplayLineItems")}},{name:"displayLineItemPosition",type:"bool",config:{type:"checkbox",label:this.$tc("sw-settings-document.detail.labelDisplayLineItemPosition")}},{name:"displayPrices",type:"bool",config:{type:"checkbox",label:this.$tc("sw-settings-document.detail.labelDisplayPrices")}},{name:"displayInCustomerAccount",type:"bool",config:{type:"checkbox",label:this.$tc("sw-settings-document.detail.labelDisplayDocumentInCustomerAccount"),helpText:this.$tc("sw-settings-document.detail.helpTextDisplayDocumentInCustomerAccount")}}],companyFormFields:[{name:"displayCompanyAddress",type:"bool",config:{type:"checkbox",label:this.$tc("sw-settings-document.detail.labelDisplayCompanyAddress"),class:"sw-settings-document-detail__company-address-checkbox"}},{name:"companyAddress",type:"text",config:{type:"text",label:this.$tc("sw-settings-document.detail.labelCompanyAddress")}},{name:"companyName",type:"text",config:{type:"text",label:this.$tc("sw-settings-document.detail.labelCompanyName")}},{name:"companyEmail",type:"text",config:{type:"text",label:this.$tc("sw-settings-document.detail.labelCompanyEmail")}},{name:"companyPhone",type:"text",config:{type:"text",label:this.$tc("sw-settings-document.detail.labelCompanyPhone")}},{name:"companyUrl",type:"text",config:{type:"text",label:this.$tc("sw-settings-document.detail.labelCompanyUrl")}},{name:"taxNumber",type:"text",config:{type:"text",label:this.$tc("sw-settings-document.detail.labelTaxNumber")}},{name:"taxOffice",type:"text",config:{type:"text",label:this.$tc("sw-settings-document.detail.labelTaxOffice")}},{name:"vatId",type:"text",config:{type:"text",label:this.$tc("sw-settings-document.detail.labelVatId")}},{name:"bankName",type:"text",config:{type:"text",label:this.$tc("sw-settings-document.detail.labelBankName")}},{name:"bankIban",type:"text",config:{type:"text",label:this.$tc("sw-settings-document.detail.labelBankIban")}},{name:"bankBic",type:"text",config:{type:"text",label:this.$tc("sw-settings-document.detail.labelBankBic")}},{name:"placeOfJurisdiction",type:"text",config:{type:"text",label:this.$tc("sw-settings-document.detail.labelPlaceOfJurisdiction")}},{name:"placeOfFulfillment",type:"text",config:{type:"text",label:this.$tc("sw-settings-document.detail.labelPlaceOfFulfillment")}},{name:"executiveDirector",type:"text",config:{type:"text",label:this.$tc("sw-settings-document.detail.labelExecutiveDirector")}}],alreadyAssignedSalesChannelIdsToType:[],typeIsLoading:!1,customFieldSets:null}},metaInfo(){return{title:this.$createTitle(this.identifier)}},computed:{identifier(){return a(this.documentConfig,"name","")},countryRepository(){return this.repositoryFactory.create("country")},documentBaseConfigCriteria(){let e=new l(1,25);return e.addAssociation("documentType").getAssociation("salesChannels").addAssociation("salesChannel"),e},documentBaseConfigRepository(){return this.repositoryFactory.create("document_base_config")},documentTypeRepository(){return this.repositoryFactory.create("document_type")},salesChannelRepository(){return this.repositoryFactory.create("sales_channel")},documentBaseConfigSalesChannelRepository(){return this.repositoryFactory.create("document_base_config_sales_channel")},tooltipSave(){return this.acl.can("document.editor")?{message:`${this.$device.getSystemKey()} + S`,appearance:"light"}:{message:this.$tc("sw-privileges.tooltip.warning"),disabled:this.acl.can("order.editor"),showOnDisabledElements:!0}},tooltipCancel(){return{message:"ESC",appearance:"light"}},showCountriesSelect(){if(!this.isShowDisplayNoteDelivery)return!1;let e=o(this.documentConfig);return e.config?.displayAdditionalNoteDelivery},documentBaseConfig(){return this.documentConfig},...c("documentBaseConfig",["name","documentTypeId"]),showCustomFields(){return this.customFieldSets&&this.customFieldSets.length>0}},created(){this.createdComponent()},methods:{async createdComponent(){this.isLoading=!0,await this.loadAvailableSalesChannel(),this.documentConfigId?await Promise.all([this.loadEntityData(),this.loadCustomFieldSets()]):(this.documentConfig=this.documentBaseConfigRepository.create(),this.documentConfig.global=!1,this.documentConfig.config={}),this.isLoading=!1},async loadEntityData(){this.isLoading=!0;let e=this.documentConfigId||this.$route.params.id;this.documentConfig=await this.documentBaseConfigRepository.get(e,Shopware.Context.api,this.documentBaseConfigCriteria),this.documentConfig||(this.documentConfig={}),this.documentConfig.config||this.$set(this.documentConfig,"config",{}),await this.onChangeType(this.documentConfig.documentType),void 0===this.documentConfig.salesChannels&&this.$set(this.documentConfig,"salesChannels",[]),this.documentConfig.salesChannels.forEach(e=>{this.documentConfigSalesChannels.push(e.id)}),this.isLoading=!1},loadCustomFieldSets(){this.customFieldDataProviderService.getCustomFieldSets("document_base_config").then(e=>{this.customFieldSets=e})},async loadAvailableSalesChannel(){this.salesChannels=await this.salesChannelRepository.search(new l(1,500))},showOption(e){return e.id!==this.documentConfig.id},async onChangeType(e){if(!e)return;this.typeIsLoading=!0,this.documentConfig.documentType=e,this.documentConfigSalesChannels=[],this.isShowDisplayNoteDelivery=!1,this.isShowDivergentDeliveryAddress=!1,"invoice"===o(e).technicalName&&(this.isShowDisplayNoteDelivery=!0,this.isShowDivergentDeliveryAddress=!0),this.createSalesChannelSelectOptions();let n=new l(1,25);n.addFilter(l.equals("documentTypeId",e.id)),this.documentBaseConfigSalesChannelRepository.search(n).then(e=>{this.alreadyAssignedSalesChannelIdsToType=[],e.forEach(e=>{null!==e.salesChannelId&&e.documentBaseConfigId!==this.documentConfig.id&&this.alreadyAssignedSalesChannelIdsToType.push(e.salesChannelId)}),this.typeIsLoading=!1})},onChangeSalesChannel(){this.documentConfigSalesChannels&&this.documentConfigSalesChannels.length>0&&this.documentConfigSalesChannels.forEach(e=>{this.documentConfig.salesChannels.has(e)||this.documentConfig.salesChannels.push(this.documentConfigSalesChannelOptionsCollection.get(e))}),this.documentConfig.salesChannels.forEach(e=>{this.documentConfigSalesChannels.includes(e.id)||this.documentConfig.salesChannels.remove(e.id)})},abortOnLanguageChange(){return this.documentBaseConfigRepository.hasChanges(this.documentConfig)},saveOnLanguageChange(){return this.onSave()},onChangeLanguage(e){return Shopware.State.commit("context/setApiLanguageId",e),this.loadEntityData()},async saveFinish(){this.documentConfig.isNew()&&await this.$router.replace({name:"sw.settings.document.detail",params:{id:this.documentConfig.id}}),this.loadEntityData()},onSave(){return this.isSaveSuccessful=!1,this.isLoading=!0,this.onChangeSalesChannel(),this.documentBaseConfigRepository.save(this.documentConfig).then(()=>{this.isLoading=!1,this.isSaveSuccessful=!0}).catch(()=>{this.isLoading=!1})},onCancel(){this.$router.push({name:"sw.settings.document.index"})},createSalesChannelSelectOptions(){this.documentConfigSalesChannelOptionsCollection=new d(this.documentConfig.salesChannels.source,this.documentConfig.salesChannels.entity,Shopware.Context.api),this.documentConfig.documentType&&this.salesChannels.forEach(e=>{let n=!1;if(this.documentConfig.salesChannels.forEach(t=>{t.salesChannelId===e.id&&(n=!0,this.documentConfigSalesChannelOptionsCollection.push(t))}),!n){let n=this.documentBaseConfigSalesChannelRepository.create();n.documentBaseConfigId=this.documentConfig.id,n.documentTypeId=this.documentConfig.documentType.id,n.salesChannelId=e.id,n.salesChannel=e,this.documentConfigSalesChannelOptionsCollection.push(n)}})}}}},73375:function(e,n,t){var i=t(57461);i.__esModule&&(i=i.default),"string"==typeof i&&(i=[[e.id,i,""]]),i.locals&&(e.exports=i.locals),t(45346).Z("650f86c8",i,!0,{})}}]);