
'use strict';
import type { CloudFrontRequestHandler } from 'aws-lambda'
import { getUserFromCookies } from './src/decode'
import cookie from 'cookie'


export const handler:CloudFrontRequestHandler = async (event) => {
    //console.log(JSON.stringify(event, null, 2));

    const { request } = event.Records[0].cf;

    const cookies = request.headers.cookie?.[0]?.value
    if (!cookies) return request

    const user = await getUserFromCookies(cookie.parse(cookies))
    // console.log({ user })
    if (!user) return request

    Object.assign(request.headers, {
        'os-user-uuid': [{
            key: 'os-user-uuid',
            value: user.uuid || '',
        }],
        'os-user': [{
            key: 'os-user',
            value: JSON.stringify(user) || '',
        }],
    })

    return request
};
