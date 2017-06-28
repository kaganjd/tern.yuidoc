var TernYUIDoc = {};
(function() {
  "use strict";

  TernYUIDoc.generate = function(yuiDoc, options) {
    var options = options ? options : {}, name = options.name ? options.name
        : yuiDoc.project.name;
    if (!options.baseURL) {
      options.baseURL = yuiDoc.project.url;
    }
    var ternDef = {
      "!name" : name,
      "!define" : {

      }
    };
    visitDoc(yuiDoc, ternDef, options);
    return ternDef;
  };

  function visitDoc(yuiDoc, ternDef, options) {
    // loop for classitems
    for ( var i = 0; i < yuiDoc.classitems.length; i++) {
      var yuiClassItem = yuiDoc.classitems[i];
      if (isAccess(yuiClassItem)) {
        visitClassItem(yuiClassItem, yuiDoc, ternDef, options);
      }
    }
  }

  function isAccess(yuiClassItem) {
    var access = yuiClassItem["access"];
    return access != 'private' && access != 'protected';
  }

  function visitClassItem(yuiClassItem, yuiDoc, ternDef, options) {
    var moduleName = yuiClassItem["module"], className = yuiClassItem["class"], name = yuiClassItem["name"], isStatic = yuiClassItem["static"] === 1;
    var ternModule = getTernModule(moduleName, ternDef);
    var parent = null;
    if (className == 'YUI') {
      if (moduleName === 'yui') {
        parent = getTernClassOrPrototype(className, ternDef, yuiDoc, isStatic,
            options);
      } else {
        parent = ternModule;
      }
    } else {
      parent = getTernClassOrPrototype(className, ternModule, yuiDoc, isStatic,
          options);
    }

    var ternClassItem = {};
    parent[name] = ternClassItem;

    // !type
    var type = options.getType ? options.getType(moduleName, className, name,
        yuiClassItem) : null;
    if (!type)
      type = getType(yuiClassItem, yuiDoc);
    if (type)
      ternClassItem["!type"] = type;
    // !effects
    var effects = options.getEffects ? options.getEffects(moduleName,
        className, name, yuiClassItem) : null;
    if (effects) {
      ternClassItem["!effects"] = [ effects ];
    }
    // !doc
    if (yuiClassItem.description)
      ternClassItem["!doc"] = yuiClassItem.description;
    // !url
    ternClassItem["!url"] = getURL(options.baseURL, name);
  }

  function startsWith(str, prefix) {
    return str.slice(0, prefix.length) == prefix;
  }

  function endsWith(str, suffix) {
    return str.slice(-suffix.length) == suffix;
  }

  function getURL(baseURL, className, itemtype, name) {
    var url = baseURL;
    if (!endsWith(baseURL, '/')) {
      url += '/';
    }
    // url += 'classes/';
    url += className;
    // url += '.html';
    if (itemtype && name) {
      url += '#';
      url += itemtype;
      url += '_';
      url += name;
    }
    return url;
  }

  function getTernModule(moduleName, ternDef) {
    var name = moduleName.replace(/-/g, '_');
    var ternModule = ternDef["!define"][name];
    if (!ternModule) {
      ternModule = {};
      ternDef["!define"][name] = ternModule;
    }
    return ternModule;
  }

  function getTernClassOrPrototype(className, ternModule, yuiDoc, isStatic,
      options) {
    var name = className.replace(/-/g, '_');
    var ternClass = ternModule[name];
    if (!ternClass) {
      ternClass = {};
      ternModule[name] = ternClass;
      var yuiClass = yuiDoc.classes[className];
      if (yuiClass) {
        // !type
        var type = getType(yuiClass, yuiDoc);
        if (type)
          ternClass["!type"] = type;
        // !proto
        if (yuiClass["extends"])
          ternClass["!proto"] = getClassName(yuiClass["extends"], yuiDoc);
        // !doc
        if (yuiClass.description)
          ternClass["!doc"] = yuiClass.description;
        // !url
        ternClass["!url"] = getURL(options.baseURL, className);
      }
    }
    if (isStatic) {
      return ternClass;
    }
    if (!ternClass.prototype) {
      ternClass.prototype = {};
    }
    return ternClass.prototype;
  }

  function visitClass(yuiDoc, ternDef, ternModule, yuiClass, className) {
    var ternClass = createTernClass(yuiDoc, ternModule, yuiClass, className);

  }

  function createTernClass(yuiDoc, ternModule, yuiClass, className) {
    var ternClass = {};
    ternModule[className] = ternClass;
    var type = getType(yuiClass, yuiDoc);
    if (type)
      ternClass["!type"] = type;
    return ternClass;
  }

  function toTernName(yuiName) {
    var name = yuiName;
    name = name.replace(/-/g, '');
    var index = name.indexOf('*');
    if (index > 0)
      name = name.substring(0, index);
    // ex : prepend=false
    var index = name.indexOf('=');
    if (index > 0)
      name = name.substring(0, index);
    return name;
  }

  function formatType(type, isArray, isInstance) {
    var t = "";
    if (isArray) {
      t += '[';
    }
    if (isInstance && type != 'string' && type != 'bool' && type != 'number')
      t += '+';
    t += type;
    if (isArray) {
      t += ']';
    }
    return t;
  }

  function endsWith(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  function getType(yuiClass, yuiDoc) {
    var params = yuiClass.params, returnValue = yuiClass["return"], chainable = yuiClass["chainable"] === 1, isConstructor = yuiClass["is_constructor"] === 1, yuiItemtype = yuiClass["itemtype"], yuiType = yuiClass["type"];
    if (yuiItemtype === 'property') {
      return toTernType(yuiType, yuiDoc, true);
    }

    var type = 'fn(';
    if (params) {
      for ( var i = 0; i < params.length; i++) {
        var param = params[i], name = toTernName(param.name);
        if (i > 0)
          type += ', ';
        type += name;
        if (param.optional)
          type += '?';
        if (param.type) {
          type += ': ';
          type += toTernType(param.type, yuiDoc, false, param.props);
        }
      }
    }
    type += ')';
    if (chainable) {
      type += ' -> !this';
    } else if (isConstructor) {
      type += ' -> +';
      type += getClassName(yuiClass.name, yuiDoc);
    } else if (returnValue) {
      type += ' -> ';
      type += toTernType(returnValue.type, yuiDoc, true, returnValue.props);
    }
    if(endsWith(type, ',)')) {
        type = type.substr(0, type.indexOf(',)')) + ')';
    }
    return type;
  }

  function toTernType(yuiType, yuiDoc, isReturn, props) {
    if (!yuiType || yuiType === '*') {
      return '?';
    }
    // ex : Node|String
    var index = yuiType.indexOf('|');
    if (index == -1) {
      // ex : Function/Object
      index = yuiType.indexOf('/');
      if (index == -1) {
        // ex : Object*
        index = yuiType.indexOf('*');
      }
    }
    if (index > 0) {
      yuiType = yuiType.substring(0, index);
    } else {
      if (startsWith(yuiType, '{')) {
        // ex : {Object}
        yuiType = yuiType.substring(1, yuiType.length - 1);
      }
    }

    // is array?
    var isArray = false;
    index = yuiType.indexOf('[');
    if (index > 0) {
      yuiType = yuiType.substring(0, index);
      isArray = true;
    }
    yuiType = yuiType.trim();
    switch (yuiType) {
    case 'Function':
      var ternType = 'fn(';
      if (props) {

      }
      ternType += ')'
      return ternType;
    case 'String':
      return formatType('string', isArray);
    case 'Number':
      return formatType('number', isArray);
    case 'Boolean':
      return formatType('bool', isArray);
    default:
      return formatType(getClassName(yuiType, yuiDoc), isArray, isReturn);
    }
  }

  function getClassName(className, yuiDoc) {
    if (className === 'YUI') {
      return className;
    }
    var yuiClass = yuiDoc.classes[className];
    if (yuiClass && yuiClass.module) {
      return yuiClass.module.replace(/-/g, '_') + '.' + className;
    }
    return className;
  }

  function visitModule(yuiDoc, ternDef, yuiModule, moduleName) {
    var ternModule = createTernModule(ternDef, moduleName);
    for ( var className in yuiModule.classes) {
      var yuiClass = yuiDoc.classes[className];
      visitClass(yuiDoc, ternDef, ternModule, yuiClass, className);
    }
  }

})();
