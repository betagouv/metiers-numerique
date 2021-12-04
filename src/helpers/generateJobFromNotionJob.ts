import Job from '../models/Job'
import { NotionJob } from '../types/NotionJob'
import convertNotionNodeToHtml from './convertNotionNodeToHtml'
import convertNotionNodeToStrings from './convertNotionNodeToStrings'
import handleError from './handleError'
import slugify from './slugify'

export default function generateJobFromNotionJob(notionJob: NotionJob) {
  try {
    const { id } = notionJob
    const title = convertNotionNodeToHtml(notionJob.properties.Name, true)
    if (title === undefined) {
      throw new Error(`Notion job #${id} has an undefined title.`)
    }

    return new Job({
      advantages: convertNotionNodeToHtml(notionJob.properties['Les plus du poste']),
      conditions: convertNotionNodeToHtml(notionJob.properties['Conditions particulières du poste']),
      createdAt: notionJob.properties.CreeLe.created_time,
      department: convertNotionNodeToStrings(notionJob.properties['Ministère']),
      entity: convertNotionNodeToHtml(notionJob.properties['Entité recruteuse']),
      experiences: convertNotionNodeToStrings(notionJob.properties['Expérience']),
      hiringProcess: convertNotionNodeToHtml(notionJob.properties['Processus de recrutement']),
      id: notionJob.id,
      limitDate: convertNotionNodeToHtml(notionJob.properties['Date limite'], true),
      locations: convertNotionNodeToStrings(notionJob.properties.Localisation),
      mission: convertNotionNodeToHtml(notionJob.properties.Mission),
      more: convertNotionNodeToHtml(notionJob.properties['Pour en savoir plus']),
      openedToContractTypes: convertNotionNodeToStrings(notionJob.properties['Poste ouvert aux']),
      profile: convertNotionNodeToHtml(notionJob.properties['Votre profil']),
      publicationDate: convertNotionNodeToHtml(notionJob.properties['Date de saisie']),
      reference: `MNN-${id}`,
      salary: convertNotionNodeToHtml(notionJob.properties['Rémunération']),
      slug: slugify(title, id),
      tasks: convertNotionNodeToHtml(notionJob.properties['Ce que vous ferez']),
      team: convertNotionNodeToHtml(notionJob.properties['Équipe']),
      teamInfo: convertNotionNodeToHtml(notionJob.properties['Si vous avez des questions']),
      title,
      toApply: convertNotionNodeToHtml(notionJob.properties['Pour candidater']),
      updatedAt: notionJob.properties.MisAJourLe.last_edited_time,
    })
  } catch (err) {
    handleError(err, 'helpers/generateJobFromNotionJob()')
  }
}