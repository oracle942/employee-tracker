const inquirer = require('inquirer');
// Connect to database
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'password',
    database: 'cms',
  },
  console.log(`Connected to the content management system database.`)
);

const rootOptions = [
  {
    type: 'list',
    name: 'root',
    message: 'What would you like to do?',
    choices: [
      'view all departments',
      'view all roles',
      'view all employees',
      'add a department',
      'add a role',
      'add an employee',
      'update an employee role',
    ],
  },
];
const addDepartment = [
  {
    type: 'input',
    name: 'department',
    message: 'Please enter the name of the department',
  },
];

const addRole = (array) => [
  {
    type: 'input',
    name: 'title',
    message: 'Please enter the name of the role',
  },
  {
    type: 'input',
    name: 'salary',
    message: 'Please enter the salary for the new role',
  },
  {
    type: 'list',
    name: 'department_id',
    message: 'what department does the new role belong to?',
    choices: array,
  },
];

const addEmployee = (array1, array2) => [
  {
    type: 'input',
    name: 'first_name',
    message: "Please enter the employee's first name",
  },
  {
    type: 'input',
    name: 'last_name',
    message: "Please enter the employee's last name",
  },
  {
    type: 'list',
    name: 'role_id',
    message: "What is the employee's job title?",
    choices: array2,
  },
  {
    type: 'list',
    name: 'manager_id',
    message: "Who is the employee's manager?",
    choices: array1,
  },
];

const updateEmployee = (array1, array2)  => [
  {
    type: 'list',
    name: 'employee_id',
    message: 'Please select and employee to update',
    choices: array1,
  },
  {
    type: 'list',
    name: 'role_id',
    message: 'Please enter the job title',
    choices: array2,

  },
];

function init() {
  inquirer.prompt(rootOptions).then((res) => {
    if (res.root === 'view all departments') {
      // View all departments
      db.query(
        `SELECT id AS 'DEPARTMENT ID', name AS 'DEPARTMENT NAME' FROM department`,
        function (err, results) {
          console.table(results);
          init();

        }
      );
    }
    if (res.root === 'view all roles') {
      console.log(res.root);
      // View all roles
      db.query(
        `SELECT role.title AS 'JOB TITLE', role.id AS 'ROLE ID', department.name AS 'DEPARTMENT', 
        role.salary as 'SALARY' FROM department JOIN role ON role.department_id = department.id`,
        function (err, results) {
          console.table(results);
          init();

        }
      );
    }
    if (res.root === 'view all employees') {
      // View all employees
      db.query(
        `SELECT employee.id AS 'EMPLOYEE ID' , employee.first_name AS 'FIRST', employee.last_name AS 'LAST', role.title AS 'JOB TITLE', department.name as 'DEPARTMENT', role.salary as 'SALARY', employee.manager_id as 'MANAGER' 
        FROM department 
        JOIN role ON role.department_id = department.id
        JOIN employee ON employee.role_id = role.id`,
        function (err, results) {
          console.table(results);
          init();

        }
      );
    }
    if (res.root === 'add a department') {
      inquirer.prompt(addDepartment).then((res) => {
        //  Add new department
        db.query(
          `INSERT into department (name) VALUES ('${res.department}')`,
          (err, data) => {
            if (err) console.log(err);
            init();
          }
        );
      });
    }
    if (res.root === 'add a role') {
      db.query('SELECT * FROM department', (err, data) => {
        if (err) console.log(err);
        else {
          // const option = [{name: 'department name', value: 0}]
          const formatted = [...data].map((department) => {
            return { name: department.name, value: department.id };
          });
          inquirer.prompt(addRole(formatted)).then((res) => {
            console.log(res);
            //  Add new role
            db.query(
              `INSERT into role (title, salary, department_id) VALUES ('${res.title}','${res.salary}','${res.department_id}')`,
              (err, data) => {
                if (err) console.log(err);
                init();
              }
            );
          });
        }
      });
    }
    if (res.root === 'add an employee') {
      db.query('SELECT * FROM employee', (err, data) => {
        if (err) console.log(err);
        else {
          // const option = [{name: 'department name', value: 0}]
          const formatted1 = [...data].map((employee) => {
            return { name: employee.first_name, value: employee.id };
          });
          db.query('SELECT * FROM role', (err, data) => {
            if (err) console.log(err);
            else {
              const formatted2 = [...data].map((role) => {
                return { name: role.title, value: role.id };
              });

              inquirer
                .prompt(addEmployee(formatted1, formatted2))
                .then((res) => {
                  console.log(res);
                  //  Add new employee
                  db.query(
                    `INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ('${res.first_name}','${res.last_name}','${res.role_id}','${res.manager_id}')`,
                    (err, data) => {
                      if (err) console.log(err);
                      init();
                    }
                  );
                });
            }
          });
        }
      });
    }

    if (res.root === 'update an employee role') {
      db.query('SELECT * FROM employee', (err, data) => {
        if (err) console.log(err);
        else {
          // const option = [{name: 'department name', value: 0}]
          const formatted1 = [...data].map((employee) => {
            return { name: employee.first_name, value: employee.id };
          });
          db.query('SELECT * FROM role', (err, data) => {
            if (err) console.log(err);
            else {
              const formatted2 = [...data].map((role) => {
                return { name: role.title, value: role.id };
              });
              inquirer.prompt(updateEmployee(formatted1, formatted2)).then((res) => {
                //  Update an employee role
                db.query(
                  `UPDATE employee SET role_id  = ${res.role_id} WHERE id = ${res.employee_id} `,
        
                  (err, data) => {
                    if (err) console.log(err);
                    init()
                  }
                );
              });
             
            }
          });
        }
      });
     
    
    }
  });
}

init();
