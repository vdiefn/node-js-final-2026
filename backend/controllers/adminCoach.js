const { dataSource } = require("../db/data-source");
const errorHandler = require("../utils/errorHandler");
const validation = require("../utils/validation");
const coachRepo = dataSource.getRepository("Coach");
const userRepo = dataSource.getRepository("User");
const coachSkillRepo = dataSource.getRepository("CoachSkill");
const courseRepo = dataSource.getRepository("Course");
const courseBookingRepo = dataSource.getRepository("CourseBooking")
const skillRepo = dataSource.getRepository("Skill");
const creditPackageRepo = dataSource.getRepository("CreditPackage")
const { Between, IsNull } = require("typeorm")

const createCoach = async (req, res, next) => {
  const { userId } = req.params;
  const { experience_years, description, profile_image_url } = req.body;
  if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
    return next(errorHandler(400, "id不正確"));
  }

  if (!validation.isValidNumber(experience_years) || !validation.isValidString(description)) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  if (validation.isValidString(profile_image_url) && !validation.isValidUrl(profile_image_url)) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  const target = await userRepo.findOne({ where: { id: userId } });
  if (!target) {
    return next(errorHandler(400, "userId 查無此使用者"));
  }

  if (target.role === "COACH") {
    return next(errorHandler(409, "使用者已經是教練"));
  }

  await userRepo.update({ id: userId }, { role: "COACH" });

  const newCoach = coachRepo.create({
    user: { id: userId },
    experience_years,
    description: description.trim(),
    profile_image_url: profile_image_url ? profile_image_url.trim() : null,
  });
  const savedCoach = await coachRepo.save(newCoach);

  const { user, ...coachDate } = newCoach;

  res.status(201).json({
    status: "success",
    data: {
      user: {
        name: target.name,
        role: "COACH",
      },
      coach: {
        id: savedCoach.id,
        user_id: userId,
        experience_years: savedCoach.experience_years,
        description: savedCoach.description,
        profile_image_url: savedCoach.profile_image_url,
        created_at: savedCoach.created_at,
        updated_at: savedCoach.updated_at,
      },
    },
  });
};

const getCoach = async (req, res, next) => {
  const userId = req.user.id;
  const targetCoach = await coachRepo.findOne({ where: { user: { id: userId } } });

  const coachSkills = await coachSkillRepo.find({
    where: { coach: { id: targetCoach.id } },
    relations: { skill: true },
  });

  const skill_ids = coachSkills.map((item) => item.skill.id);

  res.status(200).json({
    status: "success",
    data: {
      id: targetCoach.id,
      experience_years: targetCoach.experience_years,
      description: targetCoach.description,
      profile_image_url: targetCoach.profile_image_url,
      skill_ids,
    },
  });
};

const updateCoach = async (req, res, next) => {
  const { id } = req.user;
  const { experience_years, description, profile_image_url, skill_ids } = req.body;

  if (
    !validation.isValidNumber(experience_years) ||
    !validation.isValidString(description) ||
    !validation.isValidSkill(skill_ids)
  ) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  if (!profile_image_url || !validation.isValidUrl(profile_image_url)) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  const targetUser = await userRepo.findOne({ where: { id } });
  if (!targetUser || targetUser.role !== "COACH") {
    return next(errorHandler(401, "使用者尚未成為教練"));
  }

  const targetCoach = await coachRepo.findOne({ where: { user: { id } } });
  if (!targetCoach) {
    return next(errorHandler(400, "找不到教練資料"));
  }

  await coachRepo.update(targetCoach.id, {
    experience_years,
    description: description.trim(),
    profile_image_url: profile_image_url.trim(),
  });

  await coachSkillRepo.delete({ coach: { id: targetCoach.id } });

  const newSkill = await skill_ids.map((skillId) => {
    return coachSkillRepo.create({
      coach: { id: targetCoach.id },
      skill: { id: skillId },
    });
  });

  await coachSkillRepo.save(newSkill);

  res.status(200).json({
    status: "success",
    data: {
      id: targetCoach.id,
      experience_years,
      description,
      profile_image_url,
      skill_ids,
    },
  });
};

const getCoachCourse = async (req, res, next) => {
  const coachId = req.coach.id;
  const courses = await courseRepo.find({
    where: { coach: { id: coachId } },
  });
  res.status(200).json({ status: "success", data: courses });
};

