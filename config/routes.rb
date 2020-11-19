# frozen_string_literal: true

Rails.application.routes.draw do

    root 'users#dashboard'

    # User Routes
    get         '/dashboard',                   to: 'users#dashboard',               as: 'user_dashboard'
    get         '/sign-in',                     to: 'users#signin',                  as: 'user_signin'
    get         '/sign-out',                    to: 'users#signout',                 as: 'user_signout'
    get         '/profile',                     to: 'users#profile',                 as: 'user_profile'
    post        '/profile',                     to: 'users#profile_update'
    delete      '/profile',                     to: 'users#delete'

    # Transactions
    resource :transactions, only: [:create]

end
