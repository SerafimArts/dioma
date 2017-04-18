# Dependency Injection

```js
@Inject('storage')
class Test {
    constructor(storage) {
        this.foo = storage;
    }
}

console.log(new Test(sessionStorage).foo); // sessionStorage
console.log(app.make(Test).foo); // localStorage
```
