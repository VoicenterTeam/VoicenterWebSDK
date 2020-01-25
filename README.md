
# VoicenterWebSDK  
Voicenter API  Web-service SDK  including all what you need for IVR, Popup , Cdr2CRM and more ...  
  
##  
For Running the a server run a script with the following logic  :

    const VoicenterWebSDK = require("voicenter-web-sdk")
    const vcSDK = new VoicenterWebSDK({host:'0.0.0.0',port:3000})
    vcSDK.start()
    
##
A simple Call logic module should me look like that :

    module.exports = async  function (call) {
	    call.SetParam("test1","33")
	    call.SetParam("foo",call.GetParam("foo")+"!!!!!!!!!!")
	    if(call.CallerID=="0523574321"){
		    call.Say(6666)}
		   else{
		    call.GoToLayer(444)  
	     }
    }
