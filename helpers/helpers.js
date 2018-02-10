
exports.headVal = function(lvalue,rvalue, options) {
  if (lvalue == rvalue) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}

exports.plus = function(lvalue, rvalue) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
        
    return lvalue + rvalue;
}