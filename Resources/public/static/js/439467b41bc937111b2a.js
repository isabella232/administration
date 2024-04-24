(window.webpackJsonpAdministration=window.webpackJsonpAdministration||[]).push([[3289],{35952:function(){},3289:function(a,n,e){"use strict";e.r(n),e.d(n,{default:function(){return s}}),e(96889);let{Context:l}=Shopware;var s={template:'\n{% block sw_sales_channel_detail_analytics %}\n<sw-card\n    position-identifier="sw-sales-channel-detail-analytics"\n    :title="$tc(\'sw-sales-channel.detail.analytics.cardTitle\')"\n    :is-loading="isLoading"\n>\n    <template v-if="salesChannel && salesChannel.analytics">\n        \n        {% block sw_sales_channel_detail_analytics_headline %}\n        <div class="sw-sales-channel-detail-analytics__headline-text">\n            {{ $tc(\'sw-sales-channel.detail.analytics.headline\') }}\n        </div>\n        {% endblock %}\n\n        \n        {% block sw_sales_channel_detail_analytics_description %}\n        <p\n            class="sw-sales-channel-detail-analytics__description"\n            v-html="$tc(\'sw-sales-channel.detail.analytics.description\')"\n        ></p>\n        {% endblock %}\n\n        \n        {% block sw_sales_channel_detail_analytics_fields_tracking_id %}\n        <sw-text-field\n            v-model:value="salesChannel.analytics.trackingId"\n            :label="$tc(\'sw-sales-channel.detail.analytics.fields.trackingId.label\')"\n            :placeholder="$tc(\'sw-sales-channel.detail.analytics.fields.trackingId.placeHolder\')"\n            name="trackingId"\n            :disabled="!acl.can(\'sales_channel.editor\')"\n            :help-text="$tc(\'sw-sales-channel.detail.analytics.fields.trackingId.helpText\')"\n        />\n        {% endblock %}\n\n        \n        {% block sw_sales_channel_detail_analytics_fields_container %}\n        <sw-container\n            columns="repeat(auto-fit, minmax(250px, 1fr))"\n            gap="0 30px"\n        >\n            \n            {% block sw_sales_channel_detail_analytics_fields_active %}\n            <sw-switch-field\n                v-model:value="salesChannel.analytics.active"\n                :label="$tc(\'sw-sales-channel.detail.analytics.fields.active.label\')"\n                name="analyticsActive"\n                :disabled="!acl.can(\'sales_channel.editor\')"\n            />\n            {% endblock %}\n\n            \n            {% block sw_sales_channel_detail_analytics_fields_track_orders %}\n            <sw-switch-field\n                v-model:value="salesChannel.analytics.trackOrders"\n                :label="$tc(\'sw-sales-channel.detail.analytics.fields.trackOrders.label\')"\n                name="trackOrders"\n                :disabled="!acl.can(\'sales_channel.editor\')"\n            />\n            {% endblock %}\n\n            \n            {% block sw_sales_channel_detail_analytics_fields_anonymize_ip %}\n            <sw-switch-field\n                v-model:value="salesChannel.analytics.anonymizeIp"\n                :label="$tc(\'sw-sales-channel.detail.analytics.fields.anonymizeIp.label\')"\n                name="anonymizeIp"\n                :disabled="!acl.can(\'sales_channel.editor\')"\n            />\n            {% endblock %}\n        </sw-container>\n        {% endblock %}\n    </template>\n</sw-card>\n{% endblock %}\n',inject:["repositoryFactory","acl"],props:{isLoading:{type:Boolean,default:!1},salesChannel:{required:!0}},watch:{salesChannel(){this.createAnalyticsData()}},created(){this.createAnalyticsData()},methods:{createAnalyticsData(){if(this.salesChannel&&!this.salesChannel.analytics){let a=this.repositoryFactory.create("sales_channel_analytics");this.salesChannel.analytics=a.create(l.api)}}}}},96889:function(a,n,e){var l=e(35952);l.__esModule&&(l=l.default),"string"==typeof l&&(l=[[a.id,l,""]]),l.locals&&(a.exports=l.locals),e(45346).Z("d603b2ca",l,!0,{})}}]);