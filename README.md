Comparison between underscore's [intersect method](http://underscorejs.org/docs/underscore.html#section-55) and a naive implementation cooked up by some not-so-naive engineers.

We've also added a variant of the naive implementation that short circuits on the first match - this is not how underscore's intersection method works, but it fits our use case in bifrost more completely.

In addition, we've implemented a search-based variant using regular expressions and simple sub-string matching.

To run, 

```
$ npm install
$ node test.js
```

Example output:

```
$ node test.js
dumb intersection                 x   263,174 ops/sec ±1.69% (92 runs sampled)
underscore intersection           x   114,146 ops/sec ±1.34% (92 runs sampled)
dumb intersection - short circuit x   319,810 ops/sec ±1.20% (93 runs sampled)
regex intersection                x 1,188,875 ops/sec ±1.83% (92 runs sampled)
substring intersection            x 2,677,300 ops/sec ±1.82% (87 runs sampled)
Fastest is substring intersection
```

The test data is randomly generated, with a few guarantees so at least one match will occur.





