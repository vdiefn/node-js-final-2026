

const isValidString = (s) => {
  return typeof s === "string" && s.trim().length > 0
}


const isValidNumber = (num) => {
  return typeof num === "number" && num >= 0 && Number.isInteger(num)
}

const isValidUrl = (url) => {
  if(typeof url !== "string" || url.trim().length === 0 ){
    return false
  }
  if(!url.trim().toLowerCase().startsWith("https")){
    return false
  }
  return true
}

const isValidSkill = (skills) => {
  if(!Array.isArray(skills) || skills.length === 0 ){
    return false
  }
  return skills.every((item) => isValidString(item));
}

module.exports = {
  isValidString,
  isValidNumber,
  isValidUrl,
  isValidSkill
}

