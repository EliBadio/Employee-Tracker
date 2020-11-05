const mysql = require("mysql");
const inquirer = require('inquirer');
const cTable = require('console.table')

// here you have to add your url or domain to connect
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "myPass12312020",
  database: "employee_tracker_db"
});

// this is your connection syntax
connection.connect(function(err) {
  if (err) throw err;
  console.log(" connection was successful, connected as id " + connection.threadId);
  
  runApp();
});

function runApp() {
  inquirer.prompt([
   {
     name: 'action',
     type: 'list',
     message: 'What would you like to do?',
     choices: [
       'Add department',
       'Add role',
       'Add employee',
       'View departments',
       'View roles',
       'View employees',
       'Update employee role',
       'Exit'
     ]
   }
  ]).then(response => {
    switch(response.action) {
      case 'Add department':
        addDepartment();
        break;
      case 'Add role':
        addRole();
        break;
      case 'Add employee':
        addEmployee();
        break;
      case 'View departments':
        viewDepartment();
        break;
      case 'View roles':
        viewRoles();
        break;
      case 'View employees':
        viewEmployees();
        break;
      case 'Update employee role':
        updateEmployeeRole();
        break;
      case 'Exit':
        process.exit();
      
    }
  })
}
function addDepartment() {
  inquirer
    .prompt({
      name: 'department',
      type: 'input',
      message: 'Enter new department',
    })
    .then(input => {
      if (input) {
        connection.query(
          `INSERT INTO department (name) VALUES ("${input.department}");`,
          (err, res) => {
            if (err) throw err;
            console.log(`${input.department} was added to departments.`);

            runApp();
          }
        );
      }
    });
}

function addRole() {
  let departments = {
    name: [],
    id: [],
  };

  connection.query('SELECT * FROM department;', (err, res) => {
    if (err) throw err;
    for (dep of res) {
      departments.name.push(dep.name);
      departments.id.push(dep.id);
    }
  });

  inquirer
    .prompt([
      {
        name: 'role_title',
        type: 'input',
        message: 'Enter new role title:',
      },
      {
        name: 'role_salary',
        type: 'input',
        message: 'Enter new role salary:',
      },
    ])
    .then(answers => {
      // select department to add role
      inquirer
        .prompt({
          name: 'department',
          type: 'list',
          message: "Choose the role's department:",
          choices: departments.name,
        })
        .then(input => {
          let index = departments.name.indexOf(input.department);
          let id = departments.id[index];

          let sql = `INSERT INTO role (department_id, title, salary) VALUES ("${id}", "${answers.role_title}", "${answers.role_salary}");`;

          connection.query(sql, (err, res) => {
            if (err) throw err;

            console.log(
              `${answers.role_title} was added to the ${input.department} Department.`
            );

            runApp();
          });
        });
    });
}

function addEmployee() {
  // Get roles from DB and save to roles array
  let roles = {
    id: [],
    title: [],
  };
  connection.query('SELECT * FROM role;', (err, res) => {
    if (err) throw err;
    for (role of res) {
      roles.id.push(role.id);
      roles.title.push(role.title);
    }
  });

  // Get employees from DB and save to employees array
  let employees = {
    id: [],
    name: [],
  };
  connection.query('SELECT * FROM employee;', (err, res) => {
    if (err) throw err;
    for (empl of res) {
      employees.name.push(empl.first_name + ' ' + empl.last_name);
      employees.id.push(empl.id);
    }
    employees.name.push('None');
    employees.id.push(0);
  });

  // request for new employee details
  inquirer
    .prompt([
      {
        name: 'first_name',
        type: 'input',
        message: 'Enter employee first name',
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'Enter employee last name',
      },
    ])
    .then(answer => {
      // request for employee role. To be selected from the roles array
      inquirer
        .prompt({
          name: 'role',
          type: 'list',
          message: 'Choose employee role:',
          choices: roles.title,
        })
        .then(input => {
          let index = roles.title.indexOf(input.role);
          let role_id = roles.id[index];

          // request for employee manager. To be selected from the employees array
          inquirer
            .prompt({
              name: 'manager',
              type: 'list',
              message: "Choose the employee's manager:",
              choices: employees.name,
            })
            .then(input => {
              let index = employees.name.indexOf(input.manager);
              let manager_id = employees.id[index];

              let sql = `INSERT INTO employee (role_id, first_name, last_name, manager_id) VALUES ("${role_id}", "${answer.first_name}", "${answer.last_name}", "${manager_id}");`;

              // If new employee doesn't have a manager from the list
              if (index === employees.name.length - 1) {
                sql = `INSERT INTO employee (role_id, first_name, last_name) VALUES ("${role_id}", "${answer.first_name}", "${answer.last_name}");`;
              }

              connection.query(sql, (err, row) => {
                if (err) throw err;

                console.log(
                  `${answer.first_name} was added to the employee database!`
                );

                runApp();
              });
            });
        });
    });
}

