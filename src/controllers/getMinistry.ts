import { Request, Response } from 'express'
import * as R from 'ramda'

import { CACHE_KEY } from '../constants'
import cache from '../helpers/cache'
import handleError from '../helpers/handleError'
import uncapitalizeFirstLetter from '../helpers/uncapitalizeFirstLetter'
import data from '../services/data'

export default async function getMinistry(req: Request, res: Response) {
  try {
    const ministries = await cache.getOrCacheWith(CACHE_KEY.MINISTRIES, data.getMinistries)

    const maybeMinistry = R.find(R.propEq('slug', req.params.slug), ministries)
    if (maybeMinistry === undefined) {
      res.status(404).render('404')

      return
    }

    res.render('ministryDetail', {
      ministry: maybeMinistry,
      pageDescription: `Tout savoir sur ${uncapitalizeFirstLetter(maybeMinistry.fullName)}.`,
      pageTitle: maybeMinistry.title,
      selectedMenu: 'institutions',
    })
  } catch (err) {
    handleError(err, 'controllers/getMinistry()', res)
  }
}
