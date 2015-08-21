// firebase db ref
var firebase = "https://personlist.firebaseio.com/";

// array to temporarily store firebase data, and easily access values
var people = [];

// Hide the element with the id of update onload
$("#update").hide();



var create = function() {
// Construct an object with the values from the form inputs.
  var person = {
    first: $("#first").val(),
    last: $("#last").val()
  };
  // Check if the inputs are both filled, otherwise exit function without saving info.
  if(person.first === "" || person.last === "") return;
  // Perform ajax request to firebase database with inputed data.
  $.ajax({
    data: JSON.stringify(person),
    url: firebase + ".json",
    method: "POST",
    dataType: "json",
    success: function(res) {
      // invoke the read function on success.
      read();
    },
    error: function(res, status) {
      console.log(res, status)
    }
  })
}



var read = function() {
  // empty the element with the id of people before outputting.
  $("#people").html("");
  // perform ajax request to firebase database, retrieving all records.
  $.ajax({
    url: firebase + ".json",
    method: "GET",
    dataType: "json",
    success: function(data) {
      // on success of the GET request, set the people array to 0.
      people.length = 0;
      // Loop through each person in the response object from firebase.
      for(var person in data) {
        // assign the guid to a property named _id on each item in the array as they are iterated over.
        data[person]._id = person;
        // Push said iteration of person onto the local array people.
        people.push(data[person]);

        // concatenation magic where output the first and last name of each record to the DOM.
        // pass in the guid to the delete function so we can target the correct data to delete in our DB
        // pass in the correct index of each person into the update function so we may grab the correct info from our array to update in the db.
        var x = "<p>" + data[person].first + " " + data[person].last + "</p>"
        + "<button onclick='_delete(" + JSON.stringify(person) + ")'>Delete</button>"
        + "<button onclick='update(" + people.indexOf(data[person]) + ")'>Edit</button>"
        $("#people").append(x);
      }
    },
    error: function(data) {
      console.log(data);
    }
  });
}



var update = function(index) {
  // show the update form.
  $('#update').show();
  // grab the values from the edit form's input fields
  $('#edit_first').val(people[index].first);
  $('#edit_last').val(people[index].last);
  // assign an event listener to the submit_edit id tag.
  $('#submit_edit').on('click', function() {
  // onclick, create a object with the values from the inputs
  var updatedPerson = {
      first : $('#edit_first').val(),
      last : $('#edit_last').val()
    };
    $.ajax({
      // make ajax request to firebase with update data, passing in the
      // corresponding guid to identify which item to update.
      url: firebase + people[index]._id + "/.json",
      method: "PUT",
      dataType: 'json',
      data: JSON.stringify(updatedPerson),
      success: function(data) {
        // on success hide the edit form element, and remove all event listeners from the button to submit an edit.
        $("#update").hide();
        $("#submit_edit").off();
        // run the read function to get the current data from the db.
        read();
      },
      error: function(data) {
        console.log(data);
      }
    })
  })
}


var _delete = function(id) {
  // taking in the id we passed in during the read function for in loop.
  $.ajax({
    // perform ajax request with the guid passed in to target which document to delete from the db.
    url: firebase + id + "/.json",
    method: "DELETE",
    dataType: "json",
    success : function(data) {
      // on success re-run the read function to get the current data.
      read();
    },
    error: function(data) {
      console.log(data);
    }
  })
}

// onload run the read function to get the current data.
read();
