import getPrisma from '@api/helpers/getPrisma'
import Link from '@app/atoms/Link'
import generateJobStructuredData from '@app/helpers/generateJobStructuredData'
import generateKeyFromValue from '@app/helpers/generateKeyFromValue'
import { humanizeDeepDates } from '@app/helpers/humanizeDeepDates'
import renderMarkdown from '@app/helpers/renderMarkdown'
import { JOB_CONTRACT_TYPE_LABEL } from '@common/constants'
import { JobSource, JobState } from '@prisma/client'
import dayjs from 'dayjs'
import Head from 'next/head'
import * as R from 'ramda'

import type { JobWithRelation } from '@app/organisms/JobCard'
import type { LegacyJobWithRelation } from '@app/organisms/LegacyJobCard'
import type { Job, LegacyJob } from '@prisma/client'

const isJobExpired = (job: Job) => dayjs(job.expiredAt).isBefore(dayjs(), 'day')
const isLegacyJobExpired = (job: LegacyJob) => !job.isMigrated && dayjs(job.limitDate).isBefore(dayjs(), 'day')

type JobPageProps =
  | {
      data: JobWithRelation
      isExpired: boolean
      isNew: true
    }
  | {
      data: LegacyJobWithRelation
      isExpired: boolean
      isNew: false
    }

