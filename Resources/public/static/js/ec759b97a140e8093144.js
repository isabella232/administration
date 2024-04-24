(window.webpackJsonpAdministration=window.webpackJsonpAdministration||[]).push([[89526],{68172:function(){},89526:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return n}}),s(24047);let{Application:i}=Shopware,a=Shopware.Utils.types;var n={template:'\n{% block sw_media_quickinfo_usage %}\n<div class="sw-media-quickinfo-usage">\n    \n    {% block sw_media_quickinfo_usage_loader %}\n    <sw-loader\n        v-if="isLoading"\n        size="30px"\n        class="sw-media-quickinfo-usage__loading-indicator"\n    />\n    {% endblock %}\n\n    \n    {% block sw_media_quickinfo_usage_empty_state %}\n    <sw-alert\n        v-else-if="isNotUsed"\n        class="sw-media-quickinfo-usage__info-not-used"\n        variant="info"\n        :title="$tc(\'sw-media.sidebar.usage.titleMediaNotUsed\')"\n    >\n        {{ $tc(\'sw-media.sidebar.usage.labelMediaNotUsed\') }}\n    </sw-alert>\n    {% endblock %}\n\n    \n    {% block sw_media_quickinfo_usage_list %}\n    <ul\n        v-else\n        class="sw-media-quickinfo-usage__list"\n    >\n        \n        {% block sw_media_quickinfo_usage_item %}\n        <router-link\n            v-for="usage in getUsages"\n            :key="usage.link.id"\n            :to="{ name: usage.link.name, params: { id: usage.link.id } }"\n            :target="routerLinkTarget"\n        >\n            <li\n                v-tooltip="{\n                    showDelay: 300,\n                    hideDelay: 5,\n                    message: usage.tooltip\n                }"\n                class="sw-media-quickinfo-usage__item"\n            >\n                \n                {% block sw_media_quickinfo_usage_item_icon %}\n                <div class="sw-media-quickinfo-usage__label">\n                    <sw-icon\n                        :name="usage.icon.name"\n                        :color="usage.icon.color"\n                        small\n                    />\n                </div>\n                {% endblock %}\n\n                \n                {% block sw_media_quickinfo_usage_item_label %}\n                <div class="sw-media-quickinfo-usage__label">\n                    {{ usage.name }}\n                </div>\n                {% endblock %}\n            </li>\n        </router-link>\n        {% endblock %}\n    </ul>\n    {% endblock %}\n</div>\n{% endblock %}\n\n',props:{item:{required:!0,type:Object,validator(e){return"media"===e.getEntityName()}},routerLinkTarget:{required:!1,type:String,default:""}},data(){return{products:[],categories:[],manufacturers:[],mailTemplates:[],documentBaseConfigs:[],avatarUsers:[],paymentMethods:[],shippingMethods:[],layouts:[],isLoading:!1}},computed:{moduleFactory(){return i.getContainer("factory").module},getUsages(){let e=[];return this.products.forEach(({product:t})=>{e.push(this.getProductUsage(t))}),this.categories.forEach(t=>{e.push(this.getCategoryUsage(t))}),this.manufacturers.forEach(t=>{e.push(this.getManufacturerUsage(t))}),this.mailTemplates.forEach(({mailTemplate:t})=>{e.some(e=>e.link.id===t.id)||e.push(this.getMailTemplateUsage(t))}),this.documentBaseConfigs.forEach(t=>{e.push(this.getDocumentBaseConfigUsage(t))}),this.paymentMethods.forEach(t=>{e.push(this.getPaymentMethodUsage(t))}),this.shippingMethods.forEach(t=>{e.push(this.getShippingMethodUsage(t))}),this.layouts.forEach(t=>{e.push(this.getLayoutUsage(t))}),a.isEmpty(this.avatarUsers)||this.avatarUsers.forEach(t=>{e.push(this.getAvatarUserUsage(t))}),e},isNotUsed(){return 0===this.getUsages.length}},watch:{item(){this.createdComponent()}},created(){this.createdComponent()},methods:{createdComponent(){this.loadProductAssociations(),this.loadCategoryAssociations(),this.loadManufacturerAssociations(),this.loadMailTemplateAssociations(),this.loadDocumentBaseConfigAssociations(),this.loadAvatarUserAssociations(),this.loadPaymentMethodAssociations(),this.loadShippingMethodAssociations(),this.loadLayoutAssociations()},loadProductAssociations(){this.products=this.item.productMedia},loadCategoryAssociations(){this.categories=this.item.categories},loadManufacturerAssociations(){this.manufacturers=this.item.productManufacturers},loadMailTemplateAssociations(){this.mailTemplates=this.item.mailTemplateMedia},loadDocumentBaseConfigAssociations(){this.documentBaseConfigs=this.item.documentBaseConfigs},loadAvatarUserAssociations(){this.avatarUsers=this.item.avatarUsers},loadPaymentMethodAssociations(){this.paymentMethods=this.item.paymentMethods},loadShippingMethodAssociations(){this.shippingMethods=this.item.shippingMethods},loadLayoutAssociations(){this.layouts=[],this.item.cmsBlocks.forEach(e=>{this.isExistedCmsMedia(e.section.pageId)||this.layouts.push({id:e.section.pageId,name:e.section.page.translated.name})}),this.item.cmsSections.forEach(e=>{this.isExistedCmsMedia(e.pageId)||this.layouts.push({id:e.pageId,name:e.page.translated.name})}),this.item.cmsPages.forEach(e=>{this.isExistedCmsMedia(e.id)||this.layouts.push({id:e.id,name:e.translated.name})})},isExistedCmsMedia(e){return this.layouts.some(t=>t.id===e)},getProductUsage(e){return{name:e.translated.name,tooltip:this.$tc("sw-media.sidebar.usage.tooltipFoundInProducts"),link:{name:"sw.product.detail",id:e.id},icon:this.getIconForModule("sw-product")}},getCategoryUsage(e){return{name:e.translated.name,tooltip:this.$tc("sw-media.sidebar.usage.tooltipFoundInCategories"),link:{name:"sw.category.detail",id:e.id},icon:this.getIconForModule("sw-category")}},getManufacturerUsage(e){return{name:e.translated.name,tooltip:this.$tc("sw-media.sidebar.usage.tooltipFoundInManufacturers"),link:{name:"sw.manufacturer.detail",id:e.id},icon:this.getIconForModule("sw-manufacturer")}},getMailTemplateUsage(e){return{name:e.translated.description,tooltip:this.$tc("sw-media.sidebar.usage.tooltipFoundInMailTemplate"),link:{name:"sw.mail.template.detail",id:e.id},icon:this.getIconForModule("sw-mail-template")}},getDocumentBaseConfigUsage(e){return{name:e.name,tooltip:this.$tc("sw-media.sidebar.usage.tooltipFoundInDocument"),link:{name:"sw.settings.document.detail",id:e.id},icon:this.getIconForModule("sw-settings-document")}},getAvatarUserUsage(e){return{name:e.username,tooltip:this.$tc("sw-media.sidebar.usage.tooltipFoundInUser"),link:{name:"sw.settings.user.detail",id:e.id},icon:this.getIconForModule("sw-settings-user")}},getPaymentMethodUsage(e){return{name:e.translated.distinguishableName,tooltip:this.$tc("sw-media.sidebar.usage.tooltipFoundInPayment"),link:{name:"sw.settings.payment.detail",id:e.id},icon:this.getIconForModule("sw-settings-payment")}},getShippingMethodUsage(e){return{name:e.translated.name,tooltip:this.$tc("sw-media.sidebar.usage.tooltipFoundShipping"),link:{name:"sw.settings.shipping.detail",id:e.id},icon:this.getIconForModule("sw-settings-shipping")}},getLayoutUsage(e){return{name:e.name,tooltip:this.$tc("sw-media.sidebar.usage.tooltipFoundLayout"),link:{name:"sw.cms.detail",id:e.id},icon:this.getIconForModule("sw-cms")}},getIconForModule(e){let t=this.moduleFactory.getModuleRegistry().get(e);return{name:t.manifest.icon,color:t.manifest.color}}}}},24047:function(e,t,s){var i=s(68172);i.__esModule&&(i=i.default),"string"==typeof i&&(i=[[e.id,i,""]]),i.locals&&(e.exports=i.locals),s(45346).Z("46e8f2a8",i,!0,{})}}]);