USE go_fleet;

DROP TABLE IF EXISTS drivers;

CREATE TABLE drivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  role ENUM('driver') DEFAULT 'driver' NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  middleInitial VARCHAR(5) NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phoneNumber VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  
  truck_company_id INT NOT NULL,

trip_status ENUM('ready', 'in_transit','returning','offline') DEFAULT 'offline',
status ENUM('active','inactive') DEFAULT 'active',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (truck_company_id) REFERENCES truck_companies(id) ON DELETE RESTRICT
 ) AUTO_INCREMENT = 100000000;