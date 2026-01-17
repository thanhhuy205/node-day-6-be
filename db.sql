create database homework_database;

create table users (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(200) NOT NULL UNIQUE, 
    password VARCHAR(200) NOT NULL, 
    created_at timestamp default current_timestamp
) ;


create table revoked_tokens (
	id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    refresh_token VARCHAR(200) NOT NULL UNIQUE,
    revoke_at timestamp default null , 
	user_id BIGINT UNSIGNED,
    
    CONSTRAINT fk_user_refresh_token FOREIGN KEY
    (user_id) REFERENCES users(id) 
    ON DELETE CASCADE
)