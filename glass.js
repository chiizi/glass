var glass = {};
var glassparse = {};
glassparse.modes = {
  NEW: Symbol.for("glassparse.mode.expr"),
  REF: Symbol.for("glassparse.mode.ref"),
  STR: Symbol.for("glassparse.mode.str"),
  STR_ESC: Symbol.for("glassparse.mode.stresc")
};
// glassparse.special = ["~", ".", "^", "@"];

glassparse.tokenize = function(str) {
  var m = this.modes;
  var i = 0;
  var tokens = "";
  var name = "";
  var escaped = false;
  var flags = 0b00000000;
  var mode = m.NEW;
  /*\ FLAGS
  | | =====
  | | $80 - 
  | | $40 - 
  | | $20 - 
  | | $10 - 
  | | $08 - char escaped
  | | $04 - in string
  | | $02 - newlne
  | | $01 - in multichar token
  \*/
  while (i++ < str.length) {
    if (str[i] == "\\" && !(flags & 8) || flags & 8) {
      name += str[i];
    } else switch (mode) {
      case (m.NEW): {
        if (~"()\n".search(str[i])) {
          tokens.push(str[i]);
        } else if (~"^~".search(str[i])) {
          flags |= | 0b00000001;
          name += str[i];
        } else if (str[i] == "\"") {
          flags |= 0b00000101;
        } else {
          mode = m.REF;
          name += str[i];
        }
        break;
      }
      case (m.REF): {
        if (str[i] == " ") {
          tokens.push(name);
          name = "";
          mode = m.EXPR;
        } else if (str == ")") {
          tokens.push(name);
          name = "";
          tokens.push(")");
          mode = m.EXPR;
        } else {
          name += str[i];
        }
        break;
      }
      case (m.STR): {
        if (str[i] == "\"") {
          name += "\"";
          tokens.push(name);
          name = "";
          mode = m.NEW;
          if (str[i + 1] == " ") {
            i++;
          }
        } else {
          name += str[i];
        }
        break;
      }
    }
  }
  return tokens;
};
glassparse.parse = function(str) {
  var tokens = this.tokenize(str);
  
  var i = 0;
  var code = [];
  var ptrCode = [code];
  var ptr = () => ptrCode[ptrCode.length - 1];
  var t = () => tokens[i];
  var c;
  
  while (i++ < tokens.length) {
    // special, parens, symbol, string, number, ref
    if (t()[0] == "^") {
      ptr().push({
        type: "val/dyn",
        value: t().substr(1)
      });
    } else if (t() == "(") {
      c = [];
      ptr().push(c);
      ptrCode.push(ptr);
    } else if (t() == ")") {
      ptrCode.pop();
    } else if (t()[0] == "~") {
      type: "val/sym",
      value: t().substr(1)
    } else if (/^"([^\n"]|\\")*"$/g.test(t())) {
      ptr().push({
        type: "val/str",
        value: t().substr(1, t().length - 2)
      });
    } else if (/^(%([01]{8})+|@[0-8]+|[0-9]+|\$([0-9A-Fa-f]{2})+)$/g.test(t())) {
      ptr().push({
        type: "val/num",
        value: parseInt(/[0-9]/g.test(t()[0]) ? t() : t.substr(1), t()[0] == "%"
          ? 2
          : t()[0] == "@"
            ? 8
            : t()[0] == "$"
              ? 16
              : 10)
      });
    } else {
      ptr().push({
        type: "ref",
        value: t()
      });
    }
  }
};

// finish later
glass.machine = function(str) {
  var code = glassparse.parse(str);
  return function* {
    
  };
}
