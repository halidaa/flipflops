function save_options() {
  var num_of_opinions = $("#num_of_opinions").val();
  var is_accelerated = $("#is_accelerated").prop("checked");
  var is_customize_question = $("#is_question_description").prop("checked");

  // Saves options to chrome.storage.sync.
  chrome.storage.sync.set({
    num_of_opinions: num_of_opinions,
    is_accelerated: is_accelerated,
    is_customize_question: is_customize_question
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
  // Use default value num_of_opinions = '10' and is_accelerated = false.
  chrome.storage.sync.get({
    num_of_opinions: '10',
    is_accelerated: false,
    is_customize_question: false
  }, function(items) {
    $("#num_of_opinions").val(items.num_of_opinions);
    $("#is_accelerated").prop("checked", items.is_accelerated);
    $("#is_question_description").prop("checked", items.is_customize_question);
  });
}

$(document).ready(function(){
  restore_options();
  
  $("#save").click(function(e){
    save_options();
  });

});
