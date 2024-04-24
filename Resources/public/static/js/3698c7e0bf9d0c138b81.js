(window.webpackJsonpAdministration=window.webpackJsonpAdministration||[]).push([[78138],{8131:function(){},78138:function(e,t,i){"use strict";i.r(t),i.d(t,{default:function(){return l}}),i(84986);let{Mixin:o}=Shopware,{Criteria:n}=Shopware.Data,{mapPropertyErrors:r}=Shopware.Component.getComponentHelper();var l={template:'\n{% block sw_import_export_edit_profile_modal %}\n<div class="sw-import-export-edit-profile-modal">\n    <sw-modal\n        v-if="show && profile"\n        class="sw-import-export-edit-profile-modal"\n        :title="modalTitle"\n        variant="full"\n        @modal-close="$emit(\'profile-close\')"\n    >\n\n        \n        {% block sw_import_export_edit_profile_modal_alert %}\n        <sw-alert\n            v-if="profile.systemDefault"\n            variant="info"\n        >\n            {{ $tc(\'sw-import-export.profile.systemDefaultInfoText\') }}\n        </sw-alert>\n        {% endblock %}\n\n        \n        {% block sw_import_export_edit_profile_modal_tabs %}\n        <sw-tabs\n            position-identifier="sw-import-export-edit-profile-modal"\n            :small="false"\n            default-item="general"\n        >\n\n            <template #default="{ active }">\n\n                \n                {% block sw_import_export_edit_profile_modal_tabs_general %}\n                <sw-tabs-item\n                    :title="$tc(\'sw-import-export.profile.generalTab\')"\n                    :active-tab="active"\n                    name="general"\n                >\n                    {{ $tc(\'sw-import-export.profile.generalTab\') }}\n                </sw-tabs-item>\n                {% endblock %}\n\n                \n                {% block sw_import_export_edit_profile_modal_tabs_field_mappings %}\n                <sw-tabs-item\n                    :title="$tc(\'sw-import-export.profile.mappingsTab\')"\n                    :active-tab="active"\n                    name="mappings"\n                >\n                    {{ $tc(\'sw-import-export.profile.mappingsTab\') }}\n                </sw-tabs-item>\n                {% endblock %}\n\n                \n                {% block sw_import_export_edit_profile_modal_tabs_field_advanced %}\n                <sw-tabs-item\n                    v-if="profile.type !== \'export\' && profile.config.updateEntities !== false"\n                    :title="$tc(\'sw-import-export.profile.advancedTab\')"\n                    :active-tab="active"\n                    name="advanced"\n                >\n                    {{ $tc(\'sw-import-export.profile.advancedTab\') }}\n                </sw-tabs-item>\n                {% endblock %}\n            </template>\n\n            <template #content="{ active }">\n                <template v-if="active === \'general\'">\n                    <sw-import-export-edit-profile-general :profile="profile" />\n\n                    <sw-import-export-edit-profile-field-indicators :profile="profile" />\n                    \n                    {% block sw_import_export_edit_profile_modal_tabs_general_import_settings %}\n                    <sw-import-export-edit-profile-import-settings :profile="profile" />\n                    {% endblock %}\n                </template>\n\n                <template v-if="active === \'mappings\'">\n                    \n                    {% block sw_import_export_edit_profile_modal_tabs_mappings %}\n\n                    \n                    {% block sw_import_export_edit_profile_modal_tabs_mappings_text %}\n                    <p class="sw-import-export-edit-profile-modal__text">\n                        {{ $tc(\'sw-import-export.profile.mappingDescription\') }}\n                    </p>\n                    {% endblock %}\n\n                    \n                    {% block sw_import_export_edit_profile_modal_tabs_mappings_mapping %}\n                    <sw-import-export-edit-profile-modal-mapping\n                        :profile="profile"\n                        :system-required-fields="systemRequiredFields"\n                        @update-mapping="updateMapping"\n                    />\n                    {% endblock %}\n                    {% endblock %}\n                </template>\n\n                <template v-if="active === \'advanced\' && profile.type !== \'export\' && profile.config.updateEntities !== false">\n                    \n                    {% block sw_import_export_edit_profile_modal_tabs_advanced %}\n\n                    \n                    {% block sw_import_export_edit_profile_modal_tabs_advanced_text %}\n                    <p class="sw-import-export-edit-profile-modal__text">\n                        {{ $tc(\'sw-import-export.profile.advancedDescription\') }}\n                    </p>\n                    {% endblock %}\n\n                    \n                    {% block sw_import_export_edit_profile_modal_tabs_advanced_identifiers %}\n                    <sw-import-export-edit-profile-modal-identifiers\n                        :profile="profile"\n                    />\n                    {% endblock %}\n                    {% endblock %}\n                </template>\n\n                <template v-if="active === \'fieldIndicators\'">\n                    <p class="sw-import-export-edit-profile-modal__text">\n                        {{ $tc(\'sw-import-export.profile.csvDescriptionBlock\') }}\n                    </p>\n                </template>\n            </template>\n        </sw-tabs>\n        {% endblock %}\n\n        \n        {% block sw_import_export_edit_profile_modal_footer %}\n        <template #modal-footer>\n            <sw-button\n                size="small"\n                @click="$emit(\'profile-close\')"\n            >\n                {{ $tc(\'sw-import-export.profile.cancelLabel\') }}\n            </sw-button>\n            <template v-if="profile.systemDefault">\n                <sw-button\n                    class="sw-import-export-edit-profile-modal__save-action"\n                    size="small"\n                    variant="primary"\n                    @click="$emit(\'profile-close\')"\n                >\n                    {{ $tc(\'sw-import-export.profile.closeProfileLabel\') }}\n                </sw-button>\n            </template>\n            <template v-else>\n                <sw-button\n                    class="sw-import-export-edit-profile-modal__save-action"\n                    size="small"\n                    :disabled="!profile.sourceEntity\n                        || profile.sourceEntity.length <= 0\n                        || !profile.type"\n                    variant="primary"\n                    @click="saveProfile"\n                >\n                    {{ saveLabelSnippet }}\n                </sw-button>\n            </template>\n        </template>\n        {% endblock %}\n    </sw-modal>\n\n    \n    {% block sw_import_export_edit_profile_violation_modal %}\n    <sw-modal\n        v-if="showValidationError"\n        :title="$tc(\'global.default.error\')"\n        class="sw-import-export-edit-profile-modal__violation-modal"\n        @modal-close="resetViolations"\n    >\n\n        \n        {% block sw_import_export_edit_profile_violation_modal_message %}\n        <p>{{ $tc(\'sw-import-export.profile.violationMessage\') }}</p>\n        {% endblock %}\n\n        \n        {% block sw_import_export_edit_profile_violation_modal_required_fields %}\n        <ul>\n            \n            {% block sw_import_export_edit_profile_violation_modal_required_field %}\n            <li\n                v-for="requiredField in missingRequiredFields"\n                :key="requiredField"\n            >\n                {{ requiredField }}\n            </li>\n            {% endblock %}\n        </ul>\n        {% endblock %}\n\n        \n        {% block sw_import_export_edit_profile_violation_modal_footer %}\n        <template #modal-footer>\n            <sw-button\n                size="small"\n                @click="resetViolations"\n            >\n                {{ $tc(\'sw-import-export.profile.closeViolation\') }}\n            </sw-button>\n        </template>\n        {% endblock %}\n    </sw-modal>\n    {% endblock %}\n</div>\n{% endblock %}\n',inject:["repositoryFactory","feature","importExportProfileMapping","importExportUpdateByMapping"],mixins:[o.getByName("notification")],props:{profile:{type:Object,required:!1,default(){return{}}},show:{type:Boolean,required:!1,default(){return!0}}},data(){return{missingRequiredFields:[],systemRequiredFields:{}}},computed:{...r("profile",["name","sourceEntity","delimiter","enclosure","type"]),isNew(){return!!this.profile&&!!this.profile.isNew&&this.profile.isNew()},modalTitle(){return this.isNew?this.$tc("sw-import-export.profile.newProfileLabel"):this.$tc("sw-import-export.profile.editProfileLabel")},saveLabelSnippet(){return this.isNew?this.$tc("sw-import-export.profile.addProfileLabel"):this.$tc("sw-import-export.profile.saveProfileLabel")},showValidationError(){return this.missingRequiredFields.length>0},profileRepository(){return this.repositoryFactory.create("import_export_profile")}},watch:{"profile.sourceEntity":{handler(e){e&&this.loadSystemRequiredFieldsForEntity(e)}},"profile.mapping":{handler(){this.importExportUpdateByMapping.removeUnusedMappings(this.profile)}}},methods:{saveProfile(){this.getParentProfileSelected().then(e=>{this.checkValidation(e),0===this.missingRequiredFields.length&&this.$emit("profile-save")})},updateMapping(e){this.profile.mapping=e},getParentProfileSelected(){let e=new n(1,25);return e.addFilter(n.equals("sourceEntity",this.profile.sourceEntity)),e.addFilter(n.equals("systemDefault",!0)),this.profileRepository.search(e).then(e=>e.total>0?e[0]:null).catch(()=>{this.createNotificationError({message:this.$tc("sw-import-export.profile.messageSearchParentProfileError")})})},checkValidation(e){if("export"===this.profile.type)return;let t=e?e.mapping:[],i=!1===this.profile.config.createEntities&&!0===this.profile.config.updateEntities,o=this.importExportProfileMapping.validate(this.profile.sourceEntity,this.profile.mapping,t,i);o.missingRequiredFields.length>0&&(this.missingRequiredFields=o.missingRequiredFields)},resetViolations(){this.missingRequiredFields=[]},loadSystemRequiredFieldsForEntity(e){this.systemRequiredFields=this.importExportProfileMapping.getSystemRequiredFields(e)}}}},84986:function(e,t,i){var o=i(8131);o.__esModule&&(o=o.default),"string"==typeof o&&(o=[[e.id,o,""]]),o.locals&&(e.exports=o.locals),i(45346).Z("1b9479c7",o,!0,{})}}]);