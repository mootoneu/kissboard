var helper = (function() {
  var getUrlParameter = function(sParam) {
    var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
    }
  };

  var range = function(start, stop, step) {
    if (typeof stop == 'undefined') {
      // one param defined
      stop = start;
      start = 0;
    }

    if (typeof step == 'undefined') {
      step = 1;
    }

    if ((step > 0 && start > stop) || (step < 0 && start < stop)) {
      return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i <= stop : i >= stop; i += step) {
      result.push(i);
    }

    return result;
  }

  var clone = function(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /*--- PUBLIC OBJECT */
  return {
    "getUrlParameter": getUrlParameter,
    "range": range,
    "clone": clone
  };
})();
