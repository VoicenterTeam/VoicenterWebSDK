
# VoicenterWebSDK  
Voicenter API  Web-service SDK  including all what you need for IVR, Popup , Cdr2CRM and more ...  
  
##  
For Running the a server run a script with the following logic  :

    const VoicenterWebSDK = require("./index")
    const vcSDK = new VoicenterWebSDK({host:'0.0.0.0',port:3000})
    vcSDK.start()
    
##
A simple Call logic module shold me look like that :

    module.exports = async  function (call) {
	    call.SetParam("test1","33")
	    call.SetParam("foo",call.GetParam("foo")+"!!!!!!!!!!")
	    if(call.CallerID=="0523574321"){
		    call.Say(6666)}
		   else{
		    call.GoToLayer(444)  
	     }
    }


Call logic are funcaion that the server is excuting for each Ivr call request .
the funcaion will be getting the call object with the floowing parameters and funcations  :
**Parameter List :**
|Parameter name | description   | value for exsample |
|--|--|--|
| Did |  | |
| CallerID|  | |
| CallID|  | |
| DTMF|  | |
| LayerID|  | |
| PreviousLayerID|  | |

**Methods List :**

 1. call.Do(callLogicName)
 
 2. call.Say(SayOptions)
 
 3. call.Dial(dailOptions)
 
 4. call.GoToLayer(GoToLayerOptions)
 
 5.call.Execute()	