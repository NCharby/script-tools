/* ---------------------------------------------------------------------
   ScriptTools
   Hacker: Nick Charbonneau

   Needed a script loader.
   load: appends script (single string or array) paths to the body and executes a callback (if provided) on load 
   executeFunctionByName: executes function by name(string), context(object), arguments(array)
   isFunction: checks if the given object is a function. 
   ------------------------------------------------------------------------ */

HLIB.ScriptTools = {
    load: function(scriptSrc, callback, callbackContext, arguments) {
        var self = this,
            loaded = new Array();
        
        if(!(scriptSrc instanceof Array )){
            scriptSrc = new Array(scriptSrc);
        };
        for (var i = 0; i < scriptSrc.length; i++) {
            loaded[i] = addScriptToDOM(scriptSrc[i], i);
            executeCallback(loaded[i] , i);
        }

        function addScriptToDOM(scriptSrc, index){
            var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = scriptSrc;
            document.body.appendChild(script);            
            return script;
        }
        function executeCallback(script, index){
            script.onload=script.onreadystatechange=function(){
                loaded[index] = true;
                if(callback && pollReadyStates()){
                    if (  !this.readyState || this.readyState == 'complete'  ){
                        var context = callbackContext || window;
                        if(self.isFunction(callback)){
                            callback.call(context, arguments);
                        } else {
                            self.executeFunctionByName(callback, context, arguments);
                        }
                    }
                }
            };
        }
        function pollReadyStates() {
            var _ready = true;
            for( i = 0; i < loaded.length; i++){
                if (loaded[i] !== true){ _ready = false; }
            }
            return _ready;
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