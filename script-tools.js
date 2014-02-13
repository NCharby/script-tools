/* ---------------------------------------------------------------------
   ScriptTools
   Hacker: Nick Charbonneau

   Needed a script loader.
   load: appends script to the body and exicutes a callback (if provided)
   executeFunctionByName: executes function by name(string), context(object), arguments(array)
   isFunction: checks if the given object is a function. 
   ------------------------------------------------------------------------ */

HLIB.ScriptTools = {
    load: function(scriptSrc, callback, callbackContext, arguments) {
        var script = document.createElement('script'),
            self = this;
        script.type = 'text/javascript';
        script.src = scriptSrc;
        document.body.appendChild(script);
        if (callback) {
            script.onload=script.onreadystatechange=function(){
                if (  !this.readyState || this.readyState == 'complete'  ){
                    var context = callbackContext || window;
                    if(self.isFunction(callback)){
                        callback.call(callbackContext);
                    } else {
                        self.executeFunctionByName(callback, context, arguments);
                    }
                }
            };
        }
    },
    executeFunctionByName: function (functionName, context /*, args */) {
        var args = Array.prototype.slice.call(arguments, 2),
            namespaces = functionName.split("."),
            func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        return context[func].apply(context, args);
    },
    isFunction: function(object){
        return !!(object && object.constructor && object.call && object.apply);
    }
};
