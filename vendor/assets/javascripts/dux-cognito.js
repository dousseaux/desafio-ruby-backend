/* eslint no-undef: "off" */

var Cognito = function(pool_id, client_id, endpoint, cookie_domain, redirect_uri, signout_uri) {

    this.locale = typeof $('html').attr('lang') == 'undefined' ? 'en' : $('html').attr('lang');
    this.translator = new Translator({
        'input-account-email': {
            'en': 'Inform the email registered to your account',
            'pt-br': 'Informe o e-mail cadastrado à conta'
        },
        'no-account-for-user': {
            'en': 'No account found for this email address.',
            'pt-br': 'O usuário informado não possui conta em nosso sistema.'
        },
        'too-many-attempts': {
            'en': 'Too many attempts. Try again later.',
            'pt-br': 'Número de tentativas esgotado. Tente novamente mais tarde.'
        },
        'input-email-verification-code': {
            'en': 'Insert the verifcation code sent to your email',
            'pt-br': 'Confirme o código de verificação enviado por e-mail'
        },
        'must-contain-six-digits': {
            'en': 'Must have 6 digits',
            'pt-br': 'Deve conter 6 digitos'
        },
        'type-new-password': {
            'en': 'Type new password',
            'pt-br': 'Digite a nova senha'
        },
        'must-contain-number': {
            'en': 'Must contain numbers',
            'pt-br': 'Deve conter números'
        },
        'password-change-successful': {
            'en': 'Password successfully changed! Please sign in.',
            'pt-br': 'Senha alterada com sucesso! Por favor faça o login.'
        },
        'password-change-failed': {
            'en': 'Failed to update password.',
            'pt-br': 'Erro ao alterar a senha!'
        },
        'email-already-used': {
            'en': 'Email already registered. Please, try another email address or sign in to the registered account.',
            'pt-br': 'E-mail já está cadastrado em conta existente. Por favor, utilize outro e-mail ou acesse a conta existente.'
        },
        'authentication-failed-redirected': {
            'en': 'Authentication method failed. Please try again.',
            'pt-br': 'Falha ao autenticar por este método. Por favor, tente novamente.'
        },
        'authentication-failed': {
            'en': 'Authentication failed. Wrong username or password.',
            'pt-br': 'Falha de autenticação. Usuário ou senha incorretos.'
        },
        'send-email-confirmation-code': {
            'en': 'Email not verified. Press OK to receive new verification code in your email.',
            'pt-br': 'E-mail ainda não verificado. Clique em OK para receber o código de verificação por e-mail.'
        },
        'send-email-confirmation-code-failed': {
            'en': 'Could not send email verifcation code.',
            'pt-br': 'Falha ao enviar código de verificação por e-mail.'
        },
        'send-account-confirmation-code': {
            'en': 'Account not verified. Press OK to receive new verification code in your email.',
            'pt-br': 'Conta ainda não verificada. Clique em OK para receber o código de verificação por e-mail.'
        },
        'send-account-confirmation-code-failed': {
            'en': 'Could not send email verifcation code.',
            'pt-br': 'Falha ao enviar código de verificação por e-mail.'
        },
        'send-again': {
            'en': 'send again',
            'pt-br': 'enviar novamente'
        },
        'invalid-verification-code': {
            'en': 'Wrong verification code. Please try again.',
            'pt-br': 'Código de verificação inválido. Por favor, tente novamente.'
        },
        'account-verification-successful': {
            'en': 'Account successfully verified. Please sign in.',
            'pt-br': 'Conta verificada com sucesso! Por favor, faça o login.'
        },
        'email-verification-successful': {
            'en': 'Email successfully verified!',
            'pt-br': 'E-mail confirmado com sucesso!'
        },
        'input-password-to-continue': {
            'en': 'Please, inform password for',
            'pt-br': 'Antes de continuar, informe a senha para'
        },
        'wrong-password': {
            'en': 'Wrong password. Please try again.',
            'pt-br': 'Senha incorreta. Por favor, tente novamente.'
        },
        'email-update-successful': {
            'en': 'Email successfully updated!',
            'pt-br': 'E-mail atualizado com sucesso!'
        },
        'email-update-failed': {
            'en': 'Failed to update email. Please try again.',
            'pt-br': 'Falha ao atualizar e-mail. Por favor, tente novamente.'
        },
        'passwords-dont-match': {
            'en': 'Passwords do not match. Please try again.',
            'pt-br': 'As senhas informadas não coincidem. Por favor, tente novamente.'
        },
        'password-update-successful': {
            'en': 'Password successfully updated',
            'pt-br': 'Senha atualizada com sucesso!'
        },
        'password-update-failed': {
            'en': 'Failed to update password. Please try again.',
            'pt-br': 'Falha ao atualizar a senha. Por favor, tente novamente.'
        }
    });
    this.wrapper = $('body');
    this.idToken = null;

    var self = this;
    var t = this.translator;
    var cognitoRedirectURI = redirect_uri;
    var cognitoSignOutURI = endpoint + '/logout?logout_uri=' + signout_uri + '&client_id=' + client_id;
    var cognitoEndpoint = endpoint;
    var cognitoCookieData = {
        domain: cookie_domain,
        secure: false
    };
    var cognitoPoolData = {
        UserPoolId: pool_id,
        ClientId: client_id
    };
    if (cognitoCookieData.domain.length > 0) {
        cognitoPoolData.Storage = new AmazonCognitoIdentity.CookieStorage(cognitoCookieData);
    }
    var cognitoUserPool = new AmazonCognitoIdentity.CognitoUserPool(cognitoPoolData);
    var cognitoUser = null;
    var cognitoUserAttrs = null;
    var cognitoSessionCallbacks = {
        success: [],
        error: []
    };


    // Try to retrieve user from session and call callbacks
    var initSession = function() {
        getCurrentUser(
            function(status, attrs) {
                var username = getUserAttr('sub');
                console.log('Found Cognito session. User: ' + username);
                for (var i in cognitoSessionCallbacks.success) {
                    cognitoSessionCallbacks.success[i](attrs);
                }
                setInterval(function() {
                    refreshSession(function() {});
                }, 10000);
            },
            function() {
                console.log('No Cognito session available.');
                if (cognitoSessionCallbacks.error.length > 0) {
                    for (var i in cognitoSessionCallbacks.error) {
                        cognitoSessionCallbacks.error[i]();
                    }
                } else {
                    window.location.href = '/';
                }
            }
        );
    };


    // Register callbacks to be called on initSession
    var registerSessionCallback = function(callback, type) {
        type = setDefault(type, 'success');
        if (type === 'success') {
            cognitoSessionCallbacks.success.push(callback);
        } else if (type === 'error') {
            cognitoSessionCallbacks.error.push(callback);
        }
    };


    // Get current user from local session
    var getCurrentUser = function(success, error) {
        cognitoUser = cognitoUserPool.getCurrentUser();
        if (cognitoUser != null) {
            cognitoUser.getSession(function(err, session) {
                if (err) {
                    error(false, err);
                } else {
                    cognitoUser.getUserAttributes(function(err, attributes) {
                        if (err) {
                            error(false, err);
                        } else {
                            self.idToken = session.idToken.jwtToken;
                            cognitoUserAttrs = attributes;
                            success(true, attributes);
                        }
                    });
                }
            });
        } else {
            error(false);
        }
    };


    // Refresh of user attributes
    var refreshUserAttrs = function(callback) {
        cognitoUser.getUserData(
            function(err, userData) {
                if (err) {
                    callback(false, err);
                } else {
                    cognitoUserAttrs = userData.UserAttributes;
                    callback(true);
                }
            }
        );
    };


    // Update session tokens
    var refreshSession = function(callback) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                callback(false, err);
            } else {
                if (!session.isValid()) {
                    var refresh_token = session.getRefreshToken();
                    cognitoUser.refreshSession(refresh_token, function(err, session) {
                        if (err) {
                            callback(false, err);
                        } else {
                            reloadUserAttrs(callback);
                        }
                    });
                } else {
                    callback(false);
                }
            }
        });
    };


    // Force reload of user attributes from backend
    var reloadUserAttrs = function(callback) {
        cognitoUser.getUserData(
            function(err, userData) {
                if (err) {
                    callback(false, err);
                } else {
                    cognitoUserAttrs = userData.UserAttributes;
                    callback(true);
                }
            },
            {
                bypassCache: true
            }
        );
    };


    // Authenticate user with user name and password
    var authenticateUser = function(username, password, success, error) {
        var authenticationData = {
            Username: username,
            Password: password
        };
        var userData = {
            Username: username,
            Pool: cognitoUserPool
        };
        if (cognitoCookieData.domain.length > 0) {
            userData.Storage = new AmazonCognitoIdentity.CookieStorage(cognitoCookieData);
        }
        cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function(result) {
                getCurrentUser(success, error);
            },
            onFailure: function() {
                error(false);
            }
        });
    };


    // Authenticate user with redirected authentication method
    var authenticateRedirectedUser = function(success, error) {
        $.ajax({
            type: 'post',
            url: cognitoEndpoint + '/oauth2/token',
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            data: {
                grant_type: 'authorization_code',
                client_id: cognitoPoolData.ClientId,
                code: getUrlParameter('code'),
                redirect_uri: cognitoRedirectURI
            },
            success: function(data) {
                var id_token = new AmazonCognitoIdentity.CognitoIdToken({
                    IdToken: data.id_token
                });
                var access_token = new AmazonCognitoIdentity.CognitoAccessToken({
                    AccessToken: data.access_token
                });
                var refresh_token = new AmazonCognitoIdentity.CognitoRefreshToken({
                    RefreshToken: data.refresh_token
                });
                var user_session = new AmazonCognitoIdentity.CognitoUserSession({
                    IdToken: id_token,
                    RefreshToken: refresh_token,
                    AccessToken: access_token,
                    ClockDrift: 0
                });
                var userData = {
                    Username: id_token.payload['cognito:username'],
                    Pool: cognitoUserPool
                };
                if (cognitoCookieData.domain.length > 0) {
                    userData.Storage = new AmazonCognitoIdentity.CookieStorage(cognitoCookieData);
                }
                cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
                cognitoUser.setSignInUserSession(user_session);
                getCurrentUser(success, error);
            },
            error: function() {
                error(false);
            }
        });
    };


    // Get an user attribute by name
    var getUserAttr = function(name) {
        if (cognitoUserAttrs) {
            var filtered = cognitoUserAttrs.filter(function(x) {
                if (x.Name === name) {
                    return true;
                }
            })[0];
            if (filtered) {
                return filtered.Value;
            }
        }
        return null;
    };


    // Redirect user to sign out path
    var userSingOut = function() {
        cognitoUser.signOut();
        window.location.href = cognitoSignOutURI;
    };


    // Require user to input password and force authentication
    var authenticationRequest = function(success, error) {
        var username = getUserAttr('email');
        bootbox.prompt({
            title: t.get('input-password-to-continue') + ': <b>' + username + '</b>',
            attributes: [{
                name: 'placeholder',
                value: '***********'
            },
            {
                name: 'data-validate',
                value: 'required'
            },
            {
                name: 'type',
                value: 'password'
            }
            ],
            callback: function(password) {
                if (password !== null) {
                    if (!$(this).find('form').duxValid()) {
                        return false;
                    } else {
                        self.wrapper.loading('show');
                        authenticateUser(
                            username,
                            password,
                            function(status) {
                                self.wrapper.loading('hide');
                                success(true);
                            },
                            function(status, err) {
                                self.wrapper.loading('hide');
                                if (err) {
                                    if (err.code === 'NotAuthorizedException') {
                                        bootbox.alert(t.get('wrong-password'), function() {
                                            authenticationRequest(success, error);
                                        });
                                    } else {
                                        error(false, err);
                                    }
                                } else {
                                    error(false);
                                }
                            }
                        );
                    }
                }
                return true;
            }
        });
    };


    // Veriy user email by checking code sent to it.
    var verifyUserEmail = function(callback) {
        verificationRequest(
            function(ver_code) {
                self.wrapper.loading('show');
                cognitoUser.verifyAttribute('email', ver_code, {
                    onSuccess: function(result) {
                        self.wrapper.loading('hide');
                        bootbox.alert(t.get('email-verification-successful'), function() {
                            callback(false);
                        });
                    },
                    onFailure: function(err) {
                        self.wrapper.loading('hide');
                        bootbox.alert(t.get('invalid-verification-code'), function() {
                            verifyUserEmail(callback);
                        });
                    }
                });
            },
            function(callback) {
                cognitoUser.getAttributeVerificationCode('email', {
                    onSuccess: callback,
                    onFailure: function(err) {
                        callback();
                        bootbox.alert(t.get('send-account-confirmation-code-failed'));
                    }
                });
            }
        );
    };


    // Veriy user email by checking code sent to it.
    var verifyUserAccount = function(callback) {
        verificationRequest(
            function(ver_code) {
                self.wrapper.loading('show');
                cognitoUser.confirmRegistration(ver_code, true, function(err, result) {
                    self.wrapper.loading('hide');
                    if (err) {
                        bootbox.alert(t.get('invalid-verification-code'), function() {
                            verifyUserAccount(callback);
                        });
                    } else {
                        bootbox.alert(t.get('account-verification-successful'), function() {
                            callback(true);
                        });
                    }
                });
            },
            function(callback) {
                cognitoUser.resendConfirmationCode(callback);
            }
        );
    };


    // Show verification request dialog
    var verificationRequest = function(verification_callback, resend_callback) {
        refreshUserAttrs(
            function() {
                var email = getUserAttr('email');
                if (!email) {
                    email = cognitoUser.username;
                }

                var title = '<p class="mb-2">' + t.get('input-email-verification-code') + ':</p>';
                title += '<p class="mb-2"><i class="fa fa-envelope mr-1 text-primary"></i> ' + email + '</p>';
                title += '<p class="text-right"><span class="resend-ver-code btn btn-sm btn-rounded btn-with-ico btn-light">';
                title += '<i class="fa fa-refresh icon"></i>' + t.get('send-again') + '</span></p>';

                bootbox.prompt({
                    title: title,
                    attributes: [
                        {
                            name: 'placeholder',
                            value: '0 - 0 - 0 - 0 - 0 - 0'
                        },
                        {
                            name: 'data-validate',
                            value: 'required & regex:\\d - \\d - \\d - \\d - \\d - \\d:' + t.get('must-contain-six-digits')
                        },
                        {
                            name: 'data-mask',
                            value: '0 - 0 - 0 - 0 - 0 - 0'
                        }
                    ],
                    callback: function(ver_code) {
                        if (ver_code !== null) {
                            if (!$(this).find('form').duxValid()) {
                                return false;
                            } else {
                                verification_callback(ver_code.replace(/ - /g, ''));
                            }
                        }
                        return true;
                    }
                });
                setTimeout(function() {
                    $('.resend-ver-code').click(function(e) {
                        e.preventDefault();
                        var $this = $(this);
                        $this.find('i').addClass('fa-spin');
                        resend_callback(function(err, result) {
                            $this.find('i').removeClass('fa-spin');
                        });
                    });
                }, 150);
            }
        );
    };


    // Send account verification code to email and verify it
    var requestAccountVerification = function(callback) {
        bootbox.alert(t.get('send-account-confirmation-code'), function() {
            self.wrapper.loading('show');
            cognitoUser.resendConfirmationCode(function(err, result) {
                self.wrapper.loading('hide');
                if (err) {
                    bootbox.alert(t.get('send-account-confirmation-code-failed'), function() {
                        callback(false, err);
                    });
                } else {
                    verifyUserAccount(function() {
                        cognitoUser = null;
                        callback(true);
                    });
                }
            });
        });
    };


    // Send email confirmation code to email and verify it
    var requestEmailVerification = function(callback) {
        bootbox.alert(t.get('send-email-confirmation-code'), function() {
            self.wrapper.loading('show');
            cognitoUser.getAttributeVerificationCode('email', {
                onSuccess: function() {
                    verifyUserEmail(function() {
                        self.wrapper.loading('hide');
                        callback(true);
                    });
                },
                onFailure: function(err) {
                    self.wrapper.loading('hide');
                    bootbox.alert(t.get('send-email-confirmation-code-failed'), function() {
                        callback(false, err);
                    });
                }
            });
        });
    };


    // Creates a session from username and password inputs
    var standardSignin = function(username, password, callback) {
        self.wrapper.loading('show');
        authenticateUser(
            username,
            password,
            function(status) {
                self.wrapper.loading('hide');
                callback(true);
            },
            function(status, err) {
                if (err) {
                    if (err.code === 'UserNotConfirmedException') {
                        self.wrapper.loading('hide');
                        requestAccountVerification(callback);
                    }
                } else {
                    bootbox.alert(t.get('authentication-failed'), function() {
                        callback(false);
                        self.wrapper.loading('hide');
                    });
                }
            }
        );
    };


    // Creates a session from redirected signin code from aws endpoint (facebook or google signins)
    var redirectedSignin = function(callback) {
        authenticateRedirectedUser(
            callback,
            function() {
                bootbox.alert(t.get('authentication-failed-redirected'), function() {
                    callback(false);
                    // Reload page without url parameters
                    window.location.href = window.location.href.substring(0, window.location.href.indexOf('?'));
                });
            }
        );
    };


    // Creates a new user
    var register = function(name, username, password, callback) {
        var attributeList = [];
        var dataName = {
            Name: 'name',
            Value: name
        };
        var dataEmail = {
            Name: 'email',
            Value: username
        };
        var attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
        attributeList.push(attributeName);
        attributeList.push(attributeEmail);
        self.wrapper.loading('show');
        cognitoUserPool.signUp(username, password, attributeList, null, function(err, result) {
            self.wrapper.loading('hide');
            if (err) {
                if (err.code === 'UsernameExistsException') {
                    bootbox.alert(t.get('email-already-used'), function() {
                        callback(false, err);
                    });
                } else {
                    bootbox.alert(err.msg, function() {
                        callback(false, err);
                    });
                }
            } else {
                cognitoUser = result.user;
                verifyUserAccount(callback);
            }
        });
    };


    // Sends a code to registered email, verify it and enter a new password
    var forgotPassword = function(callback) {
        bootbox.prompt({
            title: t.get('input-account-email') + ':',
            attributes: [
                {
                    name: 'placeholder',
                    value: 'user@email.com'
                },
                {
                    name: 'data-validate',
                    value: 'required & email'
                }
            ],
            callback: function(username) {
                if (username !== null) {
                    if (!$(this).find('form').duxValid()) {
                        return false;
                    } else {
                        self.wrapper.loading('show');
                        var userData = {
                            Username: username,
                            Pool: cognitoUserPool
                        };
                        if (cognitoCookieData.domain.length > 0) {
                            userData.Storage = new AmazonCognitoIdentity.CookieStorage(cognitoCookieData);
                        }
                        cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
                        cognitoUser.forgotPassword({
                            onSuccess: function(data) {},
                            onFailure: function(err) {
                                self.wrapper.loading('hide');
                                if (err.code === 'UserNotFoundException') {
                                    bootbox.alert(t.get('no-account-for-user'));
                                } else if (err.code === 'LimitExceededException') {
                                    bootbox.alert(t.get('too-many-attempts'));
                                } else {
                                    bootbox.alert(err.message);
                                }
                            },
                            inputVerificationCode: function(data) {
                                var title = '<p class="mb-2">' + t.get('input-email-verification-code') + ':</p>';
                                title += '<p class="mb-2"><i class="fa fa-envelope mr-1 text-primary"></i> ' + data.CodeDeliveryDetails.Destination + '</p>';
                                bootbox.prompt({
                                    title: title,
                                    attributes: [
                                        {
                                            name: 'placeholder',
                                            value: '0 - 0 - 0 - 0 - 0 - 0'
                                        },
                                        {
                                            name: 'data-validate',
                                            value: 'required & regex:\\d - \\d - \\d - \\d - \\d - \\d:' + t.get('must-contain-six-digits')
                                        },
                                        {
                                            name: 'data-mask',
                                            value: '0 - 0 - 0 - 0 - 0 - 0'
                                        }
                                    ],
                                    callback: function(ver_code) {
                                        self.wrapper.loading('hide');
                                        if (ver_code !== null) {
                                            if (!$(this).find('form').duxValid()) {
                                                return false;
                                            } else {
                                                ver_code = ver_code.replace(/ - /g, '');
                                                bootbox.prompt({
                                                    title: t.get('type-new-password') + ':',
                                                    attributes: [
                                                        {
                                                            name: 'type',
                                                            value: 'password'
                                                        },
                                                        {
                                                            name: 'placeholder',
                                                            value: '******'
                                                        },
                                                        {
                                                            name: 'data-validate',
                                                            value: 'required & min:8 & regex:.*\\d.*:' + t.get('must-contain-number')
                                                        }
                                                    ],
                                                    callback: function(password) {
                                                        if (password !== null) {
                                                            if (!$(this).find('form').duxValid()) {
                                                                return false;
                                                            } else {
                                                                self.wrapper.loading('show');
                                                                cognitoUser.confirmPassword(ver_code, password, {
                                                                    onSuccess: function() {
                                                                        self.wrapper.loading('hide');
                                                                        bootbox.alert(t.get('password-change-successful'), function() {
                                                                            callback(true);
                                                                        });
                                                                    },
                                                                    onFailure: function() {
                                                                        self.wrapper.loading('hide');
                                                                        bootbox.alert(t.get('password-change-failed'), function() {
                                                                            callback(false);
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        }
                                                        return true;
                                                    }
                                                });
                                            }
                                        }
                                        return true;
                                    }
                                });
                            }
                        });
                    }
                }
                return true;
            }
        });
    };


    // Update email after requesting authentication
    var requestEmailUpdate = function(email, callback) {
        authenticationRequest(
            function() {
                var attributeList = [new AmazonCognitoIdentity.CognitoUserAttribute({
                    Name: 'email',
                    Value: email
                })];
                self.wrapper.loading('show');
                cognitoUser.updateAttributes(attributeList, function(err, result) {
                    self.wrapper.loading('hide');
                    if (err) {
                        bootbox.alert(t.get('email-update-failed'), function() {
                            callback(false, err);
                        });
                    } else {
                        bootbox.alert(t.get('email-update-successful'), function() {
                            refreshSession(function() {
                                verifyUserEmail(callback);
                            });
                        });
                    }
                });
            },
            function(err) {
                bootbox.alert(t.get('email-update-failed'), function() {
                    callback(false, err);
                });
            }
        );
    };


    // Update password
    var requestPasswordUpdate = function(old_pass, new_pass, conf_pass,  callback) {
        if (new_pass === conf_pass) {
            cognitoUser.changePassword(old_pass, new_pass, function(err, result) {
                if (err) {
                    if (err.code === 'NotAuthorizedException') {
                        bootbox.alert(t.get('wrong-password'), function() {
                            callback(false, err);
                        });
                    } else {
                        bootbox.alert(t.get('password-update-failed'), function() {
                            callback(false, err);
                        });
                    }
                } else {
                    bootbox.alert(t.get('password-update-successful'), function() {
                        callback(true);
                    });
                }
            });
        } else {
            bootbox.alert(t.get('passwords-dont-match'), function() {
                callback(false);
            });
        }
    };


    // Delete user
    var deleteUser = function(callback) {
        cognitoUser.deleteUser(function(err, result) {
            if (err) {
                callback(false, err);
            } else {
                callback(true);
                window.location.href = '/';
            }
        });
    };


    this.init = initSession;
    this.addCallback = registerSessionCallback;
    this.signup = register;
    this.signin = standardSignin;
    this.signinRed = redirectedSignin;
    this.signout = userSingOut;
    this.resetPassword = forgotPassword;
    this.userAttr = getUserAttr;
    this.emailVerification = requestEmailVerification;
    this.updateEmail = requestEmailUpdate;
    this.updatePassword = requestPasswordUpdate;
    this.removeAccount = deleteUser;
    this.refresh = refreshSession;

};
