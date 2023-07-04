import supertest from 'supertest';
import app from '../app'; // Import the Express app
import { ModelInit } from '../config/modelInit';
import sequelize from '../config/database';

const supertestRequest = supertest(app);
beforeAll(() => ModelInit(sequelize));
afterAll(async () => await sequelize.close());

describe('POST /api/register', () => {
  test('Should return "Invalid teacher email format."', async () => {
    const res = await supertestRequest.post('/api/register').send({
      teacher: 'teacherhon3',
      students: ['studentjon1@gmail.com', 'studentjohn@gmail.com'],
    });

    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      status: false,
      message: 'Invalid teacher email format.',
    });
  });

  test('Should return "Teacher email is required."', async () => {
    const res = await supertestRequest.post('/api/register').send({
      teacher: '',
      students: ['studentjon1@gmail.com', 'studentjohn@gmail.com'],
    });

    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      status: false,
      message: 'Teacher email is required.',
    });
  });

  test('Should return "Student email is required."', async () => {
    const res = await supertestRequest.post('/api/register').send({
      teacher: 'teacherhon3@gmail.com',
      students: [],
    });

    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      status: false,
      message: 'Student email is required.',
    });
  });

  test('Should return "Invalid student(s) email format."', async () => {
    const res = await supertestRequest.post('/api/register').send({
      teacher: 'teacherhon3@gmail.com',
      students: ['studentjon1', 'studentjohn'],
    });

    expect(res.status).toEqual(400);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      status: false,
      message: 'Invalid student(s) email format.',
    });
  });

  test('Should return "Teacher does not exist."', async () => {
    const res = await supertestRequest.post('/api/register').send({
      teacher: 'none@gmail.com',
      students: ['studentjon1@gmail.com', 'studentjohn@gmail.com'],
    });

    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual({
      message: 'Teacher does not exist.',
    });
  });

  test('Should return no-centent status', async () => {
    const res = await supertestRequest.post('/api/register').send({
      teacher: 'teacherken@gmail.com',
      students: ['newStudent@gmail.com'],
    });

    expect(res.statusCode).toBe(204);
  });
});

// describe('POST /api/commonstudents', () => {

//   test('Should return HTTP status 200 when retrieving the list of common students - 1', async () => {
//     const response = await supertestRequest.get(
//       '/api/commonstudents?teacher=teacherkencom'
//     );
//     expect(response.status).toBe(200);
//   });
// });

// describe('POST /api/suspend', () => {
//   test('Should return HTTP status 204 after suspend successfully', async () => {
//     const res = await superTestRequest.post('/suspend').send({
//       students: 'studentjon1@gmail.com',
//     });

//     expect(res.statusCode).toBe(204);
//   });
// });
