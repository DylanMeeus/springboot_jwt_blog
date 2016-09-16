
$(document).ready(function() {
  function toggle_search(active){
    if(active){
      $('#archive-container').hide();
      $('#search').show();
    }else{
      $('#archive-container').show();
      $('#search').hide();
    }
  };

  $('#search-input').focus( function() {
    $('.search-icon').hide();
  });

  $('#search-input').blur( function() {
    $('.search-icon').show();
  });

  $('#search-input').keyup(function(e){
    if (e.keyCode == 13){
      return false;
    };
    if(this.value === '' || e.keyCode == 27 ){
      toggle_search(false);
      $('#close-search').hide();
      $(this).val('');
    }else{
      $('#close-search').show();
      toggle_search(true);
    }
  });

  $('#close-search').click(function(){
    $('#search-input').val('');
    toggle_search(false);
    $(this).hide();
  });
  
  function sendMetrics(){
    if($('#search-input').val().length > 1 && $('#search-input').val() !== ''){
      var blogSearchData={
        searchText: $('#search-input').val(),
        resultsCount: $('.post-result').length
      };
      metricsLib.track('blog:search', blogSearchData);
    };
  };

  $('#search-input').keyup( $.debounce( 1500, sendMetrics ) );
});
