import {SSMClient, GetParameterCommand} from "@aws-sdk/client-ssm"

export interface CookieConfig {
    name: string;
    private_key: string;
    public_key: string;
}

let COOKIE: CookieConfig | null = null

// @ts-ignore esbuild will substitute with build flag
export const ENV_NAME = __ENV_NAME__;

export async function cookieConfig() {
    if (COOKIE) {
        return COOKIE
    }

    const client = new SSMClient({ region: 'us-east-1' })
    const result = await client.send(new GetParameterCommand({
        Name: `/sso-cookie/${ENV_NAME}`,
        WithDecryption: true,
    }));


    if (!result.Parameter?.Value) {
        throw new Error('No values found for cookie secrets');
    }

    COOKIE = JSON.parse(result.Parameter.Value) as CookieConfig
    return COOKIE
}
