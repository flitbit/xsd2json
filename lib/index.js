var converter = require('./converter')
	util = require('util'),
	fs = require('fs');

var path = "./xmlschema.xsd";

fs.readFile(path, function(err, data){
	if (!err){
		converter.convertToJsonSchema(data, function(err, converted){
			console.log(util.inspect(converted ? converted : err, false, null));
			fs.writeFile('./jsonschema.json', JSON.stringify(converted, "", "\t"), function(error){
						if (error){
							throw error;
						}
					});
		});
	}
	else{
		console.log(err);
	}

});
