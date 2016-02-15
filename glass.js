var appel = {};
var appelparse = {};
appelparse.modes = {
  EXPR: Symbol.for("appelparse.mode.expr"),
  REF: Symbol.for("appelparse.mode.ref"),
  STR: Symbol.for("appelparse.mode.str"),
  STR_ESC: Symbol.for("appelparse.mode.stresc")
};
appelparse.special = ["~", ".", "^", "@"];

appel.make = function(str) {
  var m = appelparse.modes;
  var i = 0;
  var code = [];
  var ptStack = [code];
  var pt = code;
  var mode = m.EXPR;
  while (i++ < str.length) {
    switch (mode) {
      case (m.EXPR): {
        if (str[i] == "(") {
          var c = [];
          ptStack.push(c);
          pt.push(c);
          pt = c;
        }
        break;
      }
      case (m.EXPR): {
        if (str[i] == "(") {
          var c = [];
          ptStack.push(c);
          pt.push(c);
          pt = c;
        }
        break;
      }
    }
  }
  return function* {
    
  };
};
