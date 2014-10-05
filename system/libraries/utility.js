exports.flushMsg=function(req){
	var html='';
	if((typeof req.session.msg!='undefined') && (typeof req.session.css_class!='undefined')){
		html+='<div class='+req.session.css_class+'>'+req.session.msg+'</div>';
		}
	delete req.session.css_class;
	delete req.session.msg;
	return html;
	};
exports.slug=function(str){
	arr=['@',' ','_',"'",'"','!','#','$','%','^','&','*','(',')',':',';','/','|','+','.',',','{','}','[',']','=','~','`','?'];
	for(i=0;i<arr.length;i++){
	str=str.replace(arr[i], "-");
	}
	return str;
	};
