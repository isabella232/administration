const { Mixin } = Shopware;
const types = Shopware.Utils.types;

Mixin.register('sw-inline-snippet', {
    computed: {
        swInlineSnippetLocale() {
            return this.$store.state.adminLocale.currentLocale;
        },
        swInlineSnippetFallbackLocale() {
            return this.$store.state.adminLocale.fallbackLocale;
        }
    },

    methods: {
        getInlineSnippet(value) {
            if (!value) {
                return '';
            }
            if (value[this.swInlineSnippetLocale]) {
                return value[this.swInlineSnippetLocale];
            }
            if (value[this.swInlineSnippetFallbackLocale]) {
                return value[this.swInlineSnippetFallbackLocale];
            }
            if (types.isObject(value)) {
                const locale = Object.keys(value).find((key) => {
                    return value[key] !== '';
                });

                if (locale !== undefined) {
                    return value[locale];
                }
            }

            return value;
        }
    }
});
