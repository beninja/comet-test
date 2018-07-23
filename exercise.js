const fs = require('fs');
const SkillsService = require('./service/skills.service');

const freelancerFile = './exercise/freelancer.json';

if (!fs.existsSync(freelancerFile)) {
  console.log('File does not exists');
}

let freelancer = fs.readFileSync(freelancerFile, 'utf8');

freelancer = JSON.parse(freelancer);

const output = {
  freelance: {},
};

output.freelance.id = freelancer.freelance.id;

if (freelancer.freelance && freelancer.freelance.professionalExperiences.length > 0) {
  output.freelance.computedSkills = SkillsService.getSkillsWithDurations(freelancer);
  const json = JSON.stringify(output);
  fs.writeFile('output.json', json, 'utf8', () => {
    console.log('JSON file generated');
  });
} else {
  console.log('JSON structure error');
}


// compute all skills duration

// output result
