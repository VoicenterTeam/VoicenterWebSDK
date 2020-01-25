module.exports = async  function (call) {
 call.SetParam("test1","33")
  if(call.CallerID=="0523574321"){
    call.Say(6666)
  }else{
    call.GoToLayer(444)
  }

}