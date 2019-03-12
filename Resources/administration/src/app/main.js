/** Application Bootstrapper */
import { Application } from 'src/core/shopware';

/** Initializer */
import initializers from 'src/app/init';

/** Services */
import MenuService from 'src/app/service/menu.service';
import LoginService from 'src/core/service/login.service';
import JsonApiParser from 'src/core/service/jsonapi-parser.service';
import ValidationService from 'src/core/service/validation.service';
import MediaUploadService from 'src/core/service/media-upload.service';
import RuleConditionService from 'src/app/service/rule-condition.service';
import ProductStreamConditionService from 'src/app/service/product-stream-condition.service';
import StateStyleService from 'src/app/service/state-style.service';
import AttributeService from 'src/app/service/attribute.service';
import 'src/app/decorator/condition-type-data-provider';
import 'src/app/decorator/state-styling-provider';

/** Import global styles */
import 'src/app/assets/scss/all.scss';

const factoryContainer = Application.getContainer('factory');

// Add initializers
Object.keys(initializers).forEach((key) => {
    const initializer = initializers[key];
    Application.addInitializer(key, initializer);
});

// Add service providers
Application
    .addServiceProvider('menuService', () => {
        return MenuService(factoryContainer.module);
    })
    .addServiceProvider('loginService', () => {
        const initContainer = Application.getContainer('init');
        return LoginService(initContainer.httpClient, initContainer.contextService);
    })
    .addServiceProvider('jsonApiParserService', () => {
        return JsonApiParser;
    })
    .addServiceProvider('validationService', () => {
        return ValidationService;
    })
    .addServiceProvider('mediaUploadService', () => {
        const init = Application.getContainer('service');
        return MediaUploadService(init.mediaService);
    })
    .addServiceProvider('ruleConditionDataProviderService', () => {
        return RuleConditionService();
    })
    .addServiceProvider('productStreamConditionService', () => {
        return ProductStreamConditionService();
    })
    .addServiceProvider('attributeDataProviderService', () => {
        return AttributeService();
    })
    .addServiceProvider('stateStyleDataProviderService', () => {
        return StateStyleService();
    });
