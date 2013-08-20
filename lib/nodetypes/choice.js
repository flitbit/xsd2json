exports.getJsonNode = function(parentNode, childNode){
	if (childNode instanceof Array)
	{

	}
	else if (childNode != "null" && typeof childNode === "object")
	{
		var keys = Object.keys(childNode);
		childNode.properties = {};
		keys.forEach(function(key){
			childNode.properties[key] = childNode[key];
			delete childNode[key]; // huh?
		});

		// set base level properties
		childNode.title = childNode.name ? childNode.name : "seriously";
		childNode.type = "object";
	}
	return childNode;
}