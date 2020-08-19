var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Rg1410050!",
  database: "employeeTrackerDB"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected");
  runTracker();
});

function runTracker() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add a department",
        "Add a role",
        "Add an employee",
        "View departments",
        "View roles",
        "View employees",
        "Update employee role"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Add a department":
          addDepartment();
          break;

        case "Add a role":
          addRole();
          break;

        case "Add an employee":
          addEmployee();
          break;

        case "View all departments":
          viewDepartments();
          break;

        case "View all roles":
          viewRoles();
          break;

        case "View all employees":
          viewEmployees();
          break;

        case "Update employee role":
          updateRole();
          break;
      }
    });
}
// function to handle posting new departments
function addDepartment() {
  // prompt for info about the department being added
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the department you want to add?"
      },
    ])
    .then(function (answer) {
      // when finished prompting, insert a new department into the db with that info
      connection.query(
        "INSERT INTO departments SET ?",
        {
          name: answer.name
        },
        function (err) {
          if (err) throw err;
          console.log("Your department was created successfully!");
          // re-prompt the user for desired action
          runTracker();
        }
      );
    });
}