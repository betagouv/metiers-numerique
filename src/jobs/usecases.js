'use strict';

const moment = require('moment');
const { JOB_FILTERS } = require('./utils');

const listJobs = async ({ jobsRepository }) => {
    return await jobsRepository.all();
};

const getJob = async (id, { jobsRepository }) => {
    return await jobsRepository.get(id);
};

const updateLatestActivePepJobs = async (pepJob, { jobsRepository, dateProvider }) => {
    const date = dateProvider.date();
    date.setDate(date.getDate() - 1);
    // import only offers published since yesterday
    let isNew = moment(pepJob.FirstPublicationDate, 'DD/MM/YYYY hh:mm:ss') > date;
    if (process.env.CRON_IMPORT_ALL) {
        isNew = true;
    }
    if (pepJob.JobDescription_ProfessionalCategory_ === 'Vacant' && JOB_FILTERS.includes(pepJob.JobDescription_PrimaryProfile_) && isNew) {
        const page = await jobsRepository.getPage(process.env.PEP_DATABASE_ID, pepJob.OfferID);
        if (!page) {
            await jobsRepository.createPage(process.env.PEP_DATABASE_ID, pepJob);
        }
        return true
    }

    return false;
};

module.exports = {
    listJobs,
    getJob,
    updateLatestActivePepJobs,
};
