import * as crypto from 'crypto';

const GRACE_PERIOD_SECONDS = 5 * 60; // 5 minutes

import COOKIE from '../tmp/cookie-config.json'


type Application = {
    id: number
    name: string
}

export type User = {
    id: number
    name: string
    first_name: string
    last_name: string
    full_name: string
    title: string
    uuid: string
    faculty_status: string
    support_identifier: string
    is_administrator: boolean
    is_not_gdpr_location: boolean
    applications: Application[]
}

type Token = {
    sub: User
    iss: string
}


export function toBuff(a: string) {
    if ((String as any)['bytesFrom']) return (String as any).bytesFrom(a)
    return Buffer.from(a)
}

export function b64ToBuf(a: string) {
    if ((String as any)['bytesFrom']) return (String as any).bytesFrom(a, 'base64')
    return Buffer.from(a, 'base64')
}


function base64UrlDecode(str: string) {
    return b64ToBuf(str.replace(/-/g, '+').replace(/_/g, '/')).toString('utf8')
}

function verifyJWT(token:string, publicKey: string) {
    const [headerEncoded, payloadEncoded, signatureEncoded] = token.split('.');
    if (!headerEncoded || !payloadEncoded || !signatureEncoded) {
        throw new Error('Invalid token format');
    }

    const header = JSON.parse(base64UrlDecode(headerEncoded));
    if (header.alg !== 'RS256') {
        throw new Error('Only RS256 is supported');
    }

    const signature = b64ToBuf(signatureEncoded.replace(/-/g, '+').replace(/_/g, '/'))
    const verifier = crypto.createVerify('SHA256');
    verifier.update(headerEncoded + '.' + payloadEncoded);
    const isValid = verifier.verify(publicKey, signature);
    if (!isValid) {
        throw new Error('Invalid signature');
    }

    const payload = JSON.parse(base64UrlDecode(payloadEncoded));

    const currentTimestamp = Math.floor(Date.now() / 1000) - GRACE_PERIOD_SECONDS;

    if (!payload.exp || payload.exp < currentTimestamp) {
        throw new Error('token is expired')
    }
    if (payload.iss != 'OpenStax Accounts') {
        throw new Error(`invalid issuer ${payload.iss}`)
    }
    return payload as Token;
}


function decodeJWT(token: string, key: string) {
    console.log({token})
    const parts = token.split('.');
    if (parts.length != 5) {
        console.log(`invalid token parts length of ${parts.length}`)
        return null // not a JWT
    }

    const iv = b64ToBuf(parts[2])

    const decipher = crypto.createDecipheriv('aes-256-gcm', toBuff(key), iv, { authTagLength: 16 });

    const aad = new TextEncoder().encode(parts[0]);

    const cipherText = b64ToBuf(parts[3])

    const tag = b64ToBuf(parts[4])

    decipher.setAAD(aad, { plaintextLength: cipherText.length });
    decipher.setAuthTag(tag);

    const result = decipher.update(cipherText).toString('utf8')
    return result + decipher.final().toString('utf8')
}

export function getUserFromCookies(cookies: Record<string,Record<'value', string>>) {

    // const cookiePairs = cookies.split(';').map(pair => pair.trim());
    // let value = ''
    // for (const pair of cookiePairs) {
    //     const [key, encodedValue] = pair.split('=');
    //     if (key === COOKIE.name) {
    //         value = decodeURIComponent(encodedValue);
    //         break;
    //     }
    // }
    const cookie = cookies[COOKIE.name]
    if (!cookie?.value) return null

    const decoded = decodeJWT(cookie.value, COOKIE.private_key)
    if (!decoded) return null

    return verifyJWT(decoded, COOKIE.public_key).sub
}
