import supertest from 'supertest';
import app from '../../app'; // Import the Express app
import sequelize from '../../config/database';
import { ModelInit } from '../../config/modelInit';

const supertestRequest = supertest(app);
beforeAll(() => ModelInit(sequelize));
afterAll(async () => await sequelize.close());

const apiBasePath = '/api';

// // Tests for /api/register
describe('POST /api/register', () => {
  const path = '/register';
  test('Should return an error message "Invalid teacher email format." if the teacher email format is invalid.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      teacher: 'teacherhon3',
      students: ['studentjon1@gmail.com', 'studentjohn@gmail.com'],
    });

    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Invalid teacher email format.',
    });
  });

  test('Should return an error message "Teacher email is required." if the teacher input is empty.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      teacher: '',
      students: ['studentjon1@gmail.com', 'studentjohn@gmail.com'],
    });

    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Teacher email is required.',
    });
  });

  test('Should return an error message "Teacher email is required." if the teacher input is not provided.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      students: ['studentjon1@gmail.com', 'studentjohn@gmail.com'],
    });

    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Teacher email is required.',
    });
  });

  test('Should return error message "Student email is required." if 0 student input.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      teacher: 'teacherhon3@gmail.com',
      students: [],
    });

    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Student email is required.',
    });
  });

  test('Should return error message "Student email is required." if students input is not provided.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      teacher: 'teacherhon3@gmail.com',
    });

    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Student email is required.',
    });
  });

  test('Should return error message "Invalid student(s) email format." if student email format is invalid.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      teacher: 'teacherhon3@gmail.com',
      students: ['studentjon1', 'studentjohn'],
    });

    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Invalid student(s) email format.',
    });
  });

  test('Should return message "Teacher does not exist." if the teacher does not exist.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      teacher: 'none@gmail.com',
      students: ['studentjon1@gmail.com', 'studentjohn@gmail.com'],
    });

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Teacher does not exist.',
    });
  });

  test('Should return HTTP status 204 with no content if register existing student successfully.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      teacher: 'teacherkang@gmail.com',
      students: ['newStudent@gmail.com'],
    });

    expect(res.statusCode).toEqual(204);
  });

  test('Should return HTTP status 204 with no content if register a new student successfully.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      teacher: 'teacherkang@gmail.com',
      students: ['newStudent1@gmail.com'],
    });

    expect(res.statusCode).toEqual(204);
  });

  test('Should return HTTP status 204 with no content if register multiple new students successfully.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      teacher: 'teacherkang@gmail.com',
      students: ['newStudent2@gmail.com', 'newStudent3@gmail.com'],
    });

    expect(res.statusCode).toEqual(204);
  });
});

// Tests for /api/commonstudents
describe('POST /api/commonstudents', () => {
  const path = '/commonstudents';

  test('Should return error message "Teacher email is required." if teacher parameter input is not provided.', async () => {
    const res = await supertestRequest.get(`${apiBasePath}${path}`);
    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Teacher email is required.',
    });
  });

  test('Should return error message "Teacher email is required." if teacher input is empty string.', async () => {
    const res = await supertestRequest.get(`${apiBasePath}${path}?teacher=`);
    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Teacher email is required.',
    });
  });

  test('Should return error message "Invalid teacher email format." if teacher email format is invalid.', async () => {
    const res = await supertestRequest.get(
      `${apiBasePath}${path}?teacher=teacherkencom&teacher=teacherkencom`
    );
    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Invalid teacher email format.',
    });
  });

  test('Should return the list of students common given a teacher', async () => {
    const res = await supertestRequest.get(
      `${apiBasePath}${path}?teacher=teacherken@gmail.com`
    );
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      students: expect.arrayContaining([
        'commonstudent1@gmail.com',
        'commonstudent2@gmail.com',
        'commonstudent5@gmail.com',
      ]),
    });
  });

  test('Should return the list of students common given a list of teachers', async () => {
    const res = await supertestRequest.get(
      `${apiBasePath}${path}?teacher=teacherken@gmail.com&teacher=teacherjoe@gmail.com`
    );
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      students: expect.arrayContaining([
        'commonstudent2@gmail.com',
      ]),
    });
  });

  test('Should return the zero students', async () => {
    const res = await supertestRequest.get(
      `${apiBasePath}${path}?teacher=teacherkenken@gmail.com&teacher=teacherjoejoejoe@gmail.com`
    );
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      students: [],
    });
  });
});

