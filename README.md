<p align="center">
    <img src="https://habrastorage.org/files/31e/06a/147/31e06a1477dd4892af05815567aac026.png" />
</p>

-------

Dioma is a powerful dependency injection (**DI**) container.

- [Introduction](#introduction)
- [Binding](#binding)
    - [Binding Basics](#binding-basics)
    - [Binding Interfaces To Implementations](#binding-interfaces-to-implementations)
- [Resolving](#resolving)
    - [By Service Locator](#by-service-locator)
    - [Automatic Injection](#automatic-injection)
- [Container Events](#container-events)
- [Annotations](#annotations)
    - [Read An Annotations](#read-an-annotations)
    - [Define Custom Annotations](#define-custom-annotations)

    
# Introduction

The Dioma service container is a powerful tool for managing class 
dependencies and performing dependency injection. 
Dependency injection is a fancy phrase that essentially 
means this: class dependencies are "injected" into the 
class via the constructor or, in some cases, "setter" methods.

Let's look at a simple example:

```js
@Inject(UserRepository)
class UserViewModel {
    /**
     * @param {UserRepository} users
     */
    constructor(users) {
        this._users = users;
    }
    
    /**
     * @type {number} id
     */
    show(id) {
        console.log(this._users.find(id));
    }
}
```
 
> #### Note
>
> UserRepository is an example of your dependency.

In this example, the `UserViewModel` needs to retrieve users 
from a data source. So, we will inject a service that 
is able to retrieve users. In this context, our `UserRepository` retrieve user 
information from the any storage by ID. 
However, since the repository is injected, we are able to 
easily swap it out with another implementation. 
We are also able to easily "mock", or create a 
dummy implementation of the `UserRepository` when testing our application.

A deep understanding of the Dioma service container is essential to building a 
powerful, large application.

> #### Attention!
>
> If you use JS minifiers be sure what you **do not compress class names**. 
> As example: 
> ```js
> new webpack.optimize.UglifyJsPlugin({ 
>     mangle: { keep_fnames: true } 
> })
> ```

# Binding

## Binding Basics

Firstly you must create a `Container` instance. 
This can be implemented, for example, like this:

```js
import {Container} from 'dioma';

(global || window).app = new Container;
```

### Factories

We can register a binding using the `factory` method, 
passing the name of your factory method that we wish to register 
along with a anonymous `function` that returns any value:

```js
app.factory('random', container => Math.random());

app.get('random'); // 0.42
app.get('random'); // 0.23
```

> #### Note
> 
> We receive the container itself as an argument to the resolver. 
> We can then use the container to resolve sub-dependencies 
> of the object we are building.

### Binding A Singleton

The `singleton` method binds an any value into the container 
that should only be resolved one time. Once a singleton binding is resolved, 
the same object instance will be returned on subsequent calls into the container:

```js
app.singleton('storage', container => localStorage);

app.get('storage'); // localStorage
app.get('storage') === app.get('storage'); // true
```

### Binding Instances

You may also bind an existing object instance into the 
container using the `instance` method. 
The given instance will always be returned on 
subsequent calls into the container:

```js
app.instance('storage', localStorage);

app.get('storage') === app.get('storage'); // true
```

The `instance` binding create a service "as is":

```js
app.instance('storage', container => localStorage);

app.get('storage'); // > function(container) { return localStorage; } 
```

### Automatically naming

You can reduce the define of all the above 
methods by automatically extracting the name from a class or object:

```js
app.factory(UserRepository);
app.get('UserRepository'); // > UserRepository

app.instance(localStorage);
app.get('localStorage'); // > localStorage
```

Unpacking when getting the service works too:

```js
app.factory(UserRepository);
app.get(UserRepository); // > UserRepository
```

## Binding Interfaces To Implementations

A very powerful feature of the service container 
is its ability to bind an interface to a given implementation. 
For example, let's assume we have an `Stroage` 
"interface" and a `LocalStorage` implementation.
 
Create this services:

```js
class Storage {
    get(key) {
        throw new TypeError('Can not call an abstract method "get"');
    }
}

class LocalStorage extends Storage {
    get(key) {
        return localStorage.get(key) || null;
    }
}
```

And use is:
```js
app.singleton(Storage, LocalStorage);

// ....

@Inject(Storage)
class UsersViewModel {
    constructor(storage) {
        console.log(storage.get('some'));
    }
}
```

# Resolving

## By Service Locator

You may use the three method to resolve a class instance out of the container. 
- `app.get(Example)` - returns your service if `Example` are exists or throws an error otherwise.
- `app.make(Example)` - returns your service if `Example` are exists or automatically define it as `factory`.
- `app.makeWith(Example, ['dependeny', ...])` - same with make but you can overwrite injections of your service (second argument).

## Automatic Injection

Alternatively, and importantly, you may simply define annotation `Inject` the dependency 
in the top of a class that is resolved by the container. 
In practice, this is how most of your objects should be resolved by the container.

For example, you may type-hint a repository defined by your application 
in a view-model's constructor. The repository will automatically 
be resolved and injected into the class:

```js
@Inject(UserRepository)
class UserViewModel {
    /**
     * @param {UserRepository} users
     */
    constructor(users) {
        this._users = users;
    }
    
    /**
     * @type {number} id
     */
    show(id) {
        console.log(this._users.find(id));
    }
}
```

# Container Events

The service container fires an event each time it resolves an object. 
You may listen to this event using the `resolving` method:

```js
app.resolving((serviceName, service) => {
    // Called when container resolves an dependency of any type...    
});

app.resolving('name', service => {
    // Called when container resolves objects of type "name"...
});
```

# Annotations

## Read An Annotations

To read the annotations, you can use the `Reader` class, which is 
fully compatible with the standard of TypeScript `Reflect.metadata`.

```js
import { Reader } from 'dioma';

@Inject('some')
class Test {
    myProperty = 23;
    myMethod() {}
}

let reader = new Reader(Test);

// Read

reader.getClassAnnotations(); // [ Inject ]
reader.getClassAnnotation('Inject'); // [ Inject ]

reader.getMethodAnnotations('myMethod'); // [ ]
reader.getMethodAnnotation('myMethod', 'Inject'); // [ ]

reader.getPropertyAnnotations('myProperty'); // [ ]
reader.getPropertyAnnotation('myProperty', 'Inject'); // [ ]
```

Just as you can add them in the imperative style. Like this:

```js
reader.addClassAnnotation(new SomeAnnotation);
reader.addMethodAnnotation('myMethod', new SomeAnnotation);
reader.addPropertyAnnotation('myProperty', new SomeAnnotation);
```

## Define Custom Annotations

### Creating An Annotation
 
```js
import { Target, Annotation } from 'dioma';

// This annotation can only be on classes
@Target(['Class'])
class MyAnnotation {
    // The annotation contains only one field "some"
    some = null;
}

export default function(args) {
    // The second argument contains the name of the default annotation field 
    return new Annotation(args, 'some') 
        .delegate(MyAnnotation);
};
```

### Declaration

```js
@MyAnnotation({ some: 23 }) // > object MyAnnotation { some: 23 }
class Foo {}

@MyAnnotation(23) // > object MyAnnotation { some: 23 }
class Bar {}
```

### Usage

```js
import MyAnnotation from '...';

@MyAnnotation(42) // Ok
class Test {
    @MyAnnotation(42) // Error: Unavailable annotation target "Property"
    myProperty = 'any';
    
    @MyAnnotation(42) // Error: Unavailable annotation target "Method"
    myMethod() {        
    }
}
```