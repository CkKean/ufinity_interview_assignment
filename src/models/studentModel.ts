import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { Teacher } from "./teacherModel";
import { TeacherStudentRelationship } from "./teacherStudentRelationshipModel";

export const STUDENT_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  SUSPENDED: 2,
};

export interface StudentModel {
  student_id: number;
  student_email: string;
  student_status: number;
  student_created_at: Date;
  student_updated_at: Date;
  student_suspended_by: number;
  student_suspended_at: Date;
}

export interface StudentRegisterRequest {
  teacher: string;
  students: string[];
}

export interface StudentNotificationRequest {
  teacher: string;
  notification: string;
}
export interface StudentCreateModel {
  student_email: string;
}

@Table({
  tableName: "student",
  timestamps: false,
})
export class Student extends Model<Student> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Unique
  @Column(DataType.INTEGER)
  student_id: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.TEXT)
  student_email: string;

  @AllowNull(false)
  @Default(1)
  @Column(DataType.INTEGER)
  student_status: number;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  student_created_at: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  student_updated_at: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  student_suspended_at: Date;

  @HasMany(() => TeacherStudentRelationship, "student_id")
  teacher_student_relationship: TeacherStudentRelationship[];
}
