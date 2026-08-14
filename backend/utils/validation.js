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
  if(!url.trim().toLowerCase().startsWith("https://")){
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

const isValidTimestamp = (dateString) => {
  if (typeof dateString !== "string") return false;

  const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  if (!isoPattern.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

const checkPassword = (password) =>{
  function hasUpperCase(s){
    const regex = /[A-Z]/
    return regex.test(s)
  }

  function hasLowerCase(s){
    const regex = /[a-z]/
    return regex.test(s)
  }

  function hasDigit(s){
    const regex = /[\d]/
    return regex.test(s)
  }

  function validLength(s){
    return typeof s === "string" && s.trim().length >= 8 && s.trim().length <= 16;
  }

  return hasUpperCase(password) && hasLowerCase(password) && hasDigit(password) && validLength(password)
}


module.exports = {
  isValidString,
  isValidNumber,
  isValidUrl,
  isValidSkill,
  isValidTimestamp,
  checkPassword
}

