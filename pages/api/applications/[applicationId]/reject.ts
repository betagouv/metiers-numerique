import { prisma } from '@api/libs/prisma'
import { sendJobApplicationRejectedEmail } from '@api/libs/sendInBlue'
import { handleError } from '@common/helpers/handleError'
import { JobApplicationStatus } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function ApiRejectJobApplicationEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      return rejectJobApplication(req, res)
    default:
      return defaultResponse(req, res)
  }
}

const rejectJobApplication = async (req: NextApiRequest, res: NextApiResponse) => {
  const { applicationId } = req.query

  const { rejectionReasons } = JSON.parse(req.body)
  try {
    const updateResponse = await prisma.jobApplication.update({
      data: { rejectionReasons, status: JobApplicationStatus.REJECTED },
      where: { id: applicationId as string },
    })

    await sendJobApplicationRejectedEmail(updateResponse.id)

    res.status(200).send(updateResponse)
  } catch (err) {
    handleError(err, 'pages/api/domains/[domainId].ts > query.updateDomain()')
    res.status(400).end()
  }
}

const defaultResponse = (req: NextApiRequest, res: NextApiResponse) => res.status(404)
