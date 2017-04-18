Dependency Injecton Container
==============================

## Simple example

```js
import Container from "Di/Container";

let app = new Container;

app.singleton(class MyService {});

app.make('MyService'); // object MyService {}
```

## Documentation

- **Services**
    - [Factory](./docs/factory.md)
    - [Singleton](./docs/singleton.md)
    - [Instance](./docs/instance.md)
- **[Resolving](./docs/resolving.md)**
    - [Service Locator](./docs/service-locator.md)
    - [Dependency Injection](./docs/di.md)
- **Other**
    - [Annotation](./docs/annotations.md)

