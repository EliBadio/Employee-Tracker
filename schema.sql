DROP DATABASE IF EXISTS employee_tracker_db;

-- Create DB --
CREATE DATABASE employee_tracker_db;
use employee_tracker_db;

CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT
);

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT NULL
);

INSERT INTO department (name)
VALUES ("web development");
INSERT INTO department (name)
VALUES ("sales");

INSERT INTO role (title, salary, department_id)
VALUES ("react engineer", 1500, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("javascript engineer", 2000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("sales manager", 800, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("sales assistant", 100, 2);

INSERT INTO employee (role_id, first_name, last_name)
VALUES (1, "james", "Matt");
INSERT INTO employee (role_id, first_name, last_name)
VALUES (2, "David", "Stuart");
INSERT INTO employee (role_id, first_name, last_name)
VALUES (3, "Maryjames", "Scott");
INSERT INTO employee (role_id, first_name, last_name)
VALUES (4, "Eli", "B");
INSERT INTO employee (role_id, first_name, last_name)
VALUES (5, "Marie", "Patt");
INSERT INTO employee (role_id, first_name, last_name)
VALUES (6, "Karry", "Louis");
INSERT INTO employee (role_id, first_name, last_name)
VALUES (7, "Rose", "Patrick");
INSERT INTO employee (role_id, first_name, last_name)
VALUES (8, "Mary", "Stanley");

select * from employee;
