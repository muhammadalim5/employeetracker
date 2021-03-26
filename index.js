const mysql = require('mysql')
const inquirer = require('inquirer')

require('dotenv').config()

require('console.table')

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employeeTracker_db',
});

connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log(`connected as id ${connection.threadId}\n`);
    employeeInfo();
});

function employeeInfo() {
    inquirer.prompt(
        {
            name: 'menu',
            type: 'list',
            message: 'Pick an option',
            choices: ['Add Department', 'View Department', 'Add Role', 'View Role', 'Add Employee', 'View Employee', 'Update Employee Role'],
        }
    )
        .then((answer) => {
           
            if (answer.menu === 'Add Department') {
                addDepartment();
            } else if (answer.menu === 'View Department') {
                viewDepartment();
            } else if (answer.menu === 'Add Role') {
                addRole();
            } else if (answer.menu === 'View Role') {
                viewRole();
            } else if (answer.menu === 'Add Employee') {
                addEmployee();
            } else if (answer.menu === 'Remove Employee') {
                removeEmployee();
            } else if (answer.menu === 'View Employee') {
                viewEmployee();
            } else if (answer.menu === 'Update Employee Role') {
                updateEmployeeRole();
            } else {
                connection.end();
            }
        });
}

function addDepartment() {
    inquirer.prompt(
        {
            name: 'newDeparment',
            type: 'input',
            message: 'Type in the new department you would like to add'
        }
    )
        .then((answer) => {
            const query = connection.query(
                'INSERT INTO department SET ?',
                {
                    name: answer.newDeparment
                },
                (err, res) => {
                    if (err) {
                        throw err;
                    }
                    console.log(`${res.affectedRows} New Department \n`);
                    employeeInfo();
                })
        })
}

function viewDepartment() {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) {
            throw err;
        }
        console.table(res);
        employeeInfo();
    });
}

function addRole() {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) {
            throw err;
        }
        const array = res.map(department => ({
            name: department.name,
            value: department.id
        }))
        inquirer.prompt(
            [
                {
                    name: 'newRole',
                    type: 'input',
                    message: 'Type in which role you would like to add!'
                },
                {
                    name: 'salary',
                    type: 'number',
                    message: 'Type in your preferred salary'
                },
                {
                    name: 'department',
                    type: 'list',
                    message: 'Choose the department',
                    choices: array
                }
            ]
        )
            .then((answer) => {
                const query = connection.query(
                    'INSERT INTO role SET ?',
                    {
                        title: answer.newRole,
                        salary: answer.salary,
                        department_id: answer.department
                    },
                    (err, res) => {
                        if (err) {
                            throw err;
                        }
                        console.log(`${res.affectedRows} You have added a new role!\n`);
                        employeeInfo();
                    })
            })
    });
}

function viewRole() {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) {
            throw err;
        }
        console.table(res);
        employeeInfo();
    });
}

function addEmployee() {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) {
            throw err;
        }
        const array = res.map(role => ({
            name: role.title,
            value: role.id
        }))
        inquirer.prompt(
            [
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'First Name'
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'Last Name'
                },
                {
                    name: 'role',
                    type: 'list',
                    message: 'Role',
                    choices: array
                },
                {
                    name: 'managerID',
                    type: 'input',
                    message: 'Manager ID'
                }
            ]
        )
            .then((answer) => {
                const query = connection.query(
                    'INSERT INTO employee SET ?',
                    {
                        first_name: answer.firstName,
                        last_name: answer.lastName,
                        role_id: answer.role,
                        manager_id: answer.managerID
                    },
                    (err, res) => {
                        if (err) {
                            throw err;
                        }
                        console.log(`${res.affectedRows} You have added a new employee!\n`);
                        employeeInfo();
                    })
            })
    });
}

function viewEmployee() {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) {
            throw err;
        }
        console.table(res);
        employeeInfo();
    });
}

function updateEmployeeRole() {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) {
            throw err;
        }
        const array1 = res.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }))
        connection.query('SELECT * FROM role', (err, res) => {
            if (err) {
                throw err;
            }
            const array2 = res.map(role => ({
                name: role.title,
                value: role.id
            }))
            inquirer.prompt(
                [
                    {
                        name: 'employee',
                        type: 'list',
                        message: 'Pick an employee to update',
                        choices: array1
                    },
                    {
                        name: 'newEmployeeRole',
                        type: 'list',
                        message: 'Select a new role',
                        choices: array2
                    }
                ]
            )
                .then((answer) => {
                    const query = connection.query(
                        'UPDATE employee SET role_id = ? WHERE id = ?',
                        [answer.newEmployeeRole, answer.employee],
                        (err, res) => {
                            if (err) {
                                throw err;
                            }
                            console.log(`${res.affectedRows} You have updated a role for an employee!\n`);
                            employeeInfo();
                        })
                })
        });
    });
}























