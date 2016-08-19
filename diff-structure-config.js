var fs = require('fs');
var path = require('path');

var pathStructure         = path.join(__dirname, 'data/structure.json');
var pathConfigProperties  = path.join(__dirname, 'data/config.properties.template');
var regexConfigProperties = /^([^\s]+)=[^\s]*$/gm;

var structure = JSON.parse(fs.readFileSync(pathStructure));
var configProperties = fs.readFileSync(pathConfigProperties);

var getAllMatches = function(regex, data){
  var matches = [];
  var match = regex.exec(data);
  while(match !== null) {
    matches.push(match[1]);
    match = regex.exec(data);
  }
  return matches;
};

var paramsConfigProperties = getAllMatches(regexConfigProperties, configProperties);
var paramsStructure = [];

for(var category of structure){
  for(var option of category.options){
    switch(option.type){
      case 'map':
        paramsStructure.push(option.latitude);
        paramsStructure.push(option.longitude);
        break;
      default:
        paramsStructure.push(option.name);
    }
  }
}

Array.prototype.diff = function(a) {
  return this.filter((x) => !a.includes(x));
};

console.log('-> Properties missing in structure.json');
console.log(paramsConfigProperties.diff(paramsStructure).join(', ') || '--> No properties missing');

console.log('-> Properties missing in config.properties.template');
console.log(paramsStructure.diff(paramsConfigProperties).join(', ') || '--> No properties missing');