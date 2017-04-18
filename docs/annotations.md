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