function viewDepartment() {
  connection.query('SELECT * FROM department;', (err, res) => {
    if (err) throw err;
    console.table(res);
    runApp();
  });
}

function viewRoles() {
  connection.query('SELECT * FROM role;', (err, res) => {
    if (err) throw err;
    console.table(res);
    runApp();
  });
}

function viewEmployees() {
  connection.query('SELECT * FROM employee;', (err, res) => {
    if (err) throw err;
    console.table(res);
    runApp();
  });
}

function updateEmployeeRole() {
  // Get roles from DB and save to roles array
  let roles = {
    id: [],
    title: [],
  };
  connection.query('SELECT * FROM role;', (err, res) => {
    if (err) throw err;
    for (role of res) {
      roles.id.push(role.id);
      roles.title.push(role.title);
    }
  });

  // Get employee names from DB and save to roles array
  let employeeNames = {
    id: [],
    name: [],
  };
  connection.query('SELECT * FROM employee;', (err, row) => {
    if (err) throw err;
    for (emp of row) {
      employeeNames.name.push(emp.first_name + ' ' + emp.last_name);
      employeeNames.id.push(emp.id);
    }

    // ask for employee whose role would be updated
    inquirer
      .prompt({
        name: 'name',
        type: 'list',
        message: 'Choose the employee to be updated:',
        choices: employeeNames.name,
      })
      .then(input => {
        let index = employeeNames.name.indexOf(input.name);
        let id = employeeNames.id[index];

        let empName = input.name;

        // ask for new employee role. To be selected from the roles array
        inquirer
          .prompt({
            name: 'role',
            type: 'list',
            message: 'Choose employee new role:',
            choices: roles.title,
          })
          .then(input => {
            let index = roles.title.indexOf(input.role);
            let role_id = roles.id[index];
            let sql = `UPDATE employee SET role_id=${role_id} WHERE id=${id};`;

            connection.query(sql, (err, row) => {
              if (err) throw err;
              console.log(`${empName} new role is ${input.role}`);

              runApp();
            });
          });
      });
  });
}

function viewEmployeeByManager() {
  let employee = {
    id: [],
    name: [],
  };
  connection.query('SELECT * FROM employee;', (err, res) => {
    if (err) throw err;
    for (emp of res) {
      employee.name.push(emp.first_name + ' ' + emp.last_name);
      employee.id.push(emp.id);
    }

    inquirer
      .prompt({
        name: 'name',
        type: 'list',
        message: 'Select Manager',
        choices: employee.name,
      })
      .then(input => {
        let index = employee.name.indexOf(input.name);
        let man_id = employee.id[index];
        connection.query(
          `SELECT * FROM employee WHERE manager_id="${man_id}"`,
          (err, res) => {
            if (err) throw err;
            console.table(res);
            runApp();
          }
        );
      });
  });
}

