import * as crypto from 'crypto';
import { cookieConfig } from './config';

const GRACE_PERIOD_SECONDS = 5 * 60; // 5 minutes

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

function base64UrlDecode(str: string) {
    return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
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

    const signature = Buffer.from(signatureEncoded.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
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
    const splitInput = token.split('.');
    const iv = Buffer.from(splitInput[2], 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key), iv, { authTagLength: 16 });

    const aad = new TextEncoder().encode(splitInput[0]);
    const cipherText = Buffer.from(splitInput[3], 'base64');
    const tag = Buffer.from(splitInput[4], 'base64');

    decipher.setAAD(aad, { plaintextLength: cipherText.length });
    decipher.setAuthTag(tag);

    const result = Buffer.concat([
        decipher.update(cipherText),
        decipher.final(),
    ]);

    return result.toString('utf-8')

}

export async function getUserFromCookies(cookies: string) {

    const config = await cookieConfig()

    const cookiePairs = cookies.split(';').map(pair => pair.trim());
    let value = ''
    for (const pair of cookiePairs) {
        const [key, encodedValue] = pair.split('=');
        if (key === config.name) {
            value = decodeURIComponent(encodedValue);
            break;
        }
    }

    if (!value) return null

    const decoded = decodeJWT(value, config.private_key)

    return verifyJWT(decoded, config.public_key).sub
}
