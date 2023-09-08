import { describe, test, expect, vi, afterEach } from 'vitest'

import { getUserFromCookies } from '../decode'

vi.mock('@aws-sdk/client-ssm', async () => {
    return (await import('./mock-ssm')).mockedSSMConfig
})

describe('Decoding cookie', () => {

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('values match', async () => {
        const cookie = await getUserFromCookies({
            oxtest:  'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..8tfXLa2g902VQhQw.XN0IZ5xSxwaillLaFeulneE-evbFcjtDj_o2VxOv7GQpfp1R2nuK1JI-KJz_HZcU23RFNmlHbB2hl_yGBaLbhGWiwRwGR2ugj2xkWbk_T6hZufSC7Dgd_Pu1aYpPSTyT9COk8KQUY2joCUfRTdhvamuvdPZKGknDJXH3YkxLLPuzNwSPB_Y7WStchZLbdBMpvZvCkzYbKDCSJStiIseY_084bG1NJrUEReN_L_h0obcC4vPl7zP2WyoSnVgsLi6sJf9emSUyNSk1qZM0-9XNadKrRdEqUIoQp8wI822mySMyAN7nlYu7gwXf8EVEltNSy8R7_2vvhbdL_1KSV3BGKPvnFFD8egUPOeD9_K4zTQbsUxaq2V7rebWFP_Lz7bKZLmrcW3kdZkwbAWLlVwiZNTVZWIHmrARaSoGS8WjOrsozhWM6hpUaugYls-S7EUTT_wyGrFlJf9EydASqZ5qAAIEtu1PCJlEkvZmO3KbVwuIAsDhz3p_71tnxBOC0SogajMgTz1aSkmGagt-GgGyyoQBxV4xV4ZR21ueiyrEq1-Z8OGS2WOTgytHCNLakkqaSaU6vYYD6-V23gtG9f_gluEioAcQqNzaLXOuMrtYvowunl8ayOb9emHMU4OvdoOpLPbsbynWI7mFN012b0Lhp83UpDyldesL4RUhGeG-IpIgQ8hMGn5wGY8nBBMukTOUfvKGo9BsBVBpC3WkT2Kpp27yOK99ZSCv5stzXc9RHYmgQI0-g2zt0COB2BcAuD-bPxYN-T8K4dm7Ly4sY2_X2n7FVQv2PY9SW3pDT7EmYYIM9JkykR3Z-zl8qd5jvAZLpOB2Knx8sSzh2E62xXpfahGkIcoeE-I4l3uhBwOlOt7dzbYWPOrAc49Pq8uULjZFqoMYs4SYfKSjOVXP4EzyK6Vn3qBk0GmSmSZ4CAT3p_BM4YHDNZ4UrlJ2KZiJ9nX2fZYKrcD2TODorFswFhUtRcwTD2nHMgvCiTEn0JftNlUTAZFQ4SFlK3sYqLB8h3npX2tRvi2Aeq3debQNzh7EkcjrpNAmJT_CRr4Bhsq9HmSGckstezud2-eVRGLPinK5GjIu6a0T4cC6uFAMiwPc6Xn463IAHJwfYi6X3YOInXN4PibRiimHsGX-tRlR4lF3oxt-pCqnOQiaJCv4WXgYWEVkL24rtBlPhFb_j33AzgIYRMc4KSHk0f3-h2Nzxioamf8v9YMTT12yNwm06FEH7i97SlGjSK3qalAFvS0-QYUuBgmGTSyjnKUpyIQKHkGP7zhdqYiFv889sESkvXcBtGcOey-NQ3SwhaQDLRy_qIMrzSSU93o3RDq7qOg4E7bohL5DPckrKTosH_XkTBdJPf6WIFfK6vXkOhjQV8d9TP4dWANuMnHaoUw4qVnpC2m28IoYf8xVGZlDe35_ZLhkM4fmOZ7qtLleqeTsqD2l47fU7TkeqD_-6zMQTIUDgB9RN4dG9KCGkB5mBlNb08sXiXG6B3lVsUanWVWqhIllAkR_QECKceb5LwZqXyHyDaxpb8WmdPhZBCCFC-XnOwZOfB5HKYV0gVe1tDiafquKoVKEJiOSx1zwQpKVEHMavlO3zfwR6IP-koQ_3qQWi8EElp54hdflkgcuSs_ikQI-J_hecl103am936i72f37oncfm21fXQgcH5_yZ7VpXR7_kpZ-lFdhziifXyUku0XrtnBdOoaBOuOkuSUyGOE3C6quxnZF5KSgNTJQsB86sT-6bbXCXx516qD1c9JcHiF140YXKmcK_Dj0fnHd-pb7QUQPd4dyVSJdhuZU.Hw6SUpXdyV36V1WQZJQN5Q',
        })

        expect(cookie).toContain({
            username: 'teacher01',
            uuid: 'd618168f-051e-4354-b208-e5d56dae1f24',
        })
  })

})
