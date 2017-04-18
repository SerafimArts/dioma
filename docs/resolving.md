# Resolving services

Create a container first:

```js
let container = new Container();
container.instance('storage', localStorage);
```

Then you can use service locator or DI: 
- [Service Locator](./service-locator.md)
- [Dependency Injection](./di.md)
