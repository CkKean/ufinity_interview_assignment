import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { Teacher } from "./teacherModel";
import { Student } from "./studentModel";

export const TEACHER_STUDENT_RELATIONSHIP_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
};

export interface TeacherStudentRelationshipModel {
  teacher_student_relationship_id: number;
  teacher_id: number;
  student_id: number;
  teacher_student_relationship_status: number;
  teacher_student_relationship_created_at: Date;
  teacher_student_relationship_updated_at: Date;
}

export interface TeacherStudentRelationshipCreateModel {
  teacher_id: number;
  student_id: number;
  teacher_student_relationship_created_by: number;
}

@Table({
  tableName: "teacher_student_relationship",
  timestamps: false,
})
export class TeacherStudentRelationship extends Model<TeacherStudentRelationship> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Unique
  @Column(DataType.INTEGER)
  teacher_student_relationship_id: number;

  @ForeignKey(() => Teacher)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  teacher_id: number;

  @BelongsTo(() => Teacher, "teacher_id")
  teacher: Teacher;

  @ForeignKey(() => Student)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  student_id: number;

  @BelongsTo(() => Student, "student_id")
  student: Student;

  @AllowNull(false)
  @Default(1)
  @Column(DataType.INTEGER)
  teacher_student_relationship_status: number;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  teacher_student_relationship_created_at: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  teacher_student_relationship_updated_at: Date;
}
