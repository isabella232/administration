const RepositoryFactory = Shopware._private.RepositoryFactory;
const { EntityHydrator, ChangesetGenerator, EntityFactory } = Shopware.Data;
const ErrorResolverError = Shopware.DataDeprecated.ErrorResolver;

export default function initializeRepositoryFactory(container) {
    const httpClient = container.httpClient;
    const factoryContainer = this.getContainer('factory');

    return httpClient.get('_info/entity-schema.json').then(({ data }) => {
        const entityDefinitionFactory = factoryContainer.entityDefinition;
        Object.keys(data).forEach((entityName) => {
            entityDefinitionFactory.add(entityName, data[entityName]);
        });

        const hydrator = new EntityHydrator();
        const changesetGenerator = new ChangesetGenerator();
        const entityFactory = new EntityFactory();
        const errorResolver = new ErrorResolverError();

        this.addServiceProvider('repositoryFactory', () => {
            return new RepositoryFactory(
                hydrator,
                changesetGenerator,
                entityFactory,
                httpClient,
                errorResolver
            );
        });
        this.addServiceProvider('entityHydrator', () => {
            return hydrator;
        });
        this.addServiceProvider('entityFactory', () => {
            return entityFactory;
        });
    });
}
