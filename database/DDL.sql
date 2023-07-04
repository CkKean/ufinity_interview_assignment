CREATE TABLE `notification` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `notification_message` text NOT NULL,
  `notification_created_by` int NOT NULL,
  `notification_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  UNIQUE KEY `notification_id_UNIQUE` (`notification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `student` (
  `student_id` int NOT NULL,
  `student_email` varchar(255) NOT NULL,
  `student_name` text NOT NULL,
  `student_status` int NOT NULL COMMENT '0: Inactive, 1: Active, 2: Suspend',
  `student_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `student_updated_at` datetime DEFAULT NULL,
  `student_suspended_by` int DEFAULT NULL,
  `student_suspended_at` datetime DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `student_id_UNIQUE` (`student_id`),
  UNIQUE KEY `student_email_UNIQUE` (`student_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `student_notification` (
  `student_notification_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `notification_id` int NOT NULL,
  `student_notification_status` int NOT NULL,
  `student_notification_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `student_notification_updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`student_notification_id`),
  UNIQUE KEY `student_notification_id_UNIQUE` (`student_notification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `teacher` (
  `teacher_id` int NOT NULL AUTO_INCREMENT,
  `teacher_email` varchar(255) NOT NULL,
  `teacher_name` text NOT NULL,
  `teacher_status` int NOT NULL COMMENT '0: Inactive, 1: Active',
  `teacher_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `teacher_updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`teacher_id`),
  UNIQUE KEY `teacher_id_UNIQUE` (`teacher_id`),
  UNIQUE KEY `teacher_email_UNIQUE` (`teacher_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `teacher_student_relationship` (
  `teacher_student_relationship_id` int NOT NULL AUTO_INCREMENT,
  `teacher_id` int NOT NULL,
  `student_id` int NOT NULL,
  `teacher_student_relationship_status` int NOT NULL COMMENT '0: Inactive, 1: Active',
  `teacher_student_relationship_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `teacher_student_relationship_updated_at` datetime DEFAULT NULL,
  `teacher_student_relationship_created_by` int NOT NULL,
  `teacher_student_relationship_updated_by` int DEFAULT NULL,
  PRIMARY KEY (`teacher_student_relationship_id`),
  UNIQUE KEY `teacher_student_relationship_id_UNIQUE` (`teacher_student_relationship_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
