# frozen_string_literal: true

Rails.configuration.x.desafio_backend = {
    domain: 'desafio_backend.duxcloud.com.br',
    name: 'Desafio Ruby Backend',
    title: 'Desafio Ruby Backend',
    description: 'Desafio Backend Ruby on Rails - Pedro Dousseau <pedro@dousseau.com>',
    logo: 'https://core.duxdata.io/dux-analytics-logo-v4-light.png',
    logo_mobile: 'https://core.duxdata.io/dux-analytics-logo-v4-mobile.png',
    favicon: 'https://core.duxdata.io/dux-analytics-logo-v4-favicon.png',
    cognito: {
        endpoint: 'https://dux-analytics-core.auth.us-west-2.amazoncognito.com',
        pool_id: 'us-west-2_TZ2S2fMth',
        client_id: '5sktsc6am6nrii4cv9qcl7koa',
        redirect_uri: 'http://localhost:3000/sign-in',
        signout_uri: 'http://localhost:3000/sign-out',
        cookie_domain: 'localhost',
        jwk: {
            keys: [
                {
                    'alg': 'RS256',
                    'e': 'AQAB',
                    'kid': 'xkKoJY4qr8U8e4TvVMC5iiLEFRoJV1bA2KeA4p2LhH8=',
                    'kty': 'RSA',
                    'n': 'qGG8BCRzfj6SMjx05wR4DaGFupDMpE-fmRPArV8530xugzOVMcYywTMkRXbxI7r0AnxLFOWaVWVJgFfhArhkaPrKX8RD6JLjryCqrc__-konBZhw8fGkrAqG5IprOPii7dewSzHPRpD8JSInGk_bzzrlSsHRJK47GKvdbVkIRcgJ_qNSkDoP2TrykCJ9BzEToU1zAFE9TX2IFuhL5B8tuTqEAEhaVcjWGX8ocVOfmupnPrNcdESbbnHVv8yLv7XNjDnRmo3xfkgxJWcCi-zaqPtcP5xexWPpWOHltG5Saf7PeEgEeRUAV2RA0lx_PD5GwaSvcy3B6AfLxfqtRlKXMw',
                    'use': 'sig'
                },
                {
                    'alg': 'RS256',
                    'e': 'AQAB',
                    'kid': 'guoD92H3LyfEBsceqp+xwylEZBT0CTuAIjYmXySPi98=',
                    'kty': 'RSA',
                    'n': '4v92qHwOHKZRXMuwKJnsST5zPJgeHGVa7TvEayXLmqgWwFJb2j0eoTl0pmI52Dltj9cvvgJbg8pcuOYaDSy2Iw76QLMjJGgLHpytGAUKrmrLNumYnEqkPip12boBPKoa9HVfYnzBBU-kl4gQ-OOjwq_Tl2rbqMRZQdoqNkPDDc5Wd5NgY2obmLkKOvosWp5jN1xzvgxvnfkZfIc2Ri42Gb_solrmvUooTpqqRMENTAtAj4_5u4eJaXRGJfywrLTxqyMGmPEq0N2VcS3d4JHKuiuic43oQgFfNK3cm9PU0PWYBqOvhY2eYj_U31Mp2HSwIY-NVYYPNv2qR8InAqHhJQ',
                    'use': 'sig'
                }
            ]
        }
    }
}
