# Custom elements as service

## Defining a service

```js
/* Your custom service */
class MyService {
    value = Math.ceil(Math.random() * 100);
}

// Define a service
app.instance('foo', MyService);
app.instance('bar', new MyService);

// With auto name resolving
// Same with "app.instance('MyService', MyService)"
app.instance(MyService);
```

## Resolving behavior

```js
let a = app.make('foo');
console.log(a);
// > class MyService { }

let b = app.make('bar');
console.log(b);
// > object MyService { value: 23 }
```
