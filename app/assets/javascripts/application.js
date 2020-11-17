//= require duxstrap-bundle-min.js
//= require duxdash-bundle-min.js
//= require aws-cognito.js
//= require dux-cognito.js

// ****************** AWS COGNITO SESSION ******************

if (typeof cognito_pool_id !== 'undefined') {
    var cognito = new Cognito(
        cognito_pool_id,
        cognito_client_id,
        cognito_endpoint,
        cognito_cookie_domain,
        cognito_redirect_uri,
        cognito_signout_uri
    );

    $(function() {
        cognito.init();
    });
}


// ***************** CHECK CONNECTION *****************

$(function() {
    duxdash.check_online('Sem conexão com a internet. Para continuar, conecte-se novamente.');
});
