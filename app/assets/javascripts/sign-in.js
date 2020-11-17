// Show welcome div and hide others
var showWelcomeDiv = function() {
    $('#register-or-signin').removeClass('d-none');
    $('#register').addClass('d-none');
    $('#signin').addClass('d-none');
};


// Show register form and hide others
var showRegisterForm = function() {
    $('#register-or-signin').addClass('d-none');
    $('#register').removeClass('d-none');
    $('#signin').addClass('d-none');
    $('#register_name').focus();
};


// Show signin form and hide others
var showSigninForm = function() {
    $('#register-or-signin').addClass('d-none');
    $('#register').addClass('d-none');
    $('#signin').removeClass('d-none');
    $('#signin_email').focus();
};


// Redirect to user dashboard page
var signedIn = function() {
    if (cognito.userAttr('email_verified') === 'false') {
        cognito.emailVerification(showSigninForm);
    } else {
        var url = Cookies.get('redirect');
        if (url) {
            Cookies.remove('redirect');
        } else {
            url = '/dashboard';
        }
        window.location.href = url;
    }
};


// Shows signin or register options if there is not a valid session
var notSignedIn = function() {
    setTimeout(function() {
        $('#session-loading').removeClass('d-flex');
        $('#session-loading').addClass('d-none');
        $('#main-div').removeClass('d-none');
        $('.signin-wrapper').slimscroll();
        showWelcomeDiv();
    }, 1000);
};


// Callback if user is signed in
cognito.addCallback(signedIn);


// Callback if user is not signed in
cognito.addCallback(function() {
    // Check if there is redirected signin code, if not, shows signin or register options
    if (getUrlParameter('code') === undefined) {
        notSignedIn();
    } else {
        cognito.signinRed(signedIn);
    }
}, 'error');


$(function() {

    cognito.wrapper = $('.signin-wrapper');

    $('#signin-form').submit(function(e) {
        e.preventDefault();
        if ($(this).duxValid()) {
            cognito.signin($('#signin_email').val(), $('#signin_password').val(), function(status) {
                if (status) {
                    signedIn();
                }
            });
        }
    });

    $('#register-form').submit(function(e) {
        e.preventDefault();
        if ($(this).duxValid()) {
            cognito.signup($('#register_name').val(), $('#register_email').val(), $('#register_password').val(), showSigninForm);
        }
    });

    $('.signin-back').click(showWelcomeDiv);

    $('#signin-btn').click(showSigninForm);

    $('#register-btn').click(showRegisterForm);

    $('#forgot-password').click(function(e) {
        e.preventDefault();
        cognito.resetPassword(showSigninForm);
    });

});
