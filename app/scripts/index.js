var $ = require('jquery');
var Firebase = require('firebase');


$('.errorMsg').hide();
/////////////////// Utilities //////////////////////
$.fn.serializeObject = function() {
  return this.serializeArray().reduce(function(acum, i) {
    acum[i.name] = i.value;
    return acum;
  }, {});
};
////////////////////////////////////////////////////


$(function(){
  var formData;
  var ref = new Firebase('https://where-art-thou.firebaseio.com');
  $('#signup').on('submit', function(event){
    event.preventDefault();
    var $form = $(this);
    formData = $form.serializeObject();
    ref.createUser(formData, function(error, userData){
      if (error) {
        console.log(error);
        $('.errorMsg').show();
      } else {
        console.log('Successfully created user account with uid:', userData.uid);
      }
    });
  });

  $('#login').on('submit', function(){
    event.preventDefault();
    var $form = $(this);
    formData = $form.serializeObject();
    ref.authWithPassword(formData, function(error, authData){
      if (error){
        console.log(error);
      } else {
        console.log('Authentication successful with this payload:', authData);
      }
    });
  });

  $('#message-box').on('submit', function(e){
    if (e.keyCode === 13){
      e.preventDefault();
      var username = formData.email;
      var msgs = $('#comment').val();
      ref.push({username: username, msgs: msgs});
      $(this).closest('form').find("input[type=text], textarea").val("");
      $(this).closest('form').find("input[type=password], textarea").val("");

    }
    e.preventDefault();
    var username = formData.email;
    var msgs = $('#comment').val();
    ref.push({username: username, msgs: msgs});
  });
  ref.on('child_added', function(snapshot){
    var message = snapshot.val();
    console.log(message)
    $('.messages').append('<div>' + message.username + ': ' + message.msgs + '</div>');
  });

});
