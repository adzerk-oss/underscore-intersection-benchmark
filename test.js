// module imports
var benchmark  = require('benchmark');
var _ = require("underscore");
var chance = require('chance').Chance();

/** Setup - data used by all tests **/

// worst-case scenario - keyword match at the very end of both arrays
var worst_case = {
    ad: chance.unique(chance.word, 40).concat(['foo']),
    req: chance.unique(chance.word, 20).concat(['foo'])
};

// best-case scenario - keyword match at the very beginning of both arrays
var best_case = {
    ad: ['foo'].concat(chance.unique(chance.word, 40)),
    req: ['foo'].concat(chance.unique(chance.word, 20))
};

// random distribution
var random = {
    ad: chance.shuffle(worst_case.ad),
    req: chance.shuffle(worst_case.req)
};

// an obvious implementation
var obvious = function(x, y){
  for(var i=0; i<x.length; i++){
    for(var j=0; j<y.length; j++){
      if(y[j] == x[i]){
        return true;
      }
    }
  }
  
  return false;
};

// an obvious implementation, with some enhancements for
// better performance
var obvious_optimized = function(x, y){
  var holder = {};
  
  for(var i=0; i<x.length; i++){
    holder[x[i]] = true;
  }
  
  for(var i=0; i<y.length; i++){
    if(holder[y[i]]){
        return true;
    }
  }
  
  return false;
};

// an obvious implemention using underscore
var using_underscore = function(x, y){
  return _.intersection(x, y).length > 0;
};

/** Use substring matching instead of looping **/

// establish a reserved unicode character to use as a separator
var spacer = "\u001c";

// use a regular expression
var regex_text = function(x, y){
  var lines = x.join(spacer);
  var regex = new RegExp("^("+y.join("|")+")$", "mi");
  
  return regex.test(lines);
};

// use a simple substring match
var substr_text = function(x, y){
  var lines = spacer+x.join(spacer)+spacer;
  for(var i=0; i<y.length; i++){
    var current = y[i];
    if(lines.indexOf(spacer+current+spacer) >= 0){
      return true;
    }
  }
  
  return false
};

// wrapper that inverts the values so the shortest one is first
var shortest_first = function(x, y, func){
    if (x.length < y.length){
        func(x, y);
    } else {
        func(y, x);
    }
}

var suite_best_case = new benchmark.Benchmark.Suite;
var suite_worst_case = new benchmark.Benchmark.Suite;
var suite_random = new benchmark.Benchmark.Suite;
var suite_inverted_best_case = new benchmark.Benchmark.Suite;
var suite_inverted_worst_case = new benchmark.Benchmark.Suite;
var suite_inverted_random = new benchmark.Benchmark.Suite;

suite_random.add("obvious, random", function() {
  obvious(random.ad, random.req);
})
.add("obvious - optimized, random", function() {
  obvious_optimized(random.ad, random.req);
})
.add("underscore, random", function() {
  using_underscore(random.ad, random.req);
})
.add("substring - regular expression, random", function() {
  regex_text(random.ad, random.req);
})
.add("substring - simple match, random", function() {
  substr_text(random.ad, random.req);
})
.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
});

suite_best_case.add("obvious, best_case", function() {
  obvious(best_case.ad, best_case.req);
})
.add("obvious - optimized, best_case", function() {
  obvious_optimized(best_case.ad, best_case.req);
})
.add("underscore, best_case", function() {
  using_underscore(best_case.ad, best_case.req);
})
.add("substring - regular expression, best_case", function() {
  regex_text(best_case.ad, best_case.req);
})
.add("substring - simple match, best_case", function() {
  substr_text(best_case.ad, best_case.req);
})
.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
});

suite_worst_case.add("obvious, worst_case", function() {
  obvious(worst_case.ad, worst_case.req);
})
.add("obvious - optimized, worst_case", function() {
  obvious_optimized(worst_case.ad, worst_case.req);
})
.add("underscore, worst_case", function() {
  using_underscore(worst_case.ad, worst_case.req);
})
.add("substring - regular expression, worst_case", function() {
  regex_text(worst_case.ad, worst_case.req);
})
.add("substring - simple match, worst_case", function() {
  substr_text(worst_case.ad, worst_case.req);
})
.add("substring - simple match, worst_case", function() {
  shortest_first(worst_case.ad, worst_case.req, obvious);
})
.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
});

suite_inverted_worst_case.add("SHORTEST FIRST: obvious, worst_case", function() {
  shortest_first(worst_case.ad, worst_case.req, obvious);
})
.add("SHORTEST FIRST: obvious - optimized, worst_case", function() {
  shortest_first(worst_case.ad, worst_case.req, obvious_optimized);
})
.add("SHORTEST FIRST: underscore, worst_case", function() {
  shortest_first(worst_case.ad, worst_case.req, using_underscore);
})
.add("SHORTEST FIRST: substring - regular expression, worst_case", function() {
  shortest_first(worst_case.ad, worst_case.req, regex_text);
})
.add("SHORTEST FIRST: substring - simple match, worst_case", function() {
  shortest_first(worst_case.ad, worst_case.req, substr_text);
})
.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
});

suite_inverted_random.add("SHORTEST FIRST: obvious, random", function() {
  shortest_first(random.ad, random.req, obvious);
})
.add("SHORTEST FIRST: obvious - optimized, random", function() {
  shortest_first(random.ad, random.req, obvious_optimized);
})
.add("SHORTEST FIRST: underscore, random", function() {
  shortest_first(random.ad, random.req, using_underscore);
})
.add("SHORTEST FIRST: substring - regular expression, random", function() {
  shortest_first(random.ad, random.req, regex_text);
})
.add("SHORTEST FIRST: substring - simple match, random", function() {
  shortest_first(random.ad, random.req, substr_text);
})
.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
});

suite_inverted_best_case.add("SHORTEST FIRST: obvious, best_case", function() {
  shortest_first(best_case.ad, best_case.req, obvious);
})
.add("SHORTEST FIRST: obvious - optimized, best_case", function() {
  shortest_first(best_case.ad, best_case.req, obvious_optimized);
})
.add("SHORTEST FIRST: underscore, best_case", function() {
  shortest_first(best_case.ad, best_case.req, using_underscore);
})
.add("SHORTEST FIRST: substring - regular expression, best_case", function() {
  shortest_first(best_case.ad, best_case.req, regex_text);
})
.add("SHORTEST FIRST: substring - simple match, best_case", function() {
  shortest_first(best_case.ad, best_case.req, substr_text);
})
.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
});


suite_random.run();
suite_best_case.run();
suite_worst_case.run();
suite_inverted_best_case.run();
suite_inverted_worst_case.run();
suite_inverted_random.run();
