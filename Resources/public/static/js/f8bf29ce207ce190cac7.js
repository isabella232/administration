(window.webpackJsonpAdministration=window.webpackJsonpAdministration||[]).push([[8752],{15898:function(){},8752:function(l,n,e){"use strict";e.r(n),e.d(n,{default:function(){return c}}),e(64835);var c={template:'\n{% block sw_cms_block_layout_config %}\n<div class="sw-cms-block-layout-config">\n    \n    {% block sw_cms_block_layout_config_css_class %}\n    <sw-text-field\n        v-model:value="block.cssClass"\n        :label="$tc(\'sw-cms.detail.label.cssClassField\')"\n        :help-text="$tc(\'sw-cms.detail.helpText.cssClassField\')"\n    />\n    {% endblock %}\n\n    \n    {% block sw_cms_block_layout_config_top_margin_field %}\n    <sw-text-field\n        v-model:value="block.marginTop"\n        :label="$tc(\'sw-cms.detail.label.blockTopMarginField\')"\n    />\n    {% endblock %}\n\n    \n    {% block sw_cms_block_layout_config_bottom_margin_field %}\n    <sw-text-field\n        v-model:value="block.marginBottom"\n        :label="$tc(\'sw-cms.detail.label.blockBottomMarginField\')"\n    />\n    {% endblock %}\n\n    \n    {% block sw_cms_block_layout_config_left_margin_field %}\n    <sw-text-field\n        v-model:value="block.marginLeft"\n        :label="$tc(\'sw-cms.detail.label.blockLeftMarginField\')"\n    />\n    {% endblock %}\n\n    \n    {% block sw_cms_block_layout_config_right_margin_field %}\n    <sw-text-field\n        v-model:value="block.marginRight"\n        :label="$tc(\'sw-cms.detail.label.blockRightMarginField\')"\n    />\n    {% endblock %}\n</div>\n{% endblock %}\n',inject:["cmsService"],props:{block:{type:Object,required:!0}}}},64835:function(l,n,e){var c=e(15898);c.__esModule&&(c=c.default),"string"==typeof c&&(c=[[l.id,c,""]]),c.locals&&(l.exports=c.locals),e(45346).Z("1a6a95fc",c,!0,{})}}]);