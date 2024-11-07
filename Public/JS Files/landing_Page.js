// $("h1").css("background","red");

/*=================sticky navbar==================== */

 

// let header = $("header");
//        header.classList.toggle("sticky",window.scrollY > 100);

/*=================scroll reveal==================== */
ScrollReveal({ 
    reset: true,
    distance: "80px",
    duration: 2000,
    delay:200
 });

 ScrollReveal().reveal('#testemployees h4', {origin:"top"});
 ScrollReveal().reveal('.testemployees1', {origin:"left"});
 ScrollReveal().reveal('.testemployees3', {origin:"right"});
 ScrollReveal().reveal('.testemployees2', {origin:"bottom"});


 $(document).ready(function() {
          // Check if there's a saved username
          const savedUsername = getCookie("username");
          if (savedUsername) {
              $("#signin-user-email").val(savedUsername); // Corrected the setting of the email value
              $("#flexCheckDefault").prop("checked", true); // Corrected the checkbox check
          }

      const submit_signinbtn = $("#submit-signinbtn");
      submit_signinbtn.click(function(e) {
              e.preventDefault(); // Prevent form submission for demonstration

              var userEmail = $("#signin-user-email").val();
              var userPassword = $("#user-password-signin").val();
              var rememberMe = $("#flexCheckDefault").is(":checked"); // Corrected checkbox check

              // Function to check the syntax requirements of the user email
              function validateEmail(email) {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  return emailRegex.test(email);
              }

              // Validate the user's email address and password
              if (!userEmail || !userPassword) {
                  alert("Please fill in all required fields.");
              } else if (!validateEmail(userEmail)) {
                  alert("Invalid email address.");
              } else if (userPassword.length < 8) {
                  alert("Password must be at least 8 characters long.");
              } else {

                  // alert("Valid email and password.");
                  async function sendData() {
                    try {
                        const response = await axios.post('/sign_in', {
                            'username': userEmail,
                            'password': userPassword,
                        });
        
                        const data = response.data;
                        console.log(data);
        
                    if (data.success) { // Use === for comparison
                            console.log(data.success);
                            $("#signin-user-email").val("")
                            $("#user-password-signin").val("");
                            // $("#flexCheckDefault").prop("checked", false);
                            alert(data.message); // Display the success message
                            
                            // Redirect to the user page depending on the type of user, whether employee or employee
                            console.log("Type of employee"+ " " + data.type  );

                              if(data.type === "employer"){
                                window.location.href = "/Employer_Page";
                              }else {
                                window.location.href = "/Employee_Page";
                              }                            
                        } else {
                            alert(data.message); // Display the error message
                        }
                    } catch (error) {
                        console.error('Error sending data:', error);
                    }
                }
                sendData();

              }

              console.log(userEmail);
              console.log(userPassword);

              // Use userEmail instead of username here
              if (rememberMe) {
                  setCookie("username", userEmail, 30); // Store email for 30 days
              } else {
                  setCookie("username", "", -1); // Clear cookie if not remembered
              }

               
         });


  // ===============================When the user Registers using the Sign-Up button =============================//

      const submit_signupbtn = $("#registerUser-submitbtn");
      submit_signupbtn.click(function(e) {
        e.preventDefault(); // Prevent form submission  
    
        var user_type = "";
        const homeOwner = $("#inlineRadio1");
        const jobSeeker = $("#inlineRadio2");
    
        var fname = $("#firstname").val();
        var lname = $("#lastname").val();
        var register_user_email = $("#register-user-email").val();
        var register_user_password = $("#user-password").val();
        var confirm_password = $("#confirm-userpassword").val();

              console.log(fname);
              console.log(lname);
              console.log(register_user_email);
              console.log(register_user_password);
              console.log(confirm_password);
    
        // Function to check the syntax requirements of the user email
        function validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    
        // Ensure only one can be checked
        homeOwner.click(function() {
            jobSeeker.prop("checked", false);
        });
    
        jobSeeker.click(function() {
            homeOwner.prop("checked", false);
        });
    
        // Check if the user is an employer or employee
        if (!homeOwner.prop("checked") && !jobSeeker.prop("checked")) {
            alert("Please indicate whether you are an employer or employee!");
        }
        // Check if all of the fields are filled
        else if (!fname || !lname || !register_user_email || !register_user_password || !confirm_password) {
            alert("Please fill in all required fields.");
        } 
        // Check if the email has the correct syntax
        else if (!validateEmail(register_user_email)) {
            alert("Invalid email address.");
        } 
        // Check if new and confirm passwords match
        else if (register_user_password !== confirm_password) {
            alert("New password and confirm password do not match.");
        }
        // Check the passwords length
        else if (register_user_password.length < 8 || confirm_password.length < 8) {
            alert("Password must be at least 8 characters long.");
        } else {
            // Determine user type after all validations
            if (homeOwner.prop("checked")) {
                user_type = "Employer";
            } else if (jobSeeker.prop("checked")) {
                user_type = "employee";
            }

            console.log(user_type);
    
         
    
        //Sends data to the server after all the validations are meant    
            async function sendData() {
                try {
                    const response = await axios.post('/sign_up', {
                        'firstname': fname,
                        'lastname': lname,
                        'register_user_email': register_user_email,
                        'user_password': register_user_password,
                        'user_type': user_type // Include user_type in the data sent
                    });
    
                    const data = response.data;
                    console.log(data);
    
                    if (data.success) { // Use === for comparison
                        console.log(data.success);
                        $("#firstname").val("");
                        $("#lastname").val("");
                        $("#register-user-email").val("");
                        $("#user-password").val("");
                        $("#confirm-userpassword").val("");
                        homeOwner.prop("checked", false);
                        jobSeeker.prop("checked", false);

                        alert(data.message); // Display the success message
                    } else {
                        alert(data.message); // Display the error message
                    }
                } catch (error) {
                    console.error('Error sending data:', error);
                }
            }
            sendData();
        }
    });


});

//================================== Cookies configuration for the Remember me feature ====================================//

// Function to set a cookie
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie by name
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}


//=====================================The Register / Sign Up Users form =================================//
