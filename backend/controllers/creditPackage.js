const { dataSource } = require("../db/data-source")
const creditPackageRepo = dataSource.getRepository("CreditPackage")


const getCreditPackage = async(req, res, next) => {
  try {
    const packages = await creditPackageRepo.find({
      select: {
        id: true,
        name: true,
        credit_amount: true,
        price: true
      }
    })
    res.status(200).json({ status: "success", data: packages})
  } catch (error) {
    console.error(error)
    next(error)
  }
}


const createCreditPackage = async(req, res, next) => {
  try {
    const { name, credit_amount, price } = req.body

    const isValidName = typeof name === "string" && name.trim().length > 0
    const isValidCredit = Number.isInteger(credit_amount) && credit_amount > 0
    const isValidPrice = Number.isInteger(price) && price >= 0

    if(!isValidName || !isValidCredit || !isValidPrice){
      res.status(400).json({ status: "failed", message: "欄位未填寫正確"})
      return
    }

    const isDuplicate = await creditPackageRepo.existsBy({ name })
    if(isDuplicate) {
      res.status(400).json({ status: "failed", message: "資料重複"})
      return
    }

    const newPackage = await creditPackageRepo.save({name, credit_amount, price})
    const result = await creditPackageRepo.create(newPackage)

    res.status(200).json({status:"success", data: result})

  } catch (error) {
    console.error(error)
    next(error)
  }
}

const deleteCreditPackage = async(req, res, next) => {

}



module.exports = {
  getCreditPackage,
  createCreditPackage,
  deleteCreditPackage
}