
var SearchFilters = function(options){
  this.options = options || {};
  var autoCompleteOptions = this.options.autoCompleteOptions || {};
  var selectCallback = this.options.selectCallback;
  var filters= this.options.filters;

  this.render= function(){
    var input = this.options.input;
    var url = this.options.json;
    $(input).keypress(function(e){
      if(e.keyCode == 58){
        var val = this.value.split(':');
        var filter= val[0].toLowerCase();
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
      .append("<div><img class='ui-item-avatar " + filter + "' src=" + item.avatar +  "><span  class='ui-item-label'>" + item.label + "</span></div>")
      .appendTo(ul);
    };

    $(input).autocomplete({
      minLength:0,
      source: data,
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
      select: function(event, ui) {
        event.preventDefault();
        $(input).val(ui.item.label);
        if(selectCallback){
          selectCallback();
        }
        clearAutocomplete(input)
      }
    };

    return _.merge({},defaultOptions,autoCompleteOptions);;
  }

  function clearAutocomplete(input){
    $(input).autocomplete( "destroy" );
    $(input).attr('autocomplete', 'off');

  }

}
