import Target from '../Annotation/Target';
import Annotation from '../Annotation/Annotation';


@Target('Class')
class Inject {
    /**
     * @type {Array|string[]}
     */
    dependencies: Array = [];

    /**
     * @return {Array|string[]}
     */
    getDependencies(): Array {
        return this.dependencies instanceof Array
            ? this.dependencies
            : [this.dependencies];
    }
}

export default function(args) {
    return (new Annotation(args, 'dependencies'))
        .delegate(Inject);
}
