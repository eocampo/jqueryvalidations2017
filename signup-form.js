// https://github.com/jquery-validation/jquery-validation/tree/master/src/additional


$( document ).ready(function() {
  $("#signupForm").validate({
    rules: {
      firstname: "required",
      lastname: "required",
      username: {
        required: true,
        minlength: 2,
        // email: true
        myCompanyEmail: true
      },
      password: {
        required: true,
        minlength: 5
      },
      confirm_password: {
        required: true,
        minlength: 5,
        equalTo: "#password"
      },    
      topic: {
        required: "#newsletter:checked",
      },
      agree: "required"
    },
    messages: {
      // firstname: "Please enter your firstname",
      lastname: "Please enter your lastname",
      username: {
        required: "Please enter a username",
        minlength: "Your username must consist of at least 2 characters",
        email: "Your username must be a valid email address",
      },
      password: {
        required: "Please provide a password",
        minlength: "Your password must be at least 5 characters long",
      },
      confirm_password: {
        required: "Please provide a password",
        minlength: "Your password must be at least 5 characters long",
        equalTo: "Please enter the same password as above"
      },
      agree: "Please accept our policy",
      topic: "Please select at least two topics"
    }
  });

  var newsletter = $("#newsletter");
  var initial = newsletter.is(":checked");
  var topics = $("#newsletter_topics")[initial ? "removeClass" : "addClass"]("hide");
  var topicInputs = topics.find("input").attr("disabled", !initial);

  newsletter.click(function() {
    topics[this.checked ? "removeClass" : "addClass"]("hide");
    topicInputs.attr("disabled", !this.checked);
  });

  jQuery.validator.addMethod("myCompanyEmail", function(value, element) {
    return this.optional(element) || /^.+@mycompany.com$/.test(value);
    }, "Only mycompany.com email addresses are allowed."
  );

});

