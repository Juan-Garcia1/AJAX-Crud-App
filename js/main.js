$(document).ready(function() {

  var $name = $('#name');
  var $username = $('#username');
  var $team = $('.team');
  var $user_card = $('#user-card').html();

  var addUser = function(user) {
    $team.append(Mustache.render($user_card, user));
  }

  $.ajax({
    type: 'GET',
    url: 'http://rest.learncode.academy/api/account/users',
    success: function(data) {
      // LOOP THROUGH DATA
      $.each(data, function(key, user) {
        addUser(user);
      });
    }
  });

  // WHEN USER CLICKS ADD BTN, MODAL WILL POP UP
  $('.add-user').on('click', function() {
    $('#modal').css('display','block');
  });
  // CLOSE MODAL WHEN USER CLICKS CANCEL
  $('#cancel-btn').on('click', function(e) {
    e.preventDefault();
    $('#modal').css('display','none');
  });

// ADD USER
  $('form').on('submit', function(e) {
    e.preventDefault();
// CHECK IF INPUTS ARE EMPTY
    if(!$name.val() || !$username.val()) {
      console.log('Please make sure you enter a name and username');
    } else {
      // GET INPUT VALUES
       $name = $('#name').val();
       $username = $('#username').val();

        $.ajax({
          type: 'POST',
          url: 'http://rest.learncode.academy/api/account/users',
          data: {
            name: $name,
            username: $username
          },
          success: function(newUser) {
            addUser(newUser);
          },
          error: function() {
            alert('Error adding new user');
          }
        });
        $name = $('#name').val('');
        $username = $('#username').val('');
        // WHEN FORM IS SUBMITED, REMOVE MODAL
        $('#modal').css('display','none');
    }

  });


// DELETE USER
  $team.on('click', '.delete-btn', function(e) {
    e.preventDefault();
    var $userCard = $(this).closest('.card');

    $.ajax({
        type: 'DELETE',
        url: `http://rest.learncode.academy/api/account/users/${$(this).data('id')}`,
        success: function(data) {
          $userCard.remove();
        }
      });
  });

// EDIT USERS OPEN TASK
  $team.on('click', '.edit-btn', function(e) {
    e.preventDefault();
    var task = $(this).closest('.card').find('#task');
    $(this).replaceWith(`<a href="#" class="done-btn" title="Done"><i class="fa fa-check"></i></a>`)
    task.replaceWith(`<input id="edit" type="text" value="${task.html()}" />`);
  });

// DONE EDITING USER OPEN TASK
  $team.on('click', '.done-btn', function(e) {
    e.preventDefault();

    var input = $(this).closest('.card').find('#edit');
    var id = $(this).closest('.card').data('id');
    var cardName = $(this).closest(`.card`).find('h4').html();
    var cardUsername = $(this).closest('.card').find('h5').html();
    $(this).replaceWith(`<a href="#" class="edit-btn"><i class="fa fa-pencil"></i></a>`);

    $.ajax({
      type: 'PUT',
      url: `http://rest.learncode.academy/api/account/users/${id}`,
      data: {
        name: cardName,
        username: cardUsername,
        openTask: input.val()
      },
      success: function(data) {
        input.replaceWith(`<h1 id="task">${input.val()}</h1>`);
      }
    });

  });

});
