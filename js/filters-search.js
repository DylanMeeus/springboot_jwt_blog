
var SearchFilters = function(options){
  this.options = options || {};
  var autoCompleteOptions = this.options.autoCompleteOptions || {},
      selectCallback = this.options.selectCallback,
      filters= this.options.filters;

  this.render= function(){
    var input = this.options.input,
        url = this.options.json;
    $(input).keypress(function(e){
      if(e.keyCode == 58){
        var val = this.value.split(':'),
            filter= val[0].toLowerCase();
        if(filters.indexOf(filter) >-1){
          fillMenu(input, filter, url);
        }else{
          if ($(this).hasClass("ui-autocomplete-input")) {
            clearAutocomplete(this);
          };
        }
      }
    });
  }

  function fillMenu (input, filter, url) {
    $.get(url).then(function(res){
       var data = res[filter];
       if(data != undefined){
         autocompleteInit(input, data, filter);
       }
     });
  }

  function autocompleteInit(input, data, filter){
    var renderItem = function(ul, item) {
      return $("<li>")
      .append("<div><img class='ui-item-avatar " + filter + "' src=" + item.avatar +
              "><span  class='ui-item-label'>" + item.label + "</span></div>")
      .appendTo(ul);
    };

    $(input).autocomplete({
      minLength:0,
      source: data,
      open: widgetCss,
      select: function(event, ui) {
        event.preventDefault();
        $(input).val(ui.item.label);
        if(selectCallback){
          selectCallback();
        }
        clearAutocomplete(input)
      }
    }).keypress(function(){
      $(input).autocomplete(optionsMerge(input, data)).autocomplete( "instance" )._renderItem = renderItem
    }).autocomplete( "instance" )._renderItem = renderItem
    $(input).autocomplete('search', '');
  }

  function optionsMerge(input, data){
    var defaultOptions = {
      source: function(request, response) {
          var val = request.term.match(/([a-zA-Z]+)\:(.+)/);
          if(val==null){
            clearAutocomplete(input);
            return false;
          }else{
            var filter= val[1].toLowerCase();
            if(filters.indexOf(filter) == -1){
              clearAutocomplete(input);
              return false;
            }
          };
          var matcher = new RegExp($.ui.autocomplete.escapeRegex( val[2] ), "i" );
          response($.grep( data, function( item ){
            return matcher.test( item.label );
          }));
      },
      minLength: 0,
      open: widgetCss,
      select: function(event, ui) {
        event.preventDefault();
        $(input).val(ui.item.label);
        if(selectCallback){
          selectCallback();
        }
        clearAutocomplete(input)
      }
    };

    return _.merge({},defaultOptions,autoCompleteOptions);
  }

  function widgetCss() {
    $(this).autocomplete("widget").appendTo(".search-bar");
    var position = $(".search-bar").position(), left = position.left, top = position.top;
    $(".search-bar > ul").css({ left: left + 0 + "px", top: top + 55 + "px" });
  }

  function clearAutocomplete(input){
    $(input).autocomplete( "destroy" );
    $(input).attr('autocomplete', 'off');
  }

}
