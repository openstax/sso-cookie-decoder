import { vi } from 'vitest'
import type { CookieConfig } from '../config'

// values stolen from auth-rails specs
// https://github.com/openstax/auth-rails/blob/master/spec/lib/openstax/auth/strategy_2_spec.rb

export const mockedSSMConfig = {

    SSMClient: function () {
        return {
            send: function () {
                return {
                    Parameter: {
                        Value: JSON.stringify({
                            name: 'oxtest',
                            private_key: 'yBhTdfUQAdN6yNjBSVfAkvPCTFL4UNmP',
                            public_key: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA17N1RoNlOqqCUOv68/4e
vL7ojX2Ay9ocK+eve8tAVKSsj+dAOiUWhZqdkk/1KvaHw3+ezSyr2oQsEOBu91Zs
xch0rHSRACECCJW9c7cfv8Hg6nWmXOeT35XtLXw9EyHjHwGNEiEt1VzAjZBhmP2b
wXwn7wVJASgg5VCbkROxoWbXCZ5ufgyl64B97ETWm4HnNKCY7N35EURmDGfOEC4z
Er8b20F0QAT5kDBFuT+OIy6dBAkYccQdVVCdZNBBRW/a0e8VPP0KZuAr6GIyMRpU
auvQygT1q2Xce1jQ79LBuCih7R3VvH3R+Z0Y87ZTdVPyxcLWrQU4nw8Q+uVqO3UL
GwIDAQAB
-----END PUBLIC KEY-----
`,
                        } as CookieConfig)
                    }
                }
            }
        }
    },
    GetParameterCommand: function () {
        return {}
    }
}
