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
type AnnotationTarget = Target.TARGET_CLASS | Target.TARGET_METHOD | Target.TARGET_PROPERTY;

/**
 * Target
 */
class Target {
    /**
     * @type {string}
     */
    static TARGET_CLASS = 'Class';

    /**
     * @type {string}
     */
    static TARGET_METHOD = 'Method';

    /**
     * @type {string}
     */
    static TARGET_PROPERTY = 'Property';

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

        throw new AnnotationTargetError(`${annotation.targetings.join(', ')} target required but ${target} given.`);
    }
}


export default function(target) {
    return function (ctx, name, descr) {
        let info = Annotation.info(ctx, name, descr);

        if (info.target === Target.TARGET_CLASS) {
            let annotation = new Target();
            annotation.targetings = target instanceof Array ? target : [target];

            new Reader(info.class).addClassAnnotation(annotation);
        }

        return descr;
    };
}
