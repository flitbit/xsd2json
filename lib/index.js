var converter = require('./converter')
	util = require('util'),
	fs = require('fs');

var path = "./xmlschema.xsd";

fs.readFile(path, function(err, data){
	if (!err){
		converter.convertXsdTextToJsonSchema(data.toString("utf-8"), function(err, converted){
			if (err){
				debugger;
				console.log("Error!");
				console.log(err.toString());
				return;
			}
			//console.log(util.inspect(converted, false, null));
			fs.writeFile('./jsonschema.json', JSON.stringify(converted, "", "\t"), function(error){
						if (error){
							throw error;
						}
					});
		});
	}
	else{
		console.log(util.inspect(err, false, null));
	}

});
