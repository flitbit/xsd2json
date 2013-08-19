exports.getJsonNode = function(parentNode, childNode){
	if (childNode instanceof Array){
		var docs = [];
		childNode.forEach(function(node){
			if(node.documentation){
				docs.push(node.documentation[0]);
			}
		})
		return docs;
	}
	if (!childNode.documentation)
	{
		return {};
	}
	else{
		console.log("found documentation node");
		return childNode.documentation;
	}
}