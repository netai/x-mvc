exports.load=function(lib_name){
	this[lib_name]=require('../libraries/'+lib_name);
};
