USE go_fleet; -- Replace go_fleet with your main schema   
SET SQL_SAFE_UPDATES = 0;
DELETE FROM dispatch;
ALTER TABLE dispatch AUTO_INCREMENT = 1;
SET SQL_SAFE_UPDATES = 1;
TRUNCATE TABLE dispatch;