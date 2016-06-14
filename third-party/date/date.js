(function(root, factory) {
    root.Date = factory(root);
})(window, function(g){
    var D,
        staticMethods = ['UTC','apply','bind','call','constructor','hasOwnProperty','isPrototypeOf','now','parse','propertyIsEnumerable','toLocaleString', 'toString', 'valueOf'];
    if(!g.Date.tag){
        D = g.Date;
        g.Date = function(){
            var len = arguments.length;
            if(this===undefined || this === g){
                return D();
            }
            if(arguments.length==1){
                if(typeof arguments[0]==='string' && arguments[0].indexOf('-')!==-1){
                    return new D(arguments[0].replace(/\-/g,'/'));
                }
            }
            switch(len){
                case 0:
                    return new D();
                case 1:
                    return new D(arguments[0]);
                case 2:
                    return new D(arguments[0], arguments[1]);
                case 3:
                    return new D(arguments[0], arguments[1], arguments[2]); 
                case 4:
                    return new D(arguments[0], arguments[1], arguments[2], arguments[3]); 
                case 5:
                    return new D(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]); 
                case 6:
                    return new D(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]); 
            }
        };
        g.Date.tag = 'hehe';
        for(var i=0,len=staticMethods.length; i<len; i++){
            g.Date[staticMethods[i]] = (function(methodName){
                return function(){
                    return D[methodName].apply(null, Array.prototype.slice(arguments,0));
                };
            })(staticMethods[i]);
        }
        g.Date.conflict = function(){
            return D;
        };
        g.Date.prototype = D.prototype;
    }
    return g.Date;
});