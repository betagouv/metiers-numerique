import { Request, Response } from 'express'

import cache from '../helpers/cache'
import handleError from '../helpers/handleError'
import uncapitalizeFirstLetter from '../helpers/uncapitalizeFirstLetter'
import notionMinistry from '../services/notionMinistry'

export default async function getMinistry(req: Request, res: Response) {
  try {
    const { id } = req.params
    const cachedResult = await cache.getOrCacheWith(`MINISTRY.${id}`, async () => {
      const ministry = await notionMinistry.getOneById(id)

      return {
        ministry,
        pageDescription: `Tout savoir sur ${uncapitalizeFirstLetter(ministry.fullName)}.`,
        pageTitle: ministry.title,
      }
    })

    res.render('ministryDetail', cachedResult)
  } catch (err) {
    handleError(err, 'controllers/getMinistry()', res)
  }
}
