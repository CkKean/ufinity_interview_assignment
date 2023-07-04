import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { TeacherStudentRelationship } from "./teacherStudentRelationshipModel";

export const TEACHER_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
};

export interface TeacherCreateModel {
  teacher_email: string;
}

@Table({
  tableName: "teacher",
  timestamps: false,
})
export class Teacher extends Model<Teacher> {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Unique
  @Column(DataType.INTEGER)
  teacher_id: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.TEXT)
  teacher_email: string;

  @AllowNull(false)
  @Default(1)
  @Column(DataType.INTEGER)
  teacher_status: number;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  teacher_created_at: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  teacher_updated_at: Date;

  @HasMany(() => TeacherStudentRelationship, "teacher_id")
  teacher_student_relationship: TeacherStudentRelationship[];
}
