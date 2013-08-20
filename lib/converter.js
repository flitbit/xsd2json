var xml2js = require('xml2js'),
	parser = new xml2js.Parser();

exports.convertXsdTextToJsonSchema = function(xsdText, callback){
	if (xsdText === null){
		callback(null, {});
	}
	else{
		if (typeof xsdText != "string")
		{
			callback(new Error("Can't do that.  Seriously. xsdText is ".concat(typeof xsdText), null));
		}
		else{
			modifiedText = xsdText;
			modifiedText = modifiedText.replace(/(\r\n|\n|\r)/gm,"");
			modifiedText = modifiedText.replace(/\s{2,}/g,' ');
			convertXsdTextToJavascript(modifiedText, function(err, jsXsd){
				if (err){
					callback(err);
				}
				else
				{
					var schema = getBaseSchemaObject("http://localhost/", "xmlschema");
					
					// test for valid schema converted to JSON.

					// add descriptors to show conversion XSD origin
					schema.xsdOrigin = getXsdOrigin(getXsdRoot(jsXsd));
					//TODO: get URI base location from some sort of configuration or a passed in value.  I'm thinking configuration as this will need to reference
					// other schema docs in the same space for nested XSD conversions.
					
					callback(null, schema);
				}
			});
		}	
	}
}

function getBaseSchemaObject(schemaRootURI, title){
	var schema = {};
	schema.id = schemaRootURI.concat(title).concat(".json#");
	schema["$schema"] = "http://json-schema.org/draft-04/schema#";
	schema.definitions = {};
	schema.title = title;
	schema.properties = {};

	return schema;
}

function getXsdRoot(jsXsd){
	// can't just grab the name, you can't count on xs:schema being the name.
	var keys = Object.keys(jsXsd);
	return jsXsd[keys[0]];
}

function getXsdOrigin(rootElement){
	var origin = {};
	origin.namespaces = {};
	//origin.root = rootElement;
	if (rootElement)
	{ 
		if (rootElement.$)
		{ 
			var keys = Object.keys(rootElement.$);
			keys.forEach(function(key){
				if (key.indexOf(":") > 0)
				{
					var split = key.split(":");
					if (split[0] === "xmlns")
					{
						origin.namespaces[split[1]] = rootElement.$[key];
					}
				}
			})
			if (rootElement.$["xmlns:xs"])
			{
				origin.namespaces["primary"] = rootElement.xmlns;
			}
			if (rootElement.$["targetNamespace"])
			{
				origin.targetNamespace = rootElement.$["targetNamespace"];
			}
			if (rootElement.$["elementFormDefault"])
			{
				origin.elementFormDefault = rootElement.$["elementFormDefault"];
			}
			if (rootElement.$["attributeFormDefault"])
			{
				origin.attributeFormDefault = rootElement.$["attributeFormDefault"];
			}
		}
	}
	return origin;
}

function convertXsdTextToJavascript(xsdText, callback){
	var data = parser.parseString(xsdText, function(err, data){
		if (err){
			callback(err);
		}
		callback(null, data);
	});
}

function removeNamespaces(jsobj, callback){
	if (jsobj === null || typeof jsobj != "object")
	{
		if (callback)
			callback(null, jsobj);
		return;
	}
	var keys = Object.keys(jsobj);
	keys.forEach(function(key){
		try	{
			if (jsobj[key] != null && typeof jsobj[key] === 'object'){
				removeNamespaces(jsobj[key], null);
			}
			if (key.indexOf(":") != -1){
				var newKey = key.split(":")[1];
				jsobj[newKey] = jsobj[key];
				delete jsobj[key];
			}
			
		}
		catch (err){
			debugger;
			callback(err);
		}
	});
	if (callback){
		callback(null, jsobj);
	}
	
		
}

var count = 0;

function executeConverter(jsobj, callback){
	var keys = Object.keys(jsobj);
	keys.forEach(function(key){
		executeConverterRecursive(jsobj, key, callback);
	});
}

function executeConverterRecursive(jsobj, propName, callback){
	try{
		if (!jsobj || !jsobj[propName])
		{
			if (callback){
				callback(null,{});
			}
			return;
		}
		else
		{
			var targetObj = jsobj[propName];
			var nodeConverter = null;
			try{
				// determine if a module exists for this node type
				nodeConverter = require("./nodetypes/".concat(propName));
			}
			catch(e){
				// simply means that the node converter was not found.
			}
			if (nodeConverter){
				jsobj[propName] = nodeConverter.getJsonNode(jsobj, targetObj);	
			}
			if (targetObj != null && typeof targetObj === 'object'){
				var keys = Object.keys(targetObj);
				keys.forEach(function(key){
					executeConverterRecursive(targetObj, key);
				});
			}
			if (callback){
				callback(null, jsobj);
			}
		}
	}
	catch(err){
		callback(err);
		//throw err;
	}
}