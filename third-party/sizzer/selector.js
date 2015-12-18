(function(env){  
	var j = 0;

	function Selector(type){
		this.selector = '';
		this.type = type;
	}
	Selector.prototype = {
		add : function(c){
			this.selector += c;
		}
	};

	function Parser(selector){
		this.string = selector;
		this._pos = -1;
		this.status = Parser.ENTER_START;
		this.selectors = [];
	}

	Parser.ENTER_START = j++;
	Parser.IN_START = j++;
	Parser.ENTER_ELEMENT = j++;
	Parser.IN_ELEMENT = j++;
	Parser.ENTER_ID = j++;
	Parser.IN_ID = j++;
	Parser.ENTER_CLASS = j++;
	Parser.IN_CLASS = j++;
	Parser.ENTER_PROP = j++;
	Parser.LEAVE_PROP = j++;
	Parser.IN_PROP = j++;
	Parser.ENTER_FAKE = j++;
	Parser.IN_FAKE = j++;
	Parser.ENTER_STAR = j++;
	Parser.ENTER_CHILD = j++;
	Parser.ENTER_SLIBING = j++;
	Parser.ENTER_SLIBINGS = j++;

	Parser.prototype = {
		reset : function(){
            this._pos = -1;
            this.status = Parser.ENTER_START;
            this.selectors = [];
        },
        getChar : function(pos){
            pos || (pos = 0);
            return this.string[this._pos+pos];
        },
        nextChar : function(){
            var len = arguments.length,
                i;
            for(i=0;i<len;i++){
                this.skipChars(arguments[i]);
            }         
            return this.string[++this._pos];
        },
        skipChars : function(pattern){
            var tpl = this.string.slice(this._pos+1),
                match;
            if(typeof pattern == 'string'){
                pattern = new RegExp('^'+pattern);
            }
            try{
                match = pattern.exec(tpl);
                if(!match){
                    this._pos = this._pos + match[0].length;
                    return true;
                }else{
                    return false;
                }
            }catch(e){
                console.error('skipChars 参数必须是字符串');
                return false;
            }
        },
        prevChar : function(){
            return this.string[--this._pos];
        },
        pos : function(p){
        	this._pos += p;
        },
        parse : function(){
        	var selector, c;
        	while(c=this.nextChar()){
				switch(this.status){
					case Parser.ENTER_START:
						selector = new Selector('start');
						this.selectors.push(selector);
						this.pos(-1);
						this.status = Parser.IN_START;
						break;
					case Parser.IN_START :
						if(c === '.'){
							this.status = Parser.ENTER_CLASS;
						}else if(c === '*'){
							this.status = Parser.ENTER_STAR;
							this.pos(-1);
						}else if(c === '#'){
							this.status = Parser.ENTER_ID;
						}else if(c === '['){
							this.status = Parser.ENTER_PROP;
						}else if(c === ':'){
							this.status = Parser.ENTER_FAKE;
						}else if(c === '>'){
							this.status = Parser.ENTER_CHILD;
						}else if(c === '+'){
							this.status = Parser.ENTER_SLIBING;
						}else if(c === '~'){
							this.status = Parser.ENTER_SLIBINGS;
						}else if(/\s/.test(c)){
							
						}else{
							this.status = Parser.ENTER_ELEMENT;
							this.pos(-1);
						}
						break;
					case Parser.ENTER_CHILD:
						selector = new Selector('child');
						this.selectors.push(selector);
						this.pos(-1);
						this.status = Parser.IN_START;
						break;
					case Parser.ENTER_SLIBING:
						selector = new Selector('slibing');
						this.selectors.push(selector);
						this.pos(-1);
						this.status = Parser.IN_START;
						break;
					case Parser.ENTER_SLIBINGS:
						selector = new Selector('slibings');
						this.selectors.push(selector);
						this.pos(-1);
						this.status = Parser.IN_START;
						break;
					case Parser.ENTER_STAR :
						selector = new Selector('star');
						this.selectors.push(selector);
						if(this.getChar(1)!==' '){
							this.status = Parser.IN_START;
						}else{
							this.status = Parser.ENTER_START;
						}
						break;
					case Parser.ENTER_ID :
						selector = new Selector('id');
						this.selectors.push(selector);
						this.status = Parser.IN_ID;
						this.pos(-1);
						break;
					case Parser.IN_ID : 
						if(c === ' '){
							this.status = Parser.ENTER_START;
						}else if('.#[:>+~'.indexOf(c) !== -1){
							this.status = Parser.IN_START;
							this.pos(-1);
						}else{
							selector.add(c);
						}
						break;
					case Parser.ENTER_ELEMENT :
						selector = new Selector('element');
						this.selectors.push(selector);
						this.status = Parser.IN_ELEMENT;
						this.pos(-1);
						break;
					case Parser.IN_ELEMENT : 
						if(c === ' '){
							this.status = Parser.ENTER_START;
							this.pos(-1);
						}else if('.#[:>+~'.indexOf(c) !== -1){
							this.status = Parser.IN_START;
							this.pos(-1);
						}else{
							selector.add(c);
						}
						break;
					case Parser.ENTER_CLASS :
						selector = new Selector('class');
						this.selectors.push(selector);
						this.status = Parser.IN_CLASS;
						this.pos(-1);
						break;
					case Parser.IN_CLASS :
						if(c === ' '){
							this.status = Parser.ENTER_START;
							this.pos(-1);
						}else if('.#[:>+~'.indexOf(c) !== -1){
							this.status = Parser.IN_START;
							this.pos(-1);
						}else{
							selector.add(c);
						}
						break;
					case Parser.ENTER_PROP :
						selector = new Selector('prop');
						this.selectors.push(selector);
						this.status = Parser.IN_PROP;
						this.pos(-1);
						break;
					case Parser.IN_PROP :
						if(c === ']'){
							this.status = Parser.LEAVE_PROP;
						}else{
							selector.add(c);
						}
						break;
					case Parser.LEAVE_PROP:
						if(c === ' '){
							this.status = Parser.ENTER_START;
						}else{
							this.status = Parser.IN_START;
							this.pos(-1);
						}
						break;
					case Parser.ENTER_FAKE :
						selector = new Selector('fake');
						this.selectors.push(selector);
						this.status = Parser.IN_FAKE;
						this.pos(-1);
						break;
					case Parser.IN_FAKE :
						if(c === ' '){
							this.status = Parser.ENTER_START;
							this.pos(-1);
						}else if('.#[:>+~'.indexOf(c) !== -1){
							this.status = Parser.IN_START;
							this.pos(-1);
						}else{
							selector.add(c);
						}
						break;
				}
			}
			return this.selectors;
        }
	};

	if(env.Y){
		console.warm('node selector loaded');
	}

	env.Y = function(selector, context){
		if(!context){
			throw new Error('require context');
		}
		if(typeof selector !== 'string'){
			throw new Error('selector must be string');
		}
		var res = [],
			parts,
			i, len;
		parts = selector.match(/([^,]+)/ig);
		for(i=0, len=parts.length; i<len; i++){
			res = res.concat(seek(parts[i],context));
		}
		return duplicate(res);
	};

	env.Parser = Parser;

	function duplicate(arr){
		var res=[], i, len;
		for(var i=0,len=arr.length; i<len; i++){
			if(res.indexOf(arr[i])!==-1){
				continue;
			}
			res.push(arr[i]);
		}
		return res;
	}

	function seek(selector, context){
		var selectors = new Parser(selector).parse(),
			i, len, selector, result, isStart = true,
			type = null;
		if(context.length === undefined){
			result = [context];
		}else{
			result = context;
		}
		for(i=0, len=selectors.length; i<len; i++){
			selector = selectors[i];
			if(selector.type === 'start'){
				isStart = true;
				continue;
			}
			if(selector.type === 'star'){
				isStart = true;
			}
			if(selector.type === 'child'){
				type = 'child';
				isStart = true;
			}
			if(selector.type === 'slibing'){
				type = 'slibing';
				isStart = true;
			}
			if(selector.type === 'slibings'){
				type = 'slibings';
				isStart = true;
			}
			result = find(selector, result, isStart, type);
			type = null;
			isStart = false;
		}
		return result;
	}

	function find(selector, context, isStart, shouldFindChild){
		var i, len, res=[], c;
		if(!isStart){
			return filterElements(selector, context);
		}
		for(i=0, len=context.length; i<len; i++){
			c = context[i];
			res = res.concat(findElements(selector, c, shouldFindChild));
		}
		return res;
	}

	function filterElements(selector, elements){
		var res = [], i, len, ele;
		for(i=0, len=elements.length; i<len; i++){
			ele = elements[i];
			if(!isElement(ele)){
				continue;
			}
			switch(selector.type){
				case 'element':
					if(matchName(selector.selector.toLowerCase(), ele)){
						res.push(ele);
					}
					break;
				case 'id':
					if(matchId(selector.selector.toLowerCase(), ele)){
						res.push(ele);
					}
					break;
				case 'class':
					if(matchClass(selector.selector.toLowerCase(), ele)){
						res.push(ele);
					}
					break;
				case 'prop':
					if(matchProp(selector.selector.toLowerCase(), ele)){
						res.push(ele);
					}		
					break;
				case 'fake':
					if(matchFake(selector.selector.toLowerCase(), ele)){
						res.push(ele);
					}
					break
			}
		}
		return res;
	}

	function matchClass(selector, ele){
		var classes = (getAttr(ele, 'class')||'').split(/\s+/),
			i, len;
		for(i=0, len=classes.length; i<len; i++){
			if(selector === classes[i]){
				return true;
			}
		}
		return false;
	}

	function matchId(selector, ele){
		return selector === (getAttr(ele, 'id')||'').toLowerCase();
	}

	function matchName(selector, ele){
		var name = ele.nodeName || ele.tagName;
		return selector === (name.toLowerCase()||'');
	}

	function matchProp(selector, ele){
		var reg = /(?:\s*)?(\w+)(?:\s*)([|~])?(?:=(?:\s*)(.+))?\s*/,
			match = reg.exec(selector),
			key, value, method;
		if(!match){
			return false;
		}
		key = match[1];
		method = match[2];
		value = match[3];
		if(!key){
			throw new Error('属性选择器格式化错误');
		}
		if(method!==undefined && value===undefined){
			throw new Error('属性选择器格式化错误');
		}
		if(method===undefined && value===undefined){
			return !!getAttr(ele, key);
		}
		if(method===undefined && value!==undefined){
			return (getAttr(ele, key)||'').toLowerCase() === value;
		}
		if(method){
			switch(method){
				case '~' :
					return (getAttr(ele, key)||'').toLowerCase().indexOf(value) !== -1;
				case '|':
					return (getAttr(ele, key)||'').toLowerCase().indexOf(value) === 0;
			}
		}
	}

	function matchFake(selector, ele){
		switch(selector){
			case 'first-child':
				var f = prevSlibing(ele);
				while(f&&!isElement(f)){
					f = prevSlibing(f);
				}
				if(!f || !isElement(f)){
					return true;
				}else{
					return false;
				}
			case 'last':
				if(slibing(ele)){
					return false;
				}else{
					return true;
				}
			case 'first':
				if(prevSlibing(ele)){
					return false;
				}else{
					return true;
				}
			default:
				console.warm(':' + selector + ' not supprot');
				return true;
		}
	}

	function first(element){
		if(typeof element.firstChild === 'function'){
			return element.firstChild();
		}else{
			return element.firstChild;
		}
	}

	function isElement(ele){
		if(ele && ele.type==='text'){
			return false;
		}
		if(ele && (ele.getAttribute || ele.getAttr)){
			return true;
		}else{
			return false;
		}
	}

	function getAttr(ele, prop){
		if(ele.getAttribute){
			return ele.getAttribute(prop);
		}else if(ele.getAttr){
			return ele.getAttr(prop);
		}else{
			throw new Error('element has not getAttribute or getAttr method');
		}
	}

	function setAttr(ele, prop, value){
		if(ele.setAttribute){
			return ele.setAttribute(prop, value);
		}else if(ele.getAttr){
			return ele.setAttr(prop, value);
		}else{
			throw new Error('element has not setAttribute or setAttr method');
		}
	}

	function slibing(element){
		if(typeof element.nextSibling === 'function'){
			return element.nextSibling();
		}else{
			return element.nextSibling;
		}
	}

	function prevSlibing(element){
		if(typeof element.previousSibling === 'function'){
			return element.previousSibling();
		}else{
			return element.previousSibling;
		}
	}

	function traversal(element, func){
		if(!element){
			return;
		}
		var cur = first(element);
		while(cur){
			if(isElement(cur)){
				func(cur);
				traversal(cur, func);
			}
			cur = slibing(cur);
		}
	}

	function getChildren(ele){
		var res=[], f = first(ele);
		while(f){
			if(!isElement(f)){
				f = slibing(f);
				continue;
			}
			res.push(f);
			f = slibing(f);
		}
		return res;
	}

	function getSlibings(ele){
		var res = [], f = slibing(ele);
		while(f){
			if(!isElement(f)){
				f = slibing(f);
				continue;
			}
			res.push(f);
			f = slibing(f);
		}
		return res;
	}

	function getAttr(){}

	function findElements(selector, element, type){
		var res = [];
		if(type){
			switch(type){
				case 'child':
					return getChildren(element);
				case 'slibing':
					if(getSlibings(element).length>0){
						return [getSlibings(element)[0]];
					}else{
						return [];
					}
				case 'slibings':
					return getSlibings(element);
			}
			
		}
		switch(selector.type){
			case 'element':
				if(element.getElementsByTagName){
					return Array.prototype.slice.call(element.getElementsByTagName(selector.selector.toLowerCase()),0);
				}else if(element.getNodesByTagName){
					return Array.prototype.slice.call(element.getNodesByTagName(selector.selector.toLowerCase()),0);
				}else{
					throw new Error('element must have getElementByTagName method');
				}
			case 'id':
				traversal(element, function(ele){
					if(matchId(selector.selector.toLowerCase(), ele)){
						if(!isElement(ele)){
							return false;
						}
						res.push(ele);
						return true;
					}
				});
				break;
			case 'class':
				traversal(element, function(ele){
					if(matchClass(selector.selector.toLowerCase(), ele)){
						if(!isElement(ele)){
							return false;
						}
						res.push(ele);
					}
				});
				break;
			case 'prop':
				throw new Error('prop error, selector not support');
				break;
			case 'fake':
				throw new Error('fake error, selector not support');
				break
			case 'star':
				traversal(element, function(ele){
					if(!isElement(ele)){
						return false;
					}
					res.push(ele);
				});
				break;
		}
		return res;
	}

})(this);