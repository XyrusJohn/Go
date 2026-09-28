USE go_fleet;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  role ENUM('staff', 'driver', 'admin', 'super_admin') DEFAULT 'staff' NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  middleInitial VARCHAR(5) NULL,
  email VARCHAR(150) UNIQUE NOT NULL,users
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) AUTO_INCREMENT = 100000000;