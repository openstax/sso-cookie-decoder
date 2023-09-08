//import { compactDecrypt, compactVerify, importSPKI } from 'jose'
import { cookieConfig } from './config';
import jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

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

export async function getUserFromCookies(
    cookies: Record<string, string>,
) {

    const config = await cookieConfig()

    const value = cookies[config.name]
    if (!value) return null

    const splitInput = value.split('.');
    const iv = Buffer.from(splitInput[2], 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(config.private_key), iv, { authTagLength: 16 });

    console.log(decipher)

    const aad = new TextEncoder().encode(splitInput[0]);
    const cipherText = Buffer.from(splitInput[3], 'base64');
    const tag = Buffer.from(splitInput[4], 'base64');

    decipher.setAAD(aad, { plaintextLength: cipherText.length });
    decipher.setAuthTag(tag);

    const result = Buffer.concat([
        decipher.update(cipherText),
        decipher.final(),
    ]);

    const plaintext = result.toString('utf-8')
    console.log(plaintext)

    const payload = jwt.verify(plaintext, config.public_key, {
      clockTolerance: 300 // 5 minutes
    });

    console.log(payload)


    // const { plaintext } = await compactDecrypt(value,
    //     Buffer.from(config.private_key),
    //     { contentEncryptionAlgorithms: ['A256GCM'], keyManagementAlgorithms: ['dir'] },
    // )
    // const { payload } = await compactVerify(
    //     plaintext,
    //     await importSPKI(config.public_key, 'RS256'),
    //     { algorithms: ['RS256'] },
    // )

    //const val = JSON.parse(payload.toString()) as Token
    return payload.sub
}
