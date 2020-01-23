module.exports = async  function (call) {
    call.SetNextLayer(0)
    call.Say([{"Number" : "112"}])
 //   call.Say({"Number" : "112"})
  //  call.Say(15155)
    call.execute();
}