CREATE TABLE IF NOT EXISTS queues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    queue_code VARCHAR(50) NOT NULL UNIQUE, 
    driver_id INT DEFAULT NULL,             
    status ENUM('pending', 'locked', 'registered', 'in_transit' ,'completed', 'cancelled') DEFAULT 'pending',
    
    -- Lock-on-Scan Mechanism
    locked_by_driver_id INT DEFAULT NULL,
    lock_expires_at DATETIME DEFAULT NULL,
    
    -- Timestamps
    scanned_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign Key constraints
    CONSTRAINT fk_queue_driver FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
    CONSTRAINT fk_queue_locked_driver FOREIGN KEY (locked_by_driver_id) REFERENCES drivers(id) ON DELETE SET NULL
);