# encoding: UTF-8

class UsersController < ApplicationController

    def dashboard
        @config[:title] = "Dashboard - #{@config[:name]}"
    end

    def signin
        @config[:title] = "Log In - #{@config[:name]}"
    end

    def signout
        session.clear
        redirect_to user_signin_path
    end

    def profile
        @config[:title] = "Perfil - #{@config[:name]}"
    end

    def profile_update
        success = @user.update(params.require(:user).permit(:name))
        if success
            flash[:notice] = 'Dados alterados com sucesso!'
        else
            flash[:alert] = 'Falha ao alterar dados. Por favor, tente novamente.'
        end
        redirect_to user_profile_path
    end

    def delete
        render json: {
            status: @user.update(archived: true)
        }
    end

end
