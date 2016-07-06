ES6 Dependency Injecton
==============================

## Simple example:

```js
import Container from "Di/Container";

var app = new Container;

app.bind('some', 23);
app.bind('any', 42);

app.bind('test', (some, any) => {
    console.log('Some: ', some, ', Any: ', any);
});

app.make('test'); // Some: 23, Any: 42
```

## Extended example:

```js
import Container from "Di/Container";

var user = null,
    app  = new Container;

class User {
    isAdmin = false;

    constructor(auth:AuthGuard) {
        this.isAdmin = auth.check();
    }
}

class AuthGuard {
    check() {
        return Math.random() > .5;
    }
}


// Was be created once
app.singleton('auth', AuthGuard);


// Runtime initialisation without binding as factory
user = app.make(User); // class User#1 { isAdmin = false; }
user = app.make(User); // class User#2 { isAdmin = true; }
user = app.make(User); // class User#3 { isAdmin = false; }
```

## API:

- `.bind(alias: string, concrete: any)` - Bind value as factory without resolving cache
- `.singleton(alias: string, concrete: any)` - Bind value as singleton
- `.make(alias: string|Function)` - Resolve a value
- `.has(alias: string|Function)` - Bool: Service is declared in container


## Building

- `npm install`
- `gulp default`

> See package.json and gulpfile.js for resolve building environment