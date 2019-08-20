import Criteria from 'src/core/data-new/criteria.data';

const { Application } = Shopware;

export default function createLocaleToLanguageService() {
    return {
        localeToLanguage
    };

    /**
     * @param {string} locale
     * @return {Promise} languageIdPromise
     */
    function localeToLanguage(locale) {
        const contextService = Application.getContainer('service').context;
        const repoFactory = Application.getContainer('service').repositoryFactory;
        const localeRepo = repoFactory.create('locale', '/locale');
        const languageRepo = repoFactory.create('language', '/language');
        const localeCriteria = new Criteria();

        localeCriteria.addFilter(Criteria.equals('code', locale));

        return localeRepo.search(localeCriteria, contextService).then((data) => {
            return data.first().id;
        }).then((id) => {
            const languageCriteria = new Criteria();
            languageCriteria.addFilter(
                Criteria.equals('language.localeId', id)
            );

            return languageRepo.search(languageCriteria, contextService);
        }).then((languageData) => {
            // Check if language exists in browser language
            if (languageData.first()) {
                return languageData.first().id;
            }

            // Fallback: Get first language id
            return languageRepo.search(new Criteria(), contextService).then((allLanguages) => {
                return allLanguages.first().id;
            });
        });
    }
}
