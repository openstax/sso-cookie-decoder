import { compactDecrypt, compactVerify, importSPKI } from 'jose'
import { cookieConfig } from './config';

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

    const { plaintext } = await compactDecrypt(value,
        Buffer.from(config.private_key),
        { contentEncryptionAlgorithms: ['A256GCM'], keyManagementAlgorithms: ['dir'] },
    )
    const { payload } = await compactVerify(
        plaintext,
        await importSPKI(config.public_key, 'RS256'),
        { algorithms: ['RS256'] },
    )
    const jwt = JSON.parse(payload.toString()) as Token
    return jwt.sub
}
