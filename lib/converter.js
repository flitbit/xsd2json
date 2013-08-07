var xml2js = require('xml2js'),
	parser = new xml2js.Parser();

exports.convertToJsonSchema = function(xsdText, callback){
	if (xsdText === null){
		callback(null, {});
	}
	else{
		convertToJavascript(xsdText, function(err, data){
			callback(err, data);
		});
	}
}

function convertToJavascript(xsdText, callback){
	var data = parser.parseString(xsdText, function(err, data){
		if (err){
			callback(err, null);
		}
		callback(null, data["xs:schema"]);
	});
}

function removeNamespaces(jsobj, callback){
	jsobj.keys.forEach(function(key){
		if (typeof jsobj[key] === 'object'){
			removeNamespaces(jsobj[key], null)
		}
		if (key.indexOf(":") != -1){
			var newKey = key.split(":")[1];
			jsobj[newKey] = jsobj[key];
			jsobj.remove(key);
		}
		
	});
	if (callback){
		callback(jsobj);
	}
}

