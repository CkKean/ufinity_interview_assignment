-- -- Drop tables if they exist
-- -- DROP TABLE IF EXISTS `teacher_student_relationship`;
-- -- DROP TABLE IF EXISTS `student`;
-- -- DROP TABLE IF EXISTS `teacher`;

-- CREATE TABLE  `student` (
--   `student_id` int NOT NULL AUTO_INCREMENT,
--   `student_email` varchar(255) NOT NULL,
--   `student_status` int NOT NULL DEFAULT '1' COMMENT '0: Inactive, 1: Active, 2: Suspend',
--   `student_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   `student_updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
--   `student_suspended_at` datetime DEFAULT NULL,
--   PRIMARY KEY (`student_id`),
--   UNIQUE KEY `student_id_UNIQUE` (`student_id`),
--   UNIQUE KEY `student_email_UNIQUE` (`student_email`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- CREATE TABLE  `teacher` (
--   `teacher_id` int NOT NULL AUTO_INCREMENT,
--   `teacher_email` varchar(255) NOT NULL,
--   `teacher_status` int NOT NULL DEFAULT '1' COMMENT '0: Inactive, 1: Active',
--   `teacher_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   `teacher_updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
--   PRIMARY KEY (`teacher_id`),
--   UNIQUE KEY `teacher_id_UNIQUE` (`teacher_id`),
--   UNIQUE KEY `teacher_email_UNIQUE` (`teacher_email`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- CREATE TABLE `teacher_student_relationship` (
--   `teacher_student_relationship_id` int NOT NULL AUTO_INCREMENT,
--   `teacher_id` int NOT NULL,
--   `student_id` int NOT NULL,
--   `teacher_student_relationship_status` int NOT NULL DEFAULT '1' COMMENT '0: Inactive, 1: Active',
--   `teacher_student_relationship_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   `teacher_student_relationship_updated_at` datetime DEFAULT NULL,
--   PRIMARY KEY (`teacher_student_relationship_id`),
--   UNIQUE KEY `teacher_student_relationship_id_UNIQUE` (`teacher_student_relationship_id`),
--   UNIQUE KEY `teacher_student_fk` (`teacher_id`,`student_id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- -- Truncate table data
-- -- TRUNCATE TABLE `teacher_student_relationship`;
-- -- TRUNCATE TABLE `student`;
-- -- TRUNCATE TABLE `teacher`;

-- -- Default Dummy Data
-- -- INSERT INTO `teacher` (teacher_email) VALUES ('teacherken@gmail.com');
-- -- INSERT INTO `teacher` (teacher_email) VALUES ('teacherjoe@gmail.com');
 
-- -- INSERT INTO `student` (student_email) VALUES ('studentmary@gmail.com');
-- -- INSERT INTO `student` (student_email) VALUES ('studentkelven@gmail.com');
 
-- -- INSERT INTO `teacher_student_relationship` 
-- -- (teacher_id, student_id) VALUES (1,1);
-- -- INSERT INTO `teacher_student_relationship` 
-- -- (teacher_id, student_id) VALUES (1,2);
