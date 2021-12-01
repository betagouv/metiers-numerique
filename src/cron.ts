import ß from 'bhala'
import { CronJob } from 'cron'

import updatePepJobs from './jobs/updatePepJobs'

const { FEATURE_FLAG_FETCH_PEP_JOBS } = process.env

const jobs = [
  {
    // every day at 8:00
    cronTime: '0 8 * * *',
    isActive: FEATURE_FLAG_FETCH_PEP_JOBS === 'true',
    name: 'Update PEP Jobs',
    onTick: updatePepJobs,
  },
]

let activeJobs = 0
for (const job of jobs) {
  const cronjob = { start: true, timeZone: 'Europe/Paris', ...job }

  if (!cronjob.isActive) {
    ß.error(`The job "${cronjob.name}" is OFF`)

    // eslint-disable-next-line no-continue
    continue
  }

  ß.info(`The job "${cronjob.name}" is ON ${cronjob.cronTime}`)
  // eslint-disable-next-line no-new
  new CronJob(cronjob)
  // eslint-disable-next-line no-plusplus
  activeJobs++
}

ß.info(`Started ${activeJobs} / ${jobs.length} cron jobs`)