Comparison between underscore's [intersect method](dualstack.awseb-e-a-awsebloa-gqp1gmbgn26p-642928257.us-east-1.elb.amazonaws.com) and a naieve implementation cooked up by some not-so-naive engineers.

To run, 

```
$ npm install
$ node test.js
```

Example output:

```
$ node test.js
dumb intersection x 1,044,711 ops/sec ±1.33% (93 runs sampled)
underscore intersection x 251,103 ops/sec ±1.34% (92 runs sampled)
Fastest is dumb intersection
```

The test data is randomly generated, with a few guarantees so at least one match will occur.