// // Tests for /api/commonstudents
describe('POST /api/suspend', () => {
  const path = '/suspend';

  test('Should return an error message "Invalid student email format." if student email format is invalid.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      student: 'commonstudent4',
    });

    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Invalid student email format.',
    });
  });

  test('Should return an error message "Student email is required." if student email is empty string.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      student: '',
    });

    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Student email is required.',
    });
  });

  test('Should return an error message "Student email is required." if student email input is not provided.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({});

    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Student email is required.',
    });
  });

  test('Should return error message "Student was in suspended status." if suspend a suspended student.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      student: 'commonstudent5@gmail.com',
    });
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Student was in suspended status.',
    });
  });

  test('Should return HTTP status 204 with no content after suspend successfully.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      student: 'commonstudent4@gmail.com',
    });

    expect(res.status).toEqual(204);
  });

  test('Should return error message "Student does not exist." if the student email does not exist.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      student: 'none@gmail.com',
    });

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Student does not exist.',
    });
  });
});

// // Tests for /api/retrievefornotifications
describe('POST /api/retrievefornotifications', () => {
  const path = '/retrievefornotifications';

  test('Should return error message "Invalid teacher email format." if teacher email format is invalid.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      teacher: 'teacher@',
      notification: 'Hello students!',
    });

    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Invalid teacher email format.',
    });
  });

  test('Should return error message "Teacher email is required." if teacher email is empty string.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      teacher: '',
      notification: 'Hello students!',
    });

    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Teacher email is required.',
    });
  });

  test('Should return error message "Teacher email is required." if teacher email input is not provided.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      notification: 'Hello students!',
    });

    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Teacher email is required.',
    });
  });

  test('Should return error message "Notification is required." if notification is empty string', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      teacher: 'teacherken@gmail.com',
      notification: '',
    });

    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Notification is required.',
    });
  });

  test('Should return error message "Notification is required." if notification input is not provided.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      teacher: 'teacherken@gmail.com',
    });

    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Notification is required.',
    });
  });

  test('Should return a list of registered and unsuspended student email only.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      teacher: 'teacherken@gmail.com',
      notification: 'Hello students',
    });

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      recipients: expect.arrayContaining([
        'commonstudent1@gmail.com',
        'commonstudent2@gmail.com',
      ]),
    });
  });

  test('Should return a list of existing email mentioned in notification and registered student email.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      teacher: 'teacherken@gmail.com',
      notification:
        'Hello students! @commonstudent3@gmail.com @studentmiche@gmail.com',
    });

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      recipients: expect.arrayContaining([
        'commonstudent1@gmail.com',
        'commonstudent2@gmail.com',
        'commonstudent3@gmail.com',
      ]),
    });
  });

  test('Should return a list of existed email mentioned in notification and registered student email without any repetitions.', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      teacher: 'teacherken@gmail.com',
      notification:
        'Hello students! @commonstudent3@gmail.com@commonstudent3@gmail.com',
    });

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      recipients: expect.arrayContaining([
        'commonstudent1@gmail.com',
        'commonstudent2@gmail.com',
        'commonstudent3@gmail.com',
      ]),
    });
  });

  test('Should return zero student email', async () => {
    const res = await supertestRequest.post(`${apiBasePath}${path}`).send({
      teacher: 'teacherping@gmail.com',
      notification: 'Hello students',
    });

    expect(res.statusCode).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      recipients: [],
    });
  });
});
