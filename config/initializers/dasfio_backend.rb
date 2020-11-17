# frozen_string_literal: true

Rails.configuration.x.desafio_backend = {
    domain: 'desafio_backend.duxcloud.com.br',
    title: '',
    description: '',
    logo: '',
    logo_mobile: '',
    favicon: '',
    cognito: {
        endpoint: 'https://desafio_backend_dousseau.auth.us-west-2.amazoncognito.com',
        pool_id: 'us-west-2_6Xkw88u6N',
        client_id: '35st5vd6bgd2th8m547369a0ob',
        jwk: {
            keys: [
                {
                    'alg': 'RS256',
                    'e': 'AQAB',
                    'kid': 'RX8Ifyrl7l3Br17IcIbwPZ/0MCgUlxWiw1T37NuQee0=',
                    'kty': 'RSA',
                    'n': 'rU5LHVehndG8gRv9pPddgieHwwmNgCj_5pEDoRA_osooK9lNtTliwmYq7b1NlvU86IbgupmWPPMf6WHEOrcNICJMGTLNNHvPVmT9rBRk5JJo5iuFPII68ekqfwo0WQqVMgMLtsctojCLTNrZ6HX5vkEHyUiEBOuikCmxLxMwd2DJ9Jz-AR5Sg9I9tV2D-_QF5wn40rTaxYGL5tomTd93lC6of_CyyKfHkCisi1FshptTzRY4T761BYMOKJdOCjOAMUXrj1uXGWHb2XVNFPLBWE2DmI768IFUXgSVCXXQFr2YiYAaWGBcBzJKhafd1x72U8-kli0GV0xJMNsy7Zjqcw',
                    'use': 'sig'
                },
                {
                    'alg': 'RS256',
                    'e': 'AQAB',
                    'kid': 'YOEbbOoiyFomCcO13KpMnS7dJlRUVvfNJRZ+2AmvWSg=',
                    'kty': 'RSA',
                    'n': 'sQIBjfP8iEeZkbGlou7sYFA8a4qKxBcAb3RBPtD_CTuSf1mrGoaapaP007kopLBxh7eT1mvnQnAw_scHuGT34YF1qH-juBkm0czS_X-BdfXzWWi5wDxB-VJnw9yDbqL8nvBmZYLx8OAll3eAMbwGizvmr-ISSDhlaVl4W8yrBAXowsCzivwDyjWt-f_7Uw3WTPUVqMm3fZjeoFhawkf-LG584efgCM6LlXAUl0j1ls7-UChhwSykz4SzvRQ6zCkQ1DAxnBlCkpxfcbSAA4AQKCKI3A-EgE3mSZaJMgtI1jGpnMaDM9akbfKJQrRGelFz0DkxfY9777ywSV_12L78uw',
                    'use': 'sig'
                }
            ]
        }
    }
}
