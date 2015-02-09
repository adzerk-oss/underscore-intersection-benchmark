var benchmark  = require('benchmark');
var _ = require("underscore");
var chance = require('chance').Chance();

var ad_keywords = ['foo', 'bar', 'baz', 'fred', 'barney', 'wilma'];
var request_keywords = ['foo', 'baz', 'betty'];
ad_keywords = ad_keywords.concat(chance.unique(chance.word, 10));
request_keywords = request_keywords.concat(chance.unique(chance.word, 3));

ad_keywords = chance.shuffle(ad_keywords);
request_keywords = chance.shuffle(request_keywords);

ad_keywords = _.map(ad_keywords, function(x){return x.toLowerCase()});
request_keywords = _.map(request_keywords, function(x){return x.toLowerCase()});



var spacer = "\n";

var regex_text = function(x, y){
    var lines = x.join(spacer);
    var regex = new RegExp("^("+y.join("|")+")$", "mi");
    
    return regex.test(lines);
};

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

var dumb = function(x, y){
    var holder = {};
    var output = [];
    
    for(var i=0; i<x.length; i++){
        holder[x[i]] = true;
    }
    
    for(var i=0; i<y.length; i++){
        var current = y[i];
        if(holder[current]){
            output.push(current);
        }
    }
    
    return output;
};

var dumb_smarter = function(x, y){
    var holder = {};
    
    for(var i=0; i<x.length; i++){
        holder[x[i]] = true;
    }
    
    for(var i=0; i<y.length; i++){
        var current = y[i];
        if(holder[current]){
            return true;
        }
    }
    
    return false;
};

var suite = new benchmark.Benchmark.Suite;

suite.add('dumb intersection', function() { 
    dumb(ad_keywords, request_keywords);
})
.add('underscore intersection',  function() { 
    _.intersection(ad_keywords, request_keywords);
})
.add('dumb intersection - short circuit',  function() { 
    dumb_smarter(ad_keywords, request_keywords);
})
.add('regex intersection',  function() { 
    regex_text(ad_keywords, request_keywords);
})
.add('substring intersection',  function() { 
    substr_text(ad_keywords, request_keywords);
})
.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
  //console.log(this);
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
});

suite.run();