const createCourse = async (req, res, next) => {
  const { skill_id, name, description, start_at, end_at, max_participants, meeting_url } = req.body;

  if (
    !validation.isValidString(skill_id) ||
    !validation.isValidString(name) ||
    !validation.isValidString(description) ||
    !validation.isValidTimestamp(start_at) ||
    !validation.isValidTimestamp(end_at) ||
    !validation.isValidNumber(max_participants) ||
    !validation.isValidUrl(meeting_url)
  ) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  const hasName = await courseRepo.existsBy({ name });
  if (hasName) {
    return next(errorHandler(400, "課程名稱已存在"));
  }

  const hasSkill = await skillRepo.existsBy({ id: skill_id });
  if (!hasSkill) {
    return next(errorHandler(400, "請先建立該技能"));
  }

  const newCourse = courseRepo.create({
    skill: { id: skill_id.trim() },
    coach: { id: req.coach.id },
    name: name.trim(),
    description: description.trim(),
    start_at,
    end_at,
    max_participants,
    meeting_url: meeting_url.trim(),
  });
  const result = await courseRepo.save(newCourse);

  res.status(201).json({ status: "success", data: { course: result } });
};

const getCourseDetail = async (req, res, next) => {
  const courseId = req.params.courseId;
  const userId = req.user.id;

  const courseDetail = await courseRepo.findOne({
    where: {
      id: courseId,
      coach: { user: { id: userId } },
    },
    relations: { skill: true },
  });

  if (!courseDetail) {
    return next(errorHandler(400, "課程不存在"));
  }

  const { id, name, status, start_at, end_at, max_participants, participants, meeting_url, created_at, updated_at } =
    courseDetail;

  res.status(200).json({
    status: "success",
    data: {
      id,
      name,
      status,
      start_at,
      end_at,
      max_participants,
      participants,
      meeting_url,
      created_at,
      updated_at,
      skill_id: courseDetail.skill.id,
      skill_name: courseDetail.skill.name,
    },
  });
};

const updateCourseDetail = async (req, res, next) => {
  const courseId = req.params.courseId;
  const userId = req.user.id;
  const { skill_id, name, description, start_at, end_at, max_participants, meeting_url } = req.body;

  if (
    !validation.isValidString(skill_id) ||
    !validation.isValidString(name) ||
    !validation.isValidString(description) ||
    !validation.isValidTimestamp(start_at) ||
    !validation.isValidTimestamp(end_at) ||
    !validation.isValidNumber(max_participants) ||
    !validation.isValidUrl(meeting_url)
  ) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  const courseDetail = await courseRepo.findOne({
    where: {
      id: courseId,
      coach: { user: { id: userId } },
    },
  });
  if (!courseDetail) {
    return next(errorHandler(400, "課程不存在"));
  }

  const updatedCourse = await courseRepo.save({
    id: courseId,
    skill: { id: skill_id.trim() },
    name: name.trim(),
    description: description.trim(),
    start_at,
    end_at,
    max_participants,
    meeting_url,
  });

  const courseData = await courseRepo.findOne({
    where: { id: courseId, coach: { user: { id: userId } } },
    relations: { skill: true, coach: true },
  });

  const { skill, coach, ...rawData } = courseData;
  return res.status(200).json({
    status: "success",
    data: {
      course: {
        ...rawData,
        skill_id: skill.id,
        user_id: coach.id,
      },
    },
  });
};

const getRevenue = async (req, res, next) => {
  const coachId = req.coach.id;
  const { month } = req.query;

  const MONTH_MAP = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };

  if (!validation.isValidMonth(month.trim().toLowerCase())) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  const monthIndex = MONTH_MAP[month]
  const year = new Date().getFullYear()
  const startDate = new Date(year, monthIndex, 1, 0, 0, 0, 0)
  const endDate = new Date(year, monthIndex+1, 0, 23, 59, 59, 999 )

  const data = await courseBookingRepo.find({
    where:{
      created_at: Between(startDate, endDate),
      course: { coach: { id: coachId}},
      cancelled_at: IsNull()
    },
    relations: { course: true, user: true}
  })

  let participants = 0
  let revenue = 0
  let course_count = 0

  if(data.length > 0){
    const packageData = await creditPackageRepo.find()
    const totalPrice = packageData.reduce((acc,cur) => acc+=Number(cur.price), 0)
    const totalCredits = packageData.reduce((acc, cur) => acc+= Number(cur.credit_amount), 0)
    const unitPrice = totalCredits > 0 ? totalPrice/totalCredits : 0
    revenue = Math.floor(unitPrice * data.length)
    const uniqueUserId = new Set(data.map(i => i.user.id))
    participants = uniqueUserId.size
    course_count = data.length
  }


  res.status(200).json({
    status:"success",
    data : {
      total: {
        revenue,
        participants,
        course_count
      }
    }
  })
};

module.exports = {
  createCoach,
  getCoach,
  updateCoach,
  getCoachCourse,
  createCourse,
  getCourseDetail,
  updateCourseDetail,
  getRevenue,
};
