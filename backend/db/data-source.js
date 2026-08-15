require("dotenv").config();
const { DataSource } = require("typeorm");
const Skill = require("../entities/Skill");
const CreditPackage = require("../entities/CreditPackage");
const User = require("../entities/User");
const Coach = require("../entities/Coach");
const CoachSkill = require("../entities/CoachSkill");
const Course = require("../entities/Course");
const CreditPurchase = require("../entities/CreditPurchase");

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNCHRONIZE,
  entities: [Skill, CreditPackage, User, Coach, CoachSkill, Course, CreditPurchase],
  migrations: ["db/migrations/*.js"],
});

module.exports = { dataSource };
