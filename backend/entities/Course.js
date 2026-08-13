const { EntitySchema } = require("typeorm")

module.exports = new EntitySchema({
  name: "Course",
  tableName: "COURSE",
  columns: {
    id: {
      type: "uuid",
      generated: "uuid",
      primary: true,
      nullable: false
    },
    name: {
      type: "varchar",
      length: 50,
      nullable: false,
      unique: true
    },
    status: {
      type: "enum",
      enum: ["尚未開始","進行中","已結束"],
      default: "尚未開始",
      nullable: false
    },
    start_at: {
      type: "timestamp",
      nullable:false
    },
    end_at: {
      type:"timestamp",
      nullable: false
    },
    max_participants:{
      type: "int",
      default: 20,
      nullable: false
    },
    participants:{
      type: "int",
      default:0,
      nullable: false
    },
    meeting_url: {
      type: "varchar",
      length: 255,
      nullable: false
    },
    created_at: {
      type: "timestamp",
      createDate: true,
      nullable: false
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
      nullable: false
    }
  },
  relations: {
    coach: {
      target: "Coach",
      type: "many-to-one",
      joinColumn: { name: "coach_id"}
    },
    skill: {
      target: "Skill",
      type: "many-to-one",
      joinColumn: { name: "skill_id"}
    }
  }
})