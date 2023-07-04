import { Teacher } from "../models/teacherModel";
import { Student } from "../models/studentModel";
import { Sequelize } from "sequelize-typescript";
import { TeacherStudentRelationship } from "../models/teacherStudentRelationshipModel";

const models = [Student, Teacher, TeacherStudentRelationship];

export const ModelInit = (db: Sequelize) => {
  db.addModels(models);
};