export default function JobPage({ data, isExpired, isNew }: JobPageProps) {
  const pageTitle = `${data.title} | metiers.numerique.gouv.fr`

  if (isNew) {
    const job = data as JobWithRelation
    const pageDescription = job.missionDescription
    const structuredData = generateJobStructuredData(job)

    return (
      <>
        <Head>
          <title>{pageTitle}</title>

          <meta content={pageDescription} name="description" />
          <meta content={pageTitle} property="og:title" />
          <meta content={pageDescription} property="og:description" />

          {!isExpired && <script type="application/ld+json">{structuredData}</script>}
        </Head>

        <div className="fr-container" id="job-detail">
          <div className="fr-mb-4w fr-mt-6w">
            <h1>{job.title}</h1>
          </div>

          {isExpired && (
            <div className="fr-alert fr-alert--warning fr-my-2w">
              <p className="fr-alert__title">Cette offre a déjà été pourvue !</p>
              <p
                style={{
                  paddingTop: '1rem',
                }}
              >
                <Link href="/emplois">Voulez-vous rechercher un autre offre d’emploi ?</Link>
              </p>
            </div>
          )}

          <div className="fr-callout fr-px-0 fr-my-2w">
            <div className="fr-callout__text fr-text--lg">
              {!isExpired && job.updatedAt && (
                <div className="fr-grid-row fr-grid-row--gutters">
                  <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Mis à jour le</div>
                  <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">{job.updatedAt}</div>
                </div>
              )}

              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Recruteur</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  {job.recruiter.websiteUrl && (
                    <a href={job.recruiter.websiteUrl} rel="noopener noreferrer" target="_blank">
                      {job.recruiter.fullName || job.recruiter.name}
                    </a>
                  )}
                  {!job.recruiter.websiteUrl && (job.recruiter.fullName || job.recruiter.name)}
                </div>
              </div>

              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Localisation</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  {`${job.address.street} ${job.address.postalCode} ${job.address.city}`}
                </div>
              </div>

              {Boolean(job.contractTypes.length) && (
                <div className="fr-grid-row fr-grid-row--gutters">
                  <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Types de contrat</div>
                  <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                    {job.contractTypes.map(contractType => JOB_CONTRACT_TYPE_LABEL[contractType]).join(', ')}
                  </div>
                </div>
              )}

              {job.salaryMin && job.salaryMax && (
                <div className="fr-grid-row fr-grid-row--gutters">
                  <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Rémunération</div>
                  <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                    <p>{`Entre ${job.salaryMin}K€ et ${job.salaryMax}K€ brut, selon l’expérience.`}</p>
                  </div>
                </div>
              )}

              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Expérience requise</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  <p>{job.seniorityInMonths} mois</p>
                </div>
              </div>
            </div>
          </div>

          <div className="fr-my-4w" id="job-detail-main-fields">
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>Mission</h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.missionDescription)}</div>
            </div>

            {job.teamDescription && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-col-md-3">
                  <h3>Équipe</h3>
                </div>
                <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.teamDescription)}</div>
              </div>
            )}

            {job.perksDescription && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-col-md-3">
                  <h3>Avantages</h3>
                </div>
                <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.perksDescription)}</div>
              </div>
            )}

            {job.tasksDescription && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-col-md-3">
                  <h3>Votre rôle</h3>
                </div>
                <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.tasksDescription)}</div>
              </div>
            )}

            {job.profileDescription && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-col-md-3">
                  <h3>Votre profil</h3>
                </div>
                <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.profileDescription)}</div>
              </div>
            )}

            {job.particularitiesDescription && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-col-md-3">
                  <h3>
                    Conditions particulières
                    <br />
                    du poste
                  </h3>
                </div>
                <div className="fr-col-12 fr-col-md-9">{renderMarkdown(job.particularitiesDescription)}</div>
              </div>
            )}
          </div>
        </div>

        <div
          className="trk-candidature fr-container fr-py-4w fr-text--lg"
          style={{
            backgroundColor: '#F0F0F0',
          }}
        >
          {!isExpired && job.infoContact && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">Si vous avez des questions</div>
              <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">{job.infoContact.name}</div>
            </div>
          )}

          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-3">Date Limite</div>
            <div
              className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0"
              style={{
                color: isExpired ? 'red' : 'inherit',
                fontWeight: 700,
              }}
            >
              {job.expiredAt}
            </div>
          </div>

          {!isExpired && job.processDescription && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">Processus de recrutement</div>
              <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">{renderMarkdown(job.processDescription)}</div>
            </div>
          )}

          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-3">
              <p>Référence interne</p>
            </div>
            <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
              <p>
                <code>{job.id.toUpperCase()}</code>
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  const legacyJob = data as LegacyJobWithRelation
  const pageDescription = legacyJob.mission || ''

  return (
    <>
      <Head>
        <title>{pageTitle}</title>

        <meta content={pageDescription} name="description" />
        <meta content={pageTitle} property="og:title" />
        <meta content={pageDescription} property="og:description" />
      </Head>

      <div className="fr-container" id="job-detail">
        <div className="fr-mb-4w fr-mt-6w">
          <h1>{legacyJob.title}</h1>
        </div>

        {isExpired && (
          <div className="fr-alert fr-alert--warning fr-my-2w">
            <p className="fr-alert__title">Cette offre a déjà été pourvue !</p>
            <p
              style={{
                paddingTop: '1rem',
              }}
            >
              <Link href="/emplois">Voulez-vous rechercher un autre offre d’emploi ?</Link>
            </p>
          </div>
        )}

        <div className="fr-callout fr-px-0 fr-my-2w">
          <div className="fr-callout__text fr-text--lg">
            {!isExpired && legacyJob.updatedAt && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Mis à jour le</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  <p>{legacyJob.updatedAt}</p>
                </div>
              </div>
            )}

            {legacyJob.legacyService?.legacyEntity && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Entité parente</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  <p>{legacyJob.legacyService.legacyEntity.fullName || legacyJob.legacyService.legacyEntity.name}</p>
                </div>
              </div>
            )}
            {!legacyJob.legacyService?.legacyEntity && Boolean(legacyJob.department.length) && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Entité parente</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  <p>{legacyJob.department.join(', ')}</p>
                </div>
              </div>
            )}

            {legacyJob.legacyService && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Entité recruteuse</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  <p>
                    {legacyJob.legacyService.url && (
                      <a href={legacyJob.legacyService.url} rel="noopener noreferrer" target="_blank">
                        {legacyJob.legacyService.fullName || legacyJob.legacyService.name}
                      </a>
                    )}
                    {!legacyJob.legacyService.url && (legacyJob.legacyService.fullName || legacyJob.legacyService.name)}
                  </p>
                </div>
              </div>
            )}
            {!legacyJob.legacyService && legacyJob.entity && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Entité recruteuse</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  <p>{legacyJob.entity}</p>
                </div>
              </div>
            )}

            {Boolean(legacyJob.locations.length) && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Localisation</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  {legacyJob.locations.map(location => (
                    <p key={generateKeyFromValue(location)}>{location}</p>
                  ))}
                </div>
              </div>
            )}

            {Boolean(legacyJob.openedToContractTypes.length) && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w" />
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  <p>{legacyJob.openedToContractTypes.join(', ')}</p>
                </div>
              </div>
            )}

            {legacyJob.salary && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Rémunération</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  <p>{legacyJob.salary}</p>
                </div>
              </div>
            )}

            {Boolean(legacyJob.experiences.length) && (
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-pl-4w fr-col-md-3 fr-pl-md-8w">Expérience</div>
                <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
                  <p>{legacyJob.experiences.join(', ')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="fr-my-4w" id="job-detail-main-fields">
          {legacyJob.team && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>Équipe</h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(legacyJob.team)}</div>
            </div>
          )}

          {legacyJob.mission && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>Mission</h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(legacyJob.mission)}</div>
            </div>
          )}

          {legacyJob.tasks && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>Votre rôle</h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(legacyJob.tasks)}</div>
            </div>
          )}

          {legacyJob.advantages && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>
                  Les plus
                  <br />
                  du poste
                </h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(legacyJob.advantages)}</div>
            </div>
          )}

          {legacyJob.profile && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>Votre profil</h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(legacyJob.profile)}</div>
            </div>
          )}

          {legacyJob.conditions && (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-3">
                <h3>
                  Conditions particulières
                  <br />
                  du poste
                </h3>
              </div>
              <div className="fr-col-12 fr-col-md-9">{renderMarkdown(legacyJob.conditions)}</div>
            </div>
          )}
        </div>
      </div>

      <div
        className="trk-candidature fr-container fr-py-4w"
        style={{
          backgroundColor: '#F0F0F0',
        }}
      >
        {!isExpired && legacyJob.teamInfo && (
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-3">
              <p>Si vous avez des questions</p>
            </div>
            <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">{renderMarkdown(legacyJob.teamInfo)}</div>
          </div>
        )}

        {!isExpired && legacyJob.toApply && (
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-3">
              <p>Pour candidater</p>
            </div>
            <div
              className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0"
              style={{
                fontWeight: 700,
              }}
            >
              {renderMarkdown(legacyJob.toApply)}
            </div>
          </div>
        )}

        {!isExpired && legacyJob.more && (
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-3">
              <p>Pour en savoir plus</p>
            </div>
            <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">{renderMarkdown(legacyJob.more)}</div>
          </div>
        )}

        {legacyJob.limitDate && (
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-3">
              <p>Date Limite</p>
            </div>
            <div
              className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0"
              style={{
                color: isExpired ? 'red' : 'inherit',
                fontWeight: 700,
              }}
            >
              <p>{legacyJob.limitDate}</p>
            </div>
          </div>
        )}

        {!isExpired && legacyJob.hiringProcess && (
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-md-3">
              <p>Processus de recrutement</p>
            </div>
            <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">{renderMarkdown(legacyJob.hiringProcess)}</div>
          </div>
        )}

        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12 fr-col-md-3">
            <p>Référence interne</p>
          </div>
          <div className="fr-col-12 fr-pl-4w fr-col-md-9 fr-pl-md-0">
            <p>
              <code>{legacyJob.reference}</code>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  const prisma = getPrisma()

  const jobs = await prisma.job.findMany({
    where: {
      NOT: {
        state: JobState.DRAFT,
      },
    },
  })

  const nonExpiredJobs = jobs.filter(isJobExpired)

  const legacyJobs = await prisma.legacyJob.findMany({
    where: {
      NOT: {
        isMigrated: true,
        source: {
          in: [JobSource.PEP, JobSource.SKB],
        },
        state: JobState.DRAFT,
      },
    },
  })

  const nonExpiredLegacyJobs = legacyJobs.filter(isLegacyJobExpired)

  const slugs = R.pipe(R.map(R.prop('slug')), R.uniq)([...nonExpiredJobs, ...nonExpiredLegacyJobs])

  const paths = slugs.map(slug => ({
    params: { slug },
  }))

  return {
    fallback: 'blocking',
    paths,
  }
}

