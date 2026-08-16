const { dataSource } = require("../db/data-source");
const errorHandler = require("../utils/errorHandler");
const courseRepo = dataSource.getRepository("Course");
const courseBookingRepo = dataSource.getRepository("CourseBooking");
const creditPurchaseRepo = dataSource.getRepository("CreditPurchase");
const { MoreThanOrEqual, LessThanOrEqual, IsNull } = require("typeorm");
const { isUUID } = require("class-validator");
const validation = require("../utils/validation");

const getCourses = async (req, res, next) => {
  const courseData = await courseRepo.find({
    where: {
      start_at: LessThanOrEqual(new Date()),
      end_at: MoreThanOrEqual(new Date()),
    },
    relations: { coach: { user: true }, skill: true },
  });

  const data = courseData.map((item) => {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      start_at: item.start_at,
      end_at: item.end_at,
      max_participants: item.max_participants,
      coach_name: item.coach.user.name,
      skill_name: item.skill.name,
    };
  });

  res.status(200).json({ status: "success", data });
};

const bookCourse = async (req, res, next) => {
  const userId = req.user.id;
  const courseId = req.params.courseId;

  if (!validation.isValidString(courseId) || !isUUID(courseId)) {
    return next(errorHandler(400, "欄位未填寫正確"));
  }

  const courseData = await courseRepo.findOne({ where: { id: courseId } });
  if (!courseData) {
    return next(errorHandler(400, "ID錯誤"));
  }

  const hasBooked = await courseBookingRepo.findOne({
    where: {
      course: { id: courseId },
      user: { id: userId },
    },
  });
  if (hasBooked) {
    return next(errorHandler(400, "已經報名過此課程"));
  }

  const creditPurchaseData = await creditPurchaseRepo.find({
    where: { user: { id: userId } },
    relations: { creditPackage: true },
  });

  const courseBookingData = await courseBookingRepo.find({
    where: { user: { id: userId } },
  });

  const creditUsage = courseBookingData.reduce((acc, cur) => {
    if (!cur.cancelled_at) {
      acc += 1;
    }
    return acc;
  }, 0);

  const totalCredit = creditPurchaseData.reduce((acc, cur) => {
    acc = acc + Number(cur.purchased_credit);
    return acc;
  }, 0);

  if (totalCredit - creditUsage <= 0) {
    return next(errorHandler(400, "已無可使用堂數"));
  }

  const bookingDataCount = await courseBookingRepo.count({
    where: {
      course: { id: courseId },
      cancelled_at: IsNull(),
    },
  });
  if (bookingDataCount >= courseData.max_participants) {
    return next(errorHandler(400, "已達最大參加人數，無法參加"));
  }

  const result = courseBookingRepo.create({
    user: { id: userId },
    course: { id: courseId },
  });

  await courseBookingRepo.save(result);

  res.status(201).json({ status: "success", data: null });
};

const cancelCourse = async (req, res, next) => {
  const userId = req.user.id;
  const { courseId } = req.params;

  const target = await courseBookingRepo.findOne({
    where: {
      user: { id: userId },
      course: { id: courseId },
      cancelled_at: IsNull(),
    },
  });

  if (!target) {
    return next(errorHandler(400, "ID錯誤"));
  }

  target.cancelled_at = new Date();
  await courseBookingRepo.save(target);

  res.status(200).json({ status: "success", data: null });
};

module.exports = {
  getCourses,
  bookCourse,
  cancelCourse,
};
