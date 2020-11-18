module ApplicationHelper

    include ActionView::Helpers::UrlHelper

    # Check for the presence of any alerts
    def any_alerts
        @notice.present? || flash[:notice].present? || @alert.present? || flash[:alert].present?
    end

    # Decode a token from a JWK
    def decode_jwt(token, jwk)
        jwk = JSON::JWK::Set.new(jwk)
        begin
            token = JSON::JWT.decode(token, jwk)
        rescue
            return false
        end
        if Time.at(token[:exp]).utc < Time.now.utc
            return false
        end
        return token
    end

    # Get ID Token from cookies
    def get_token
        id_token = nil
        cookies.each do |key, val|
            if key.match(/CognitoIdentityServiceProvider\..*\.idToken/i)
                id_token = val
            end
        end
        return id_token
    end

    # Decode and verify id token and create a user session
    def verify_token
        id_token = decode_jwt(get_token, @config[:cognito][:jwk])
        if id_token.blank?
            return nil
        end
        return {
            id: id_token['cognito:username'],
            email: id_token[:email],
            name: id_token[:name],
            admin: id_token['custom:admin'] || false
        }
    end

    # Get or create a User and check if registration is complete
    def verify_user(user_session)
        @user = User.find_by(cognito_id: user_session[:id])
        if @user.blank?
            @user = User.create({
                cognito_id: user_session[:id],
                name: user_session[:name],
                email: user_session[:email],
                enabled: true
            })
            redirect_to user_dashboard_path
        else
            if @user.email != user_session[:email]
                @user.update({
                    email: user_session[:email],
                })
            end
        end
    end

    # Request a valid session and user
    def require_session
        unless params[:controller] == 'users' && params[:action] == 'signin'
            user_session = verify_token
            if user_session.present?
                verify_user(user_session)
            else
                cookies[:redirect] = request.url
                redirect_to user_signin_path
            end
        end
    end

end
