EcmaScript6 DependencyInjecton
==============================

## Simple example:

```js
import Container from "Di/Container";

var app = new Container;

app.bind('some', 23);
app.bind('any', 42);

app.bind('test', function(some, any) {
    console.log('Some: ', some, ', Any: ', any);
});

app.make('test'); // Some: 23, Any: 42
```

## Extended example:

```js
import Container from "Di/Container";

class Example {
  constructor(value) {
    this.value = value;
  }
}

var app = new Container;

app.bind('value', 23);

app.bind('some', Example);

console.log(app.make('some')); // class Example { value: 23 }


// Factory

app.bind('some', value => {
    return new Example(value * 2 - Math.random());
})

console.log(app.make('some')); // class Example#1 { value: 45.62347846928734 }
console.log(app.make('some')); // class Example#2 { value: 45.79875934435664 }
console.log(app.make('some')); // class Example#3 { value: 45.47856398475633 }

// Singleton

app.singleton('some', value => {
    return new Example(value * 2 - Math.random());
})

console.log(app.make('some')); // class Example#4 { value: 45.32423423423436 }
console.log(app.make('some')); // class Example#4 { value: 45.32423423423436 }
console.log(app.make('some')); // class Example#4 { value: 45.32423423423436 }
```

## API:

- `.bind(alias: string|Function, concrete: Object|Function)` - Bind value as factory without resolving cache
- `.singleton(alias: string|Function, concrete: Object|Function)` - Bind value as singleton
- `.make(alias: string|Function)` - Resolve a value
- `.has(alias: string|Function)` - Bool: Service is declared in container