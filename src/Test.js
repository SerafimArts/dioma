import {Inject} from "/Di/Mapping";
import {default as Container} from "/Di/Container";

export default class Test {
    @Inject(Container)
    some(some) {

    }
}

