$(document).ready(function(){
/*	$(".img-container").click(function(){
    $(".img-container").removeClass("active");
    $(this).addClass("active");
    var selection = $(this).find(".select").data("value");
    $("#choice").val(selection);
  })*/
  /*Getting the value of the checked radio buttons*/

  $("input:radio[class=modeClass]").on( 'click', function () {
      var value = $(this).val();
      if (value == "Wrong Answer") {
          $("#next_step_form").hide();
      }
      if (value == "Next Step") {
          $("#next_step_form").show();
          $("#goldstandardquestion").hide();
      }
  });

});
