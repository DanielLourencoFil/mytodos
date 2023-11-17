CREATE DATABASE todoapp;

CREATE TABLE todos(
  id VARCHAR(255) PRIMARY KEY,
  user_email VARCHAR(100),
  description VARCHAR(350), 
  title VARCHAR(50),
  progress INT,
  createdat TIMESTAMP DEFAULT now()
);

CREATE TABLE users(
  email VARCHAR(100) PRIMARY KEY,
  hashed_password VARCHAR(255)
);

