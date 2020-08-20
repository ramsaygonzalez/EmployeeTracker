var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table')

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
        "View all departments",
        "View all roles",
        "View all employees",
        "Update an employee role"
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

        case "Update an employee role":
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


function addRole() {
  // query the database for all departments
  connection.query("SELECT * FROM departments", function (err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the title of this role?"
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary of this role?"
        },
        {
          name: "choice",
          type: "rawlist",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push({ name: results[i].name, value: results[i].department_ID });
            }
            return choiceArray;
          },
          message: "What department would you like to add?"
        }
      ])
      .then(function (answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].department_ID === answer.choice) {
            chosenItem = results[i];
          }
        }

        // console.log(answer);

        connection.query(
          "INSERT INTO roles SET ?",
          [
            {
              title: answer.title,
              salary: answer.salary,
              department_ID: chosenItem.department_ID
            }
          ],
          function (error) {
            if (error) throw err;
            console.log("Role added successfully!");
            runTracker();
          }
        );
      }
      );
  });
}

function addEmployee() {
  // query the database for all roles
  connection.query("SELECT * FROM roles", function (err, results) {
    if (err) throw err;
    // console.log(results)
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "What is the first name of the employee?"
        },
        {
          name: "last_name",
          type: "input",
          message: "What is the last name of the employee?"
        },
        {
          name: "choice",
          type: "rawlist",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push({ name: results[i].title, value: results[i].role_ID });
            }
            return choiceArray;
          },
          message: "What role does this employee have?"
        }
      ])
      .then(function (answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].role_ID === answer.choice) {
            chosenItem = results[i];
          }
        }

        // console.log(answer);

        connection.query(
          "INSERT INTO employees SET ?",
          [
            {
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_ID: chosenItem.role_ID
            }
          ],
          function (error) {
            if (error) throw err;
            console.log("Employee added successfully!");
            runTracker();
          }
        );
      }
      );
  });
}

function updateRole() {

}

function viewDepartments() {
  console.log("Selecting all departments...\n");
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    const table = cTable.getTable(res)

    console.log(table);
    runTracker();
  });
}

function viewRoles() {
  console.log("Selecting all roles...\n");
  connection.query("SELECT roles.title As Role, departments.name AS Department, roles.salary As Salary FROM roles LEFT JOIN departments on roles.department_ID = departments.department_ID;", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    const table = cTable.getTable(res)

    console.log(table);
    runTracker();
  });
}

function viewEmployees() {
  console.log("Selecting all employees...\n");
  connection.query("SELECT employees.employee_ID As Employee_ID, employees.first_name As First_Name, employees.last_name As Last_Name, departments.name As Department, roles.title As Role, roles.salary As Salary FROM employees LEFT JOIN roles on roles.role_ID = employees.role_ID LEFT JOIN departments on roles.department_ID = departments.department_ID;", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    const table = cTable.getTable(res)
    console.log(table);
    runTracker();
  });
}