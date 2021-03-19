module.exports = async function (popUp) {
  console.debug(popUp);
  popUp.Result.STATUS = "OK";
  popUp.Result.URL = "https://www.google.com/search?q=" + this.phone;
  popUp.Result.CLIENTNAME = "Israel Israeli";
  popUp.Result.TOTAL = 1;
  popUp.Result.COMPANY = "Voicenter Dev Team";

  popUp.Done();
}
