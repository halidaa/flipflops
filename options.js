function save_options() {
  var num_of_opinions = $("#num_of_opinions").val();
  var payment_rate = $("#payment_rate").val();
  var is_accelerated = $("#is_accelerated").prop("checked");
  var is_customized = $("#is_customized").prop("checked");
  var question, description = "";

  if(is_customized) {
    question = $("#question").val();
    description = $("#description").val();
  }

  // Saves options to chrome.storage.sync.
  chrome.storage.sync.set({
    num_of_opinions: num_of_opinions,
    payment_rate: payment_rate,
    is_accelerated: is_accelerated,
    is_customized: is_customized,
    question: question,
    description: description
  }, function() {
    // Update status to let user know options were saved.
    var status = $("#status");
    status.text("Options saved.");
    setTimeout(function() {
      status.text('');
    }, 1000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    num_of_opinions: 10,
    payment_rate: 5,
    is_accelerated: false,
    is_customized: false,
    question: "",
    description: ""
  }, function(items) {
    $("#num_of_opinions").val(items.num_of_opinions);
    $("#payment_rate").val(items.payment_rate);
    $("#is_accelerated").prop("checked", items.is_accelerated);
    $("#is_customized").prop("checked", items.is_customized);
    $("#question").val(items.question);
    $("#description").val(items.description);

    // Shows Customization Panel
    if($("#is_customized").prop("checked")) {
      $("#question_description").show();
    }
    else {
      $("#question_description").hide();
    }

    // Restore time estimate
    var num_of_opinions = items.num_of_opinions;
    var payment_rate = items.payment_rate; 
    $("#time_estimate").text(time_estimate(num_of_opinions, payment_rate));
  });
}

function time_estimate(num_of_opinions, payment_rate){
  var a = 60/payment_rate;
  var b = num_of_opinions;
  return Math.round(10 * a) / 10;
}

$(document).ready(function(){
  restore_options();

  $("#num_of_opinions, #payment_rate").change(function(){
    var num_of_opinions = $("#num_of_opinions").val();
    var payment_rate = $("#payment_rate").val(); 
    $("#time_estimate").text(time_estimate(num_of_opinions, payment_rate));
  });

  $("#is_customized").change(function() {
    if($(this).prop("checked")) {
      $("#question_description").show();
    }
    else {
     $("#question_description").hide();
    }
  });

  $("#save").click(function(e){
    save_options();
  });

});
