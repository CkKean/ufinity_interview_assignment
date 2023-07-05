-- Drop tables if they exist
DROP TABLE IF EXISTS  `teacher-administration-system-test`.`teacher_student_relationship`;
DROP TABLE IF EXISTS  `teacher-administration-system-test`.`student`;
DROP TABLE IF EXISTS  `teacher-administration-system-test`.`teacher`;

-- Create tables
CREATE TABLE `teacher-administration-system-test`.`student` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `student_email` varchar(255) NOT NULL,
  `student_status` int NOT NULL DEFAULT '1' COMMENT '0: Inactive, 1: Active, 2: Suspend',
  `student_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `student_updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `student_suspended_at` datetime DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `student_id_UNIQUE` (`student_id`),
  UNIQUE KEY `student_email_UNIQUE` (`student_email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `teacher-administration-system-test`.`teacher` (
  `teacher_id` int NOT NULL AUTO_INCREMENT,
  `teacher_email` varchar(255) NOT NULL,
  `teacher_status` int NOT NULL DEFAULT '1' COMMENT '0: Inactive, 1: Active',
  `teacher_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `teacher_updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`teacher_id`),
  UNIQUE KEY `teacher_id_UNIQUE` (`teacher_id`),
  UNIQUE KEY `teacher_email_UNIQUE` (`teacher_email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `teacher-administration-system-test`.`teacher_student_relationship` (
  `teacher_student_relationship_id` int NOT NULL AUTO_INCREMENT,
  `teacher_id` int NOT NULL,
  `student_id` int NOT NULL,
  `teacher_student_relationship_status` int NOT NULL DEFAULT '1' COMMENT '0: Inactive, 1: Active',
  `teacher_student_relationship_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `teacher_student_relationship_updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`teacher_student_relationship_id`),
  UNIQUE KEY `teacher_student_relationship_id_UNIQUE` (`teacher_student_relationship_id`),
  UNIQUE KEY `teacher_student_fk` (`teacher_id`,`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -- Truncate table data
TRUNCATE TABLE  `teacher-administration-system-test`.`teacher_student_relationship`;
TRUNCATE TABLE  `teacher-administration-system-test`.`student`;
TRUNCATE TABLE  `teacher-administration-system-test`.`teacher`;

-- Insert default dummy data for testing purpose
INSERT INTO `teacher-administration-system-test`.`teacher` (teacher_email) VALUES ('teacherken@gmail.com');
INSERT INTO `teacher-administration-system-test`.`teacher` (teacher_email) VALUES ('teacherjoe@gmail.com');
INSERT INTO `teacher-administration-system-test`.`teacher` (teacher_email) VALUES ('teacherkang@gmail.com');
INSERT INTO `teacher-administration-system-test`.`teacher` (teacher_email) VALUES ('teacherping@gmail.com');

INSERT INTO `teacher-administration-system-test`.`student` (student_email) VALUES ('commonstudent1@gmail.com');
INSERT INTO `teacher-administration-system-test`.`student` (student_email) VALUES ('commonstudent2@gmail.com');
INSERT INTO `teacher-administration-system-test`.`student` (student_email) VALUES ('commonstudent3@gmail.com');
INSERT INTO `teacher-administration-system-test`.`student` (student_email) VALUES ('commonstudent4@gmail.com');
INSERT INTO `teacher-administration-system-test`.`student` (student_email, student_status) VALUES ('commonstudent5@gmail.com', 2);
INSERT INTO `teacher-administration-system-test`.`student` (student_email) VALUES ('newStudent@gmail.com');

INSERT INTO `teacher-administration-system-test`.`teacher_student_relationship` 
(teacher_id, student_id) VALUES (1,1);
INSERT INTO `teacher-administration-system-test`.`teacher_student_relationship` 
(teacher_id, student_id) VALUES (1,2);
INSERT INTO `teacher-administration-system-test`.`teacher_student_relationship` 
(teacher_id, student_id) VALUES (1,5);
INSERT INTO `teacher-administration-system-test`.`teacher_student_relationship` 
(teacher_id, student_id) VALUES (2,2);
INSERT INTO `teacher-administration-system-test`.`teacher_student_relationship` 
(teacher_id, student_id) VALUES (2,3);
