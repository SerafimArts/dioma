# Service locators

A simple example of service location:

```js
/* Set container globally */
(global || window).app = container;

class Test {
    constructor() {
        /* Resolving a service */
        this.foo = app.make('storage'); 
    }
}

console.log(new Test().foo); // localStorage
console.log(app.make(Test).foo); // localStorage
```
