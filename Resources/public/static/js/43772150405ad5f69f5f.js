(window.webpackJsonpAdministration=window.webpackJsonpAdministration||[]).push([[55005],{74061:function(){},55005:function(t,e,i){"use strict";i.r(e),i.d(e,{default:function(){return r}}),i(50549);var r={template:'\n{% block sw_import_export_view_export %}\n<div class="sw-import-export-view-export">\n    \n    {% block sw_import_export_view_export_exporter %}\n    <sw-card\n        :title="$tc(\'sw-import-export.exporter.exportLabel\')"\n        position-identifier="sw-import-export-view-export"\n    >\n        <sw-import-export-exporter\n            @export-started="reloadContent"\n        />\n    </sw-card>\n    {% endblock %}\n\n    \n    {% block sw_import_export_view_export_activity %}\n    <sw-card\n        class="sw-import-export-view-export__activity"\n        position-identifier="sw-import-export-view-export-activity"\n    >\n        \n        {% block sw_import_export_view_export_activity_title %}\n        <template #title>\n            <div class="sw-card__title">\n                {{ $tc(\'sw-import-export.exporter.exportActivityLabel\') }}\n                <p class="sw-import-export__card-subtitle">\n                    {{ $tc(\'sw-import-export.exporter.exportActivityDescription\') }}\n                </p>\n            </div>\n        </template>\n        {% endblock %}\n\n        \n        {% block sw_import_export_view_export_activity_grid %}\n        <template #grid>\n            <sw-import-export-activity\n                ref="activityGrid"\n                type="export"\n            />\n        </template>\n        {% endblock %}\n    </sw-card>\n    {% endblock %}\n</div>\n{% endblock %}\n',metaInfo(){return{title:this.$createTitle()}},methods:{reloadContent(t){this.$refs.activityGrid.addActivity(t),this.$refs.activityGrid.fetchActivities()}}}},50549:function(t,e,i){var r=i(74061);r.__esModule&&(r=r.default),"string"==typeof r&&(r=[[t.id,r,""]]),r.locals&&(t.exports=r.locals),i(45346).Z("6996496f",r,!0,{})}}]);