import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { UserRole } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import { NextApiRequest, NextApiResponse } from 'next'

const BCRYPT_SALT_ROUNDS = 10

export default async function ApiSignUpEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return createAccount(req, res)
    default:
      return defaultResponse(req, res)
  }
}

export async function encryptPassword(password: string) {
  const salt = await bcryptjs.genSalt(BCRYPT_SALT_ROUNDS)

  return bcryptjs.hash(password, salt)
}

const createAccount = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, firstName, isRecruiter, lastName, password } = JSON.parse(req.body)
  const encryptedPassword = await encryptPassword(password)

  try {
    const updateResponse = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: encryptedPassword,
        role: isRecruiter ? UserRole.RECRUITER : UserRole.CANDIDATE,
      },
    })
    res.status(200).send(updateResponse)
  } catch (err) {
    handleError(err, 'pages/api/testimonies/[testimonyId].ts > query.updateTestimony()')
    res.status(400).end()
  }
}

const defaultResponse = (req: NextApiRequest, res: NextApiResponse) => res.status(404)
