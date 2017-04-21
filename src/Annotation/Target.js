import Reader from "./Reader";
import Annotation from "./Annotation";

/**
 * Throws while annotation define over invalid (or unsupported) structure
 */
export class AnnotationTargetError extends TypeError {}

/**
 * This is a polymorfic type for annotations types
 *
 * @type {string}
 */
export type AnnotationTarget = TargetType.Class | TargetType.Method | TargetType.Property;


export class TargetType {
    /**
     * @type {string}
     */
    static Class = 'Class';

    /**
     * @type {string}
     */
    static Method = 'Method';

    /**
     * @type {string}
     */
    static Property = 'Property';
}

/**
 * Target
 */
class Target {
    /**
     * @type {Array}
     */
    targetings: AnnotationTarget = [];
}


export function check(annotationClass, imp: Object) {
    let annotation = new Reader(annotationClass).getClassAnnotation('Target');

    if (annotation) {
        for (let targeting of annotation.targetings) {
            if (targeting === imp.target) {
                return;
            }
        }

        throw new AnnotationTargetError(`${annotation.targetings.join(', ')} target required but ${imp.target} given.`);
    }
}


export default function(target) {
    return function (ctx, name, descr) {
        let info = Annotation.info(ctx, name, descr);

        if (info.target === TargetType.Class) {
            let annotation = new Target();
            annotation.targetings = target instanceof Array ? target : [target];

            new Reader(info.class).addClassAnnotation(annotation);
        }

        return descr;
    };
}
