import { State, EntityDefinition } from 'src/core/shopware';
import ShopwareError from './ShopwareError';

const regExRegularPointer = /\/([^\/]*)(.*)/;
const regExToManyAssociation = /\/([^\/]*)\/(\d)(\/.*)/;
const regExTranslations = /\/translations\/([a-fA-f\d]*)\/(.*)/;

export default class ErrorResolver {
    constructor() {
        this.errorStore = State.getStore('error');
    }

    resetApiErrors() {
        return this.errorStore.resetApiErrors();
    }

    /**
     * @param response
     * @param entity
     * @param changeset
     */
    handleWriteError({ response }, entity, changeset) {
        if (!this.isErrorDataSet(response)) {
            throw response;
        }

        const errors = response.data.errors;
        const definition = EntityDefinition.get(entity.getEntityName());

        const systemErrors = [];
        errors.forEach((error) => {
            this.resolveError(error, definition, entity, changeset, systemErrors);
        });

        if (systemErrors.length > 0) {
            this.addSystemErrors(systemErrors);
        }
    }

    /* TODO NEXT-3721 - add support for deletion queue */
    handleDeleteError() { // ({ response }, deletionQueue) {

    }

    /**
     * @private
     * @param {Object[]} systemErrors
     */
    addSystemErrors(systemErrors) {
        systemErrors.forEach((error) => {
            this.errorStore.addSystemError(error);
        });
    }

    /**
     * @private
     * @param error
     * @param definition
     * @param entity
     * @param changeset
     * @param systemErrors
     */
    resolveError(error, definition, entity, changeset, systemErrors) {
        if (!error.source || !error.source.pointer) {
            systemErrors.push(error);
            return;
        }

        if (!error.source.pointer.startsWith('/')) {
            error.source.pointer = `/${error.source.pointer}`;
        }
        const [, fieldName, subFields] = error.source.pointer.match(regExRegularPointer);
        const field = definition.getField(fieldName);

        if (!field) {
            systemErrors.push(error);
            return;
        }

        if (definition.isJsonField(field)) {
            this.resolveJsonField(fieldName, subFields, error, entity);
            return;
        }

        if (definition.isToManyAssociation(field)) {
            if (fieldName === 'translations') {
                this.resolveTranslation(error, definition, entity, systemErrors);
                return;
            }

            this.resolveToManyAssociationError(error, fieldName, entity[fieldName], changeset, systemErrors);
            return;
        }

        this.errorStore.addApiError(this.getErrorPath(entity, fieldName), new ShopwareError(error));
    }

    /**
     * @private
     * @param error
     * @param currentField
     * @param entityCollection
     * @param changeset
     * @param systemErrors
     */
    resolveToManyAssociationError(error, currentField, entityCollection, changeset, systemErrors) {
        const definition = EntityDefinition.get(entityCollection.entity);
        if (!definition) {
            systemErrors.push(error);
            return;
        }

        const [, associationName, index, field] = error.source.pointer.match(regExToManyAssociation);
        const associationChanges = changeset[associationName][index];
        const entity = entityCollection.get(associationChanges.id);
        error.source.pointer = field;

        this.resolveError(error, definition, entity, changeset, systemErrors);
    }

    /**
     * @private
     * @param jsonField
     * @param subFields
     * @param error
     * @param entity
     */
    resolveJsonField(jsonField, subFields, error, entity) {
        const fieldPath = `${jsonField}${subFields.replace(/\//g, '.')}`;
        this.errorStore.addApiError(this.getErrorPath(entity, fieldPath), new ShopwareError(error));
    }

    /**
     * private
     * @param error
     * @param definition
     * @param entity
     * @param systemErrors
     */
    resolveTranslation(error, definition, entity, systemErrors) {
        const match = error.source.pointer.match(regExTranslations);
        const fieldName = match[2];

        if (typeof fieldName === 'undefined') {
            if (error.code === 'MISSING-SYSTEM-TRANSLATION') {
                systemErrors.push(error);
                return;
            }
            throw new Error(
                // eslint-disable-next-line
                `[ErrorResolver] Could not resolve translation error for ${definition.entity} with id ${entity.id}. Missing field name`
            );
        }

        error.source.pointer = fieldName;

        const field = definition.getField(fieldName);
        if (!field) {
            systemErrors.push(error);
            return;
        }

        if (!definition.isTranslatableField(field)) {
            throw new Error(`[ErrorResolver] translatable field ${fieldName}`);
        }

        this.errorStore.addApiError(this.getErrorPath(entity, fieldName), new ShopwareError(error));
    }

    /**
     * @private
     * @param response
     * @returns {boolean}
     */
    isErrorDataSet(response) {
        if (!response.data) {
            return false;
        }

        return !!response.data.errors;
    }

    /**
      * @private
      */
    getErrorPath(entity, currentField) {
        return `${entity.getEntityName()}.${entity.id}.${currentField}`;
    }
}
