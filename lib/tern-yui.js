(function() {
  "use strict";

  var YUI = TernYUIDoc.YUI = {};

  YUI.generate = function(yuiDoc) {
    var options = {
      "name" : "yui",
      "getEffects" : getEffects,
      "getType" : getType,
      "baseURL" : "https://p5js.org/reference/#/p5/"
    };
    return TernYUIDoc.generate(yuiDoc, options);
  }

  function getEffects(moduleName, className, name, yuiClassitem) {
    if (moduleName === 'yui' && className === 'YUI') {
      if (name === 'add')
        return 'custom yui_add';
      if (name === 'use')
        return 'custom yui_use';
    }
  }

  function getType(moduleName, className, name, yuiClassitem) {
    if (moduleName === 'node' && className === 'Node' && name == 'on') {
      // fn(type: string, fn: fn(), context?: yui.Object, arg?: Any) ->
      // +event_custom.EventHandle
      return 'fn(type: string, fn: fn(e: +event.DOMEventFacade), context?: ?, arg?: ?) -> +event_custom.EventHandle';
    }
  }

})();
