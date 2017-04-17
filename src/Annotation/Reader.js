/**
 * Metadata key for all class annotations
 *
 * @type {Symbol}
 */
const METADATA_CLASS    = Symbol('METADATA_CLASS');

/**
 * Metadata key for all method annotations
 *
 * @type {Symbol}
 */
const METADATA_METHOD   = Symbol('METADATA_METHOD');

/**
 * Metadata key for all property annotations
 *
 * @type {Symbol}
 */
const METADATA_PROPERTY = Symbol('METADATA_PROPERTY');

/**
 * Default name for read polymorfic structures, like:
 *
 * <code>
 * class_metadata {
 *      DEFAULT_META_KEY: [ Annotation ]
 * }
 * property_metadata {
 *      propertyA: [ Annotation ]
 *      propertyB: [ Annotation, Annotation ]
 * }
 * method_metadata {
 *      methodA: [ Annotation, Annotation ]
 *      methodB: [ Annotation ]
 * }
 * </code>
 *
 * @type {string}
 */
const DEFAULT_META_KEY = Symbol('default');

/**
 * This is annotations reader class over Reflect Metadata API
 */
export default class Reader {
    /**
     * @type {Function}
     * @private
     */
    _class: Function;

    /**
     * @param {Function} _class
     */
    constructor(_class: Function) {
        this._class = _class;
    }

    /**
     * @param type
     * @param key
     * @private
     */
    _boot(type, key = DEFAULT_META_KEY) {
        let data = Reflect.getMetadata(type, this._class) || {};

        if (typeof data[key] === 'undefined') {
            data[key] = [];
            Reflect.defineMetadata(type, data, this._class);
        }
    }

    /**
     * @param {*} type
     * @param {string} key
     * @return {Array}
     */
    getMetadata(type: any, key: string = DEFAULT_META_KEY): Array {
        this._boot(type, key);

        let items = Reflect.getMetadata(type, this._class)[key];

        // Be sure for items array are immutable
        return items.slice(0);
    }

    /**
     * @param {*} type
     * @return {Array}
     */
    getMetadataKeys(type: any): Array {
        this._boot(type);

        let result = [];
        let items  = Reflect.getMetadata(type, this._class);

        for (let key of Object.keys(items)) {
            if (key !== DEFAULT_META_KEY) {
                result.push(key);
            }
        }

        return result;
    }

    /**
     * @return {Array}
     */
    getMethodsMetadataKeys(): Array {
        return this.getMetadataKeys(METADATA_METHOD);
    }

    /**
     * @return {Array}
     */
    getPropertiesMetadataKeys(): Array {
        return this.getMetadataKeys(METADATA_PROPERTY);
    }

    /**
     * @param {Object} annotation
     * @param {*} type
     * @param {string} key
     * @return {void}
     */
    addMetadata(annotation: Object, type: any, key: string = DEFAULT_META_KEY): void {
        this._boot(type, key);

        let data  = Reflect.getMetadata(type, this._class);
        let items = data[key];

        items.push(annotation);

        Reflect.defineMetadata(type, data, this._class);
    }

    /**
     * @return {Array}
     */
    getClassAnnotations(): Array {
        return this.getMetadata(METADATA_CLASS);
    }

    /**
     * @param {string} annotationName
     * @return {Object|null}
     */
    getClassAnnotation(annotationName: string): ?Object {
        for (let annotation of this.getClassAnnotations()) {
            if (annotation.constructor.name === annotationName) {
                return annotation;
            }
        }

        return null;
    }

    /**
     * @param {Object} annotation
     * @return {Reader}
     */
    addClassAnnotation(annotation: Object): Reader {
        this.addMetadata(annotation, METADATA_CLASS);

        return this;
    }

    /**
     * @param {string|null} methodName
     * @return {Array}
     */
    getMethodAnnotations(methodName: ?string = null): Array {
        if (methodName === null) {
            let result = [];

            for (let method of this.getMetadataKeys(METADATA_METHOD)) {
                result.push(this.getMethodAnnotations(method));
            }

            return result;
        }

        return this.getMetadata(METADATA_METHOD, methodName);
    }

    /**
     * @param {string} annotationName
     * @param {string|null} methodName
     * @return {Object|null}
     */
    getMethodAnnotation(annotationName: string, methodName: ?string = null): ?Object {
        let properties = methodName === null
            ? this.getMethodAnnotations()
            : [ this.getMethodAnnotations(methodName) ];


        for (let annotations of properties) {
            for (let annotation of annotations) {
                if (annotation.constructor.name === annotationName) {
                    return annotation;
                }
            }
        }

        return null;
    }

    /**
     * @param {string} methodName
     * @param {Object} annotation
     * @return {Reader}
     */
    addMethodAnnotation(methodName: string, annotation: Object): Reader {
        this.addMetadata(annotation, METADATA_METHOD, methodName);

        return this;
    }

    /**
     * @param {string|null} propertyName
     * @return {Generator}
     */
    getPropertyAnnotations(propertyName: ?string = null): Array {
        if (propertyName === null) {
            let result = [];

            for (let property of this.getMetadataKeys(METADATA_PROPERTY)) {
                result.push(this.getPropertyAnnotations(property));
            }

            return result;
        }

        return this.getMetadata(METADATA_PROPERTY, propertyName);
    }

    /**
     * @param {string} annotationName
     * @param {string|null} propertyName
     * @return {Object|null}
     */
    getPropertyAnnotation(annotationName: string, propertyName: ?string = null): ?Object {
        let properties = propertyName === null
            ? this.getPropertyAnnotations()
            : [ this.getPropertyAnnotations(propertyName) ];


        for (let annotations of properties) {
            for (let annotation of annotations) {
                if (annotation.constructor.name === annotationName) {
                    return annotation;
                }
            }
        }

        return null;
    }

    /**
     * @param {string} propertyName
     * @param {Object} annotation
     * @return {Reader}
     */
    addPropertyAnnotation(propertyName: string, annotation: Object): Reader {
        this.addMetadata(annotation, METADATA_PROPERTY, propertyName);

        return this;
    }
}
