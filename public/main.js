$(document).ready(function(){

    // SIGN-UP | LOGIN TOGGLE 
    $('#loginHead').on('click', function (){
        $('#signupForm').hide();
        $('#loginForm').removeAttr('hidden');
        $('#loginForm').show();
    });

    $('#signUpHead').on('click', function (){
        $('#loginForm').hide();
        $('#signupForm').show();
    });
    // END TOGGLE


});
