(function(){
	if(window.LocalModule){
		return;
	}

	var modules = {};
	var tasks = [];

	function isAllLoaded(requires){
		for(var i=0, len=requires.length; i<len; i++){
			if(!modules[requires[i]]){
				return false;
			}
		}
		return true;
	}

	function getModules(requires){
		var res = [];
		for(var i=0, len=requires.length; i<len; i++){
			if(modules[requires[i]]){
				res.push(modules[requires[i]]);
			}
		}
		return res;
	}

	function checkTask(){
		var task;
		for(var i=0,len=tasks.length;i<len; i++){
			task = tasks[i];
			if(!task){
				continue;
			}
			if(isAllLoaded(task.requires)){
				task.callback.apply(null,getModules(task.requires));
				tasks[i] = null;
			}
		}
	}

	function _define(moduleName, requires, callback){
		if(typeof requires === 'function'){
			callback = requires;
			requires = [];
		}
		if(!isAllLoaded(requires)){
			for(var i=0,len=requires.length; i<len; i++){
				for(var j=0,jlen = tasks.length; j<jlen; j++){
					if(requires.indexOf(tasks[j].name)!==-1 && tasks[j].requires.indexOf(moduleName)!==-1){
						throw new Error('module "'+moduleName+'" and "'+tasks[j].name+'" has circular references');
					}
				}
			}
		}
		_require(requires, function(){
			modules[moduleName] = callback.apply(null, arguments);
		}, moduleName);
	}

	function _require(requires, callback, _moduleName){
		if(isAllLoaded(requires)){
			callback.apply(null, getModules(requires));
		}else{
			tasks.push({
				requires : requires,
				callback : callback,
				name : _moduleName
			});
		}
		checkTask();
	}

	window.LocalModule = {
		define : _define,
		require : _require
	};

})();