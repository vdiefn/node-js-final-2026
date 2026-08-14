const { dataSource } = require("../db/data-source");
const creditPackageRepo = dataSource.getRepository("CreditPackage");
const { isUUID } = require("class-validator");
const errorHandler = require("../utils/errorHandler")

const getCreditPackage = async (req, res, next) => {
  const packages = await creditPackageRepo.find({
    select: {
      id: true,
      name: true,
      credit_amount: true,
      price: true,
    },
  });
  res.status(200).json({ status: "success", data: packages });
};

const createCreditPackage = async (req, res, next) => {
  const { name, credit_amount, price } = req.body;

  const isValidName = typeof name === "string" && name.trim().length > 0;
  const isValidCredit = Number.isInteger(credit_amount) && credit_amount > 0;
  const isValidPrice = Number.isInteger(price) && price >= 0;

  if (!isValidName || !isValidCredit || !isValidPrice) {
    return next(errorHandler(400, "欄位未填寫正確"))
  }

  const isDuplicate = await creditPackageRepo.existsBy({ name });
  if (isDuplicate) {
    return next(errorHandler(400, "資料重複"))
  }

  const newPackage = await creditPackageRepo.save({
    name,
    credit_amount,
    price,
  });
  const result = await creditPackageRepo.create(newPackage);

  res.status(200).json({ status: "success", data: result });

};

const deleteCreditPackage = async (req, res, next) => {
  const { id } = req.params;
  if (!isUUID(id)) {
    return next(errorHandler(400, "錯誤的id資訊"))
  }
  const result = await creditPackageRepo.delete(id);
  if (result.affected === 0) {
    return next(errorHandler(400, "ID錯誤"))
  }

  res.status(200).json({
    status: "success",
    data: {
      raw: result.raw,
      affected: result.affected,
    },
  });
};

module.exports = {
  getCreditPackage,
  createCreditPackage,
  deleteCreditPackage,
};
