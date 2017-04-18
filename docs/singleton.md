# Service as singleton

## Defining a service

```js
/* Your custom service */
class MyService {
    value = Math.ceil(Math.random() * 100);
}

// Define a service
app.singleton('foo', MyService);

// With auto name resolving
// Same with "app.singleton('MyService', MyService)"
app.singleton(MyService);
```

## Resolving behavior

```js
let a = app.make('foo');
console.log(a);
// > object MyService { value: 23 }

let b = app.make('foo');
console.log(b);
// > object MyService { value: 23 }

console.log(a === b); 
// >  true
```
