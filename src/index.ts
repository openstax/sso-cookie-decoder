
'use strict';
import type { CloudFrontRequestHandler } from 'aws-lambda'
import { getUserFromCookies } from './decode'


export default function handler(event: any) {
    console.log(JSON.stringify(event, null, 2));

    const { request } = event; // .Records[0].cf;

    const cookies = request.cookies;
    console.log({ cookies })
    if (!cookies) return request

    const user = getUserFromCookies(cookies)
    console.log({ user })

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
}
