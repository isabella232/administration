(window.webpackJsonpAdministration=window.webpackJsonpAdministration||[]).push([[80835],{93095:function(){},80835:function(n,e,d){"use strict";d.r(e),d.d(e,{default:function(){return a}}),d(215);var a=Shopware.Component.wrapComponentConfig({template:'\n{% block sw_dashboard_index %}\n<sw-page\n    class="sw-dashboard-index"\n    :show-smart-bar="false"\n>\n    \n    {% block sw_dashboard_index_content %}\n    <template #content>\n        <sw-card-view class="sw-dashboard-index__content">\n\n            \n            {% block sw_dashboard_index_content_intro_card %}\n            \n            {% block sw_dashboard_index_content_intro_content %}\n            <div class="sw-dashboard-index__welcome-text">\n                \n                {% block sw_dashboard_index_content_intro %}\n                \n                {% block sw_dashboard_index_content_intro_content_headline %}\n                <h1 class="sw-dashboard-index__welcome-title">\n                    {{ welcomeMessage }}\n                </h1>\n                {% endblock %}\n\n                \n                {% block sw_dashboard_index_content_intro_welcome_message %}\n                <p class="sw-dashboard-index__welcome-message">\n                    {{ welcomeSubline }}\n                </p>\n                {% endblock %}\n                {% endblock %}\n            </div>\n            {% endblock %}\n            {% endblock %}\n\n            <sw-usage-data-consent-banner :can-be-hidden="true" />\n\n            \n            {% block sw_dashboard_index_content_info_grid %}\n            <div class="sw-dashboard-index__card-grid">\n                \n                {% block sw_dashboard_index_content_info_grid_inner %}\n\n                \n                {% block sw_dashboard_index_content_info__grid_inner_welcome_card %}\n                <div class="sw-dashboard-index__card sw-dashboard-index__card--bg-checklist">\n                    \n                    {% block sw_dashboard_index_content_info_grid_welcome_card_content %}\n                    \n                    {% block sw_dashboard_index_content_info_grid_welcome_headline %}\n                    <h2 class="sw-dashboard-index__card-title">\n                        {{ $tc(\'sw-dashboard.helpcard.headline\') }}\n                    </h2>\n                    {% endblock %}\n\n                    \n                    {% block sw_dashboard_index_content_info_grid_welcome_link_list %}\n                    <ul class="sw-dashboard-index__card-list">\n                        <li\n                            v-for="(key, index) in [\'helpcenter\',\'takeOffTip\',\'getToKnowSales\']"\n                            :key="`helpcardContent-${index}`"\n                            class="sw-dashboard-index__card-list-item"\n                        >\n                            <sw-external-link :href="$tc(`sw-dashboard.helpcard.${key}Link`)">\n                                {{ $tc(`sw-dashboard.helpcard.${key}`) }}\n                            </sw-external-link>\n                        </li>\n                    </ul>\n                    {% endblock %}\n                    {% endblock %}\n                </div>\n                {% endblock %}\n\n                \n                {% block sw_dashboard_index_content_grid_info_inner_feedback_card %}\n                <div class="sw-dashboard-index__card sw-dashboard-index__card--dimmed">\n                    \n                    {% block sw_dashboard_index_content_info_grid_feedback_card_content %}\n\n                    \n                    {% block sw_dashboard_index_content_feedback_headline %}\n                    <h2 class="sw-dashboard-index__card-title">\n                        {{ $tc(\'sw-dashboard.feedbackCard.headline\') }}\n                    </h2>\n                    {% endblock %}\n\n                    \n                    {% block sw_dashboard_index_content_feedback_text %}\n                    <p class="sw-dashboard-index__card-text">\n                        {{ $tc(\'sw-dashboard.feedbackCard.text\') }}\n                    </p>\n                    {% endblock %}\n\n                    \n                    {% block sw_dashboard_index_content_feedback_link %}\n                    <sw-external-link\n                        class="sw-dashboard-index__card-button"\n                        :href="$tc(\'sw-dashboard.feedbackCard.feedbackLink\')"\n                    >\n                        {{ $tc(\'sw-dashboard.feedbackCard.feedback\') }}\n                    </sw-external-link>\n                    {% endblock %}\n                    {% endblock %}\n                </div>\n                {% endblock %}\n                {% endblock %}\n            </div>\n            {% endblock %}\n\n            <sw-dashboard-statistics />\n\n        </sw-card-view>\n    </template>\n    {% endblock %}\n</sw-page>\n{% endblock %}\n',data(){return{cachedHeadlineGreetingKey:null}},metaInfo(){return{title:this.$createTitle()}},computed:{welcomeMessage(){let n=this.greetingName,e=this.$tc(this.cachedHeadlineGreetingKey,1,{greetingName:n});return n?e:e.replace(/\,\s*/,"")},welcomeSubline(){return this.$tc(this.getGreetingTimeKey("daytimeWelcomeText"))},greetingName(){let{currentUser:n}=Shopware.State.get("session");return n?.firstName||null}},created(){this.createdComponent()},methods:{createdComponent(){Shopware.ExtensionAPI.publishData({id:"sw-dashboard-detail__todayOrderData",path:"todayOrderData",scope:this}),Shopware.ExtensionAPI.publishData({id:"sw-dashboard-detail__statisticDateRanges",path:"statisticDateRanges",scope:this}),this.cachedHeadlineGreetingKey=this.cachedHeadlineGreetingKey??this.getGreetingTimeKey("daytimeHeadline")},getGreetingTimeKey(n="daytimeHeadline"){let e=`sw-dashboard.introduction.${n}`,d=this.getGreetings(n),a=new Date().getHours();if(void 0===d)return"";let t=Object.keys(d).map(n=>parseInt(n.replace("h",""),10)).sort((n,e)=>n-e).reverse(),s=t.find(n=>a>=n)||t[0],o=Math.floor(Math.random()*d[`${s}h`].length);return`${e}.${s}h[${o}]`},getGreetings(n="daytimeHeadline"){let e=this.$i18n.messages,d=e?.[this.$i18n.locale]?.["sw-dashboard"]?.introduction?.[n],a=e?.[this.$i18n.fallbackLocale]?.["sw-dashboard"]?.introduction?.[n];return d??a}}})},215:function(n,e,d){var a=d(93095);a.__esModule&&(a=a.default),"string"==typeof a&&(a=[[n.id,a,""]]),a.locals&&(n.exports=a.locals),d(45346).Z("d8a9e6e2",a,!0,{})}}]);