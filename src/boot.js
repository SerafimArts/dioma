import Container from "/Di/Container";
import { Inject as Injection } from "/Di/Mapping";

export default function boot() {
    window.app = function(value) {
        var app = Container.getInstance();
        return value ? app.make(value) : app;
    };

    window.Inject = Injection;
}