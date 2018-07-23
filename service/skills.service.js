const _ = require('lodash');
const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);

function handleOverlap(dates) {
  const newDates = [];
  newDates.push(dates[0]);
  newDates.forEach((date, index) => {
    for (let i = index + 1; i < dates.length; i += 1) {
      if (newDates[index].start > dates[i].start
          && newDates[index].stop > dates[i].stop) {
        newDates[index].start = dates[i].start;
      }
      if (newDates[index].start < dates[i].start
          && newDates[index].stop < dates[i].stop) {
        newDates[index].stop = dates[i].stop;
      }
      if (newDates[index].stop < dates[i].start
        || newDates[index].start > dates[i].stop) {
        newDates.push(date[i]);
      }
    }
  });
  return newDates;
}

function datesToDurations(dates) {
  const dateWithoutOverlap = handleOverlap(dates);
  let nbMounth = 0;
  dateWithoutOverlap.forEach((date) => {
    const rangeDates = [
      date.start,
      date.stop,
    ];
    const range = moment.range(rangeDates);
    nbMounth += Math.round(range / 2629746000);
  });
  return nbMounth;
}

function computeDurations(skills) {
  const computedSkills = skills;
  const newSkills = [];
  computedSkills.forEach((skill) => {
    let mounthAmount = 0;
    mounthAmount = datesToDurations(skill.durations);
    newSkills.push({
      name: skill.name,
      duration: mounthAmount,
    });
  });
  return newSkills;
}

function getSkillsWithDurations(freelancer) {
  const skills = [];
  freelancer.freelance.professionalExperiences.forEach((experience) => {
    if (experience.skills) {
      experience.skills.forEach((skill) => {
        const newSkill = { id: skill.id, name: skill.name, durations: [] };
        if (!_.find(skills, { id: newSkill.id })) {
          newSkill.durations.push({
            start: new Date(experience.startDate),
            stop: new Date(experience.endDate),
          });
          skills.push(newSkill);
        } else {
          skills[_.findIndex(skills, { id: newSkill.id })]
            .durations.push({
              start: new Date(experience.startDate),
              stop: new Date(experience.endDate),
            });
        }
      });
    } else {
      console.log('JSON structure error');
    }
  });
  let skillWithDuration = false;
  if (skills.length !== 0) {
    skillWithDuration = computeDurations(skills);
  }
  return skillWithDuration;
}

module.exports = {
  getSkillsWithDurations,
};
