const axios = require("axios")
const inquire = require('inquirer')
const fs = require('fs');
//where i put all the inquirer enabled questions, properties were message name type and choices 
const questions = [
{
    message: 'what is your Github username?',
    name: 'username',
    type: 'input'
},
{
    message: 'what is your project title?',
    name: 'title',
    type: 'input'
},
{
    message: "what's the purpose of your project? why does it even exist?",
    name: 'purpose',
    type: 'input'
},
{
    message: 'what sections would you like to include in your project?',
    name: 'table',
    type: 'checkbox',
    choices: ['Intro','Body','Appendix','Conclusion','Epilogue', 'Bibliography']
},
{
    message: 'How would someone install your application?',
    name: 'installation',
    type: 'list',
    choices: ['npm','yarn','clone and go','BitTorrent']
},
{
    message: 'What license are you using?',
    name: 'license',
    type: 'list',
    choices: ['MIT License','GNU','To Kill','Eclipse']
},
{
    message: 'Who are the contributors to this project?',
    name: 'contributing',
    type: 'input'
}

];
//look up day 1 formatting of results...
function writeToFile(fileName, data) {
console.log(`${fileName}.md`);
console.log(data);
let answerTable = ""
//for loop to seperate out the outline answers into seperate bullet points...
for (let i=0; i < data.answers.table.length; i++) {
    answerTable += `* ${data.answers.table[i]}` + "\n"
}
let readmeContent = 
`
 # **${data.answers.title}**
 ## Project Purpose 
 * ### ${data.answers.purpose}
 ## Project Outline 
 ${answerTable}
 ## Project Installation
 * ### ${data.answers.installation} is necessary for the installation.
 ## Git User Info
 > ### ${data.answers.username} \n
 * <img src="${data.avatar_url}"><img>
 ## Project Licensing
 > __${data.answers.license}__
 ## Project Contributors
 > Thanks to ${data.answers.contributing} for contributing to this project. 
 > Without you, none of **this** would have been possible.   

 `
fs.writeFile(`${fileName}.md`, readmeContent, function(err){
    if(err){
        console.log(err)
        throw err
    }else{
        console.log('success')
    }
} )
}

function init() {
    inquire.prompt(questions)
    .then(answers=>{
        const queryUrl = `https://api.github.com/users/${answers.username}`;

        axios.get(queryUrl).then(function(res) {
          console.log(res.data);
          console.log(res.data.login);
          writeToFile(answers.username, {...res.data, answers})
          })
          .catch(error => {
            console.log(error)
          })
    })
    .catch(error => {
        console.log(error)
      })
    
}

init();
