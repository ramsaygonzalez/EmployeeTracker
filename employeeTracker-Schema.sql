DROP DATABASE IF EXISTS employeeTrackerDB;
CREATE database employeeTrackerDB;

USE employeeTrackerDB;

CREATE TABLE departments
(
  department_ID INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NULL,
  PRIMARY KEY (department_ID)
);

CREATE TABLE roles
(
  role_ID INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL(10,4) NULL,
  department_ID INT NULL,
  PRIMARY KEY (role_ID),
  FOREIGN KEY (department_ID) REFERENCES departments(department_ID)
);

CREATE TABLE employees
(
  employee_ID INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_ID INT NULL,
  manager_ID INT NULL,
  PRIMARY KEY (employee_ID),
  FOREIGN KEY (role_ID) REFERENCES roles(role_ID),
  FOREIGN KEY (manager_ID) REFERENCES employees(employee_ID)
);