module.exports = async  function (call) {

  if(call.CallerID=="0523574321"){
    call.Say(6666)
  }else{
    call.GoToLayer(444)
  }



}