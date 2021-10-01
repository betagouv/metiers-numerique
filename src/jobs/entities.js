'use strict';

/**
 * JobParams
 * @typedef {Object} JobParams
 * @property {string} id
 * @property {string} title
 * @property {string} mission
 * @property {string[]} tasks
 * @property {string} profile
 * @property {string[]} experiences
 * @property {string[]} locations
 * @property {string[]} department
 * @property {string[]} openedToContractTypes
 * @property {string} salary
 * @property {string} team
 */

/**
 * @extends JobParams
 * @class
 */
module.exports = class Job {
    /**
     * @param {JobParams} job
     */
    constructor({
                    id,
                    title,
                    mission,
                    tasks,
                    profile,
                    experiences,
                    locations,
                    department,
                    openedToContractTypes,
                    salary,
                    team
                }) {
        this.id = id;
        this.title = title;
        this.mission = mission;
        this.experiences = experiences;
        this.locations = locations;
        this.department = department;
        this.openedToContractTypes = openedToContractTypes;
        this.salary = salary;
        this.team = team;
        this.tasks = tasks;
        this.profile = profile;
    }
};