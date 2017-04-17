Dependency Injecton Container
==============================

## Simple example:

```js
import Container from "Di/Container";

let app = new Container;

app.singleton(class MyService {})

app.make('MyService'); // object MyService {}
```

### Define a services

```js
let app = new Container('~/some/');

app.singleton(class ServiceClass {});
// app.make(ServiceClass)
//  or
// app.make('ServiceClass')

app.singleton('my-service', ServiceClass);
// app.make('my-service')

app.singleton('Service/Name'); 
// Will be required `~/some/Service/Name`
// app.make('Name');

app.singleton('my-service', 'Service/Name'); 
// Will be required `~/some/Service/Name`
// app.make('my-service');

// Factories same with `.singleton(...)` method
app.factory(...); 
```

### Dependency resolving

```js
app.singleton(class Service {});
app.make(MyClass);

// -------------

@Inject('Service')
class MyClass {
    constructor(service) {
        console.log(service);
        // >> "object Service {}"
    }
}
```

## Annotations

### Define an annotation

```js
import Target from './Annotation/Target';
import Annotation from './Annotation/Annotation';

@Target(['Method', 'Property'])
class MyAnnotation {
    some = 23;
}

export default function(args) {
    return new Annotation(args).delegate(MyAnnotation);
};
```

### Use annotations

```js
import MyAnnotation from "./MyAnnotation";

@MyAnnotation({ some: 42 }) // Error: Unavailable annotation target "Class"
class Test {
    @MyAnnotation({ some: 42 }) // Ok 
    myProperty = 'any';
    
    @MyAnnotation({ some: 42 }) // Ok
    myMethod() {        
    }
}
```

### Read annotations

Annotation reader is fully compatible with TypeScript `Reflect.metadata`.

```js
import Reader from "./Annotation/Reader";

let reader = new Reader(Test);

// Read

reader.getClassAnnotations(); // []
reader.getClassAnnotation('MyAnnotation'); // []

reader.getMethodAnnotations('myMethod'); // [ MyAnnotation ]
reader.getMethodAnnotation('myMethod', 'MyAnnotation'); // [ MyAnnotation ]

reader.getPropertyAnnotations('myProperty'); // [ MyAnnotation ]
reader.getPropertyAnnotation('myProperty', 'MyAnnotation'); // [ MyAnnotation ]

// Write

reader.addClassAnnotation(new SomeAnnotation);
reader.addMethodAnnotation('myMethod', new SomeAnnotation);
reader.addPropertyAnnotation('myProperty', new SomeAnnotation);
```