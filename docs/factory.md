# Service factories

## Defining a service

```js
/* Your custom service */
class MyService {
    value = Math.ceil(Math.random() * 100);
}

// Define a service
app.factory('foo', MyService);

// With auto name resolving
// Same with "app.factory('MyService', MyService)"
app.factory(MyService);
```

## Resolving behavior

```js
let a = app.make('foo');
console.log(a);
// > object MyService { value: 23 }

let b = app.make('foo');
console.log(b);
// > object MyService { value: 42 }

console.log(a === b); 
// >  false
```
