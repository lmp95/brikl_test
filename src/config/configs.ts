import { config } from 'dotenv';
import { Sequelize } from 'sequelize';
import mysql from 'mysql2';
config();

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  dialect: 'mysql',
  sync: {
    alter: true,
  },
});

// initialize create database if not exist
export const initDb = () => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
};
