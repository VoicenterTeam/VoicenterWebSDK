module.exports = async  function (call) {
    call.SetParam("test1","33")
    call.SetParam("foo",call.GetParam("foo")+"!!!!!!!!!!")
  if(call.CallerID=="0523574321"){
    call.Say(6666)
  }else{
    call.GoToLayer(444)
  }

}