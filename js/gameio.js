var gameio = (function() {

  var loadJS = function (jspath) {
    return $.getScript(jspath);
  };

  var loadCSS = function (csspath) {
    $('head').append('<link rel="stylesheet" href="'+csspath+'" type="text/css" />');
  }

  var fetchTemplate = function (template_path, template_name) {
    var defered = $.get(template_path);
    defered.done(function (data) {
      gamedata.templates[template_name] = data.documentElement;
    });
    return defered;
  }

  return {
    "loadJS": loadJS,
    "loadCSS": loadCSS,
    "fetchTemplate": fetchTemplate,
  }
})();
