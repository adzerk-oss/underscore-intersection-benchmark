Comparison between underscore's [intersect method](http://underscorejs.org/docs/underscore.html#section-55) and a naieve implementation cooked up by some not-so-naive engineers.

We've also added a variant of the naieve implementation that short circuits on the first match - this is not how underscore's intersection method works, but it fits our use case in bifrost more completely.

To run, 

```
$ npm install
$ node test.js
```

Example output:

```
$ node test.js
dumb intersection x 1,034,802 ops/sec ±1.18% (93 runs sampled)
underscore intersection x 236,263 ops/sec ±1.31% (91 runs sampled)
dumb intersection - short circuit x 1,262,959 ops/sec ±2.25% (89 runs sampled)
Fastest is dumb intersection - short circuit
```

The test data is randomly generated, with a few guarantees so at least one match will occur.





