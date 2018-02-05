#!/usr/bin/env node

const fs = require('fs');
const inquirer = require('inquirer');

console.log('AWS Profile Switcher');

const homeDir = process.env['HOME']
const profileRegex = /\[profile .*]/g;
const bracketsRemovalRegx = /(\[profile )|(\])/g;
const clearProfileChoice = '*clear*';

const promptProfileChoice = (profiles) => {
  profiles.push(clearProfileChoice);

  const profileChoice = [
    {
      type: 'list',
      name: 'profile',
      message: 'Choose a profile',
      choices: profiles
    }
  ];

  inquirer.prompt(profileChoice).then(answers => {
    const profileChoice =
      answers.profile === clearProfileChoice ? '' : answers.profile;

    fs.writeFile(`${homeDir}/.awsps`, profileChoice, { flag: 'w' }, function (err) {
      if (err) {
        console.log('Error:', err);
      }
    });
  });
}

fs.readFile(`${homeDir}/.aws/config`, 'utf8', function(err, data) {
    if (err) {
      console.log('Error:', err);
    }

    const matches = data.match(profileRegex);

    if (!matches) {
      console.log('No profiles found.');
      console.log('Refer to this guide for help on setting up a new AWS profile:');
      console.log('https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html');

      return;
    }

    const profiles = matches.map((match) => {
      return match.replace(bracketsRemovalRegx, '');
    });

    promptProfileChoice(profiles);
});