export async function getStaticProps({ params: { slug } }) {
  const prisma = getPrisma()

  const job = await prisma.job.findUnique({
    include: {
      address: true,
      applicationContacts: true,
      infoContact: true,
      profession: true,
      recruiter: true,
    },
    where: {
      slug,
    },
  })

  if (job !== null) {
    if (job.state !== JobState.PUBLISHED) {
      return {
        notFound: true,
      }
    }

    const isExpired = isJobExpired(job)
    const jobWithHumanDates = humanizeDeepDates(job)

    return {
      props: {
        data: jobWithHumanDates,
        isExpired,
        isNew: true,
      },
      revalidate: 300,
    }
  }

  const legacyJob = await prisma.legacyJob.findUnique({
    include: {
      legacyService: {
        include: {
          legacyEntity: true,
        },
      },
    },
    where: {
      slug,
    },
  })

  if (legacyJob === null || legacyJob.state !== JobState.PUBLISHED || legacyJob.isMigrated) {
    return {
      notFound: true,
    }
  }

  const isExpired = isLegacyJobExpired(legacyJob)
  const legacyJobWithHumanDates = humanizeDeepDates(legacyJob)

  return {
    props: {
      data: legacyJobWithHumanDates,
      isExpired,
      isNew: false,
    },
    revalidate: 300,
  }
}
