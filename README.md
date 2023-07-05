# ufinity_interview_assignment

This is the codebase for Ufinity interview test assignment.
<br>
<br>

## Prerequisites

- NodeJS v18.x.x
- Docker

<br>

## Folder Structure

| S/N | Name | Type | Description |
| --- | ------------------------ | ---- | ------=----------------------------------------- |
| 1 | database | dir | Consist the DDL query for the database |
| 2 | src | dir | Consist the functions, models, routes for APIs
| 3 | README.md | file | This file |

## Exposed Port

| S/N | Application | Exposed Port |
| --- | ----------- | ------------ |
| 1   | database    | 33306        |
| 2   | application | 3000         |

<br>

## Commands

All the commands listed should be ran in ./ufinity_interview_assignment directory.

### Installing dependencies

```bash
npm install
```

<br>

### Starting Project

Starting the project in local environment.
This will start all the dependencies services i.e. database.

```bash
npm start
```

<br>

### Running in watch mode

This will start the application in watch mode.

```bash
npm run start:dev
```

<br>

### Check local application is started

You should be able to call (GET) the following endpoint and get a 200 response

```
http://localhost:3000/api/healthCheck/
```

<br>

## Steps to run local instance

1. Clone the project from repository. url: https://github.com/CkKean/ufinity_interview_assignment.git
2. Open the codebase in IDE (e.g.: vscode)
3. Open docker desktop for running the MySQL database
4. Run `npm run install` to install the dependencies
5. Run `npm run start` to start the project

<br>

## Test

The test suites is located in folder ufinity_interview_assignment/src/test. There are only one test suite and 29 test cases for Student APIs. The default dummy data will be created during the first MySQL docker container initialised.

## Steps to run test

1. Open docker desktop for running the MySQL database.
2. Run `npm run prestart` to start and init the MySQL database in docker.
3. Run `npm run test` to conducted the test.

### Database

It will be ran the first time MySQL docker container is first initialised. <br><br>

There are three tables in the database. The dummy default data will be created during the first MySQL docker container initialised.

1. student
- To store the information of student

2. teacher
- To store the information of teacher

3. teacher_student_relationship
- To store the relationship between student and teacher.

<br>

### API

1. http://localhost:3000/api/register

- Register one or more students to a specified teacher.

2. http://localhost:3000/api/commonstudents?teacher=teacherken@gmail.com

- Retrieve a list of students common to a given list of teachers.

3. http://localhost:3000/api/suspend

- Suspend a specified student

4. http://localhost:3000/api/retrievefornotifications

- Retrieve a list of students who can receive a given notification

<br>

## FAQ

### Error when starting up

If you encounter the following error when running `npm start`, it is due to the slow startup of your database container.<br>
Please run `npm start` again.

```
[server.js]	ERROR	SequelizeConnectionError: Connection lost: The server closed the connection.
[server.js]	ERROR	Unable to start application
```
