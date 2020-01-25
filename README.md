
# VoicenterWebSDK  
Voicenter API  Web-service SDK  including all what you need for IVR, Popup , Cdr2CRM and more ...  
  
##  
For Running the a server run a script with the following logic  :

    const VoicenterWebSDK = require("voicenter-web-sdk")
    const vcSDK = new VoicenterWebSDK({host:'0.0.0.0',port:3000})
    vcSDK.start()
    
##
this will star a webservice that will serve the different Web-Api that voicenter provide to there customers .
[https://www.voicenter.co.il/API]
##
A call for a TestLogic Call logic controller will be lock like:

http://127.0.0.1:3001/Ivr/TestLogic

and call with reload=true will  make the server to reload the call logic with out a server restart 

http://127.0.0.1:3001/Ivr/TestLogic?reload=true

##
A simple Call logic module should me look like that and should be locate inside of TestLogic.js in the root of the project:


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

| Parameter name | description   | value for example   
|--|--|--|  
| Did | DID number that the call was received on(Incoming number).  |039007000 |  
| CallerID | Called ID of the current caller.   | 0344454545  |  
| CallID |Voicenter unique ID of a call. Can be used for state purposes (IVR_UNIQUE_ID) | 76574567568rrgfergwgrtg4562456yt |  
| DTMF| If the caller was requested to enter identification information, this input will be passed in this parameter.        *In case the caller did not enter any value(did not make any dial action), the default value will        always be “0”. |  2 |  
| LayerID | The current layer ID in the IVR that the request is sent from.  | 1 |  
| PreviousLayerID | If the call was passed to the layer from another layer, the previous layer will be shown here. | 0 |


**Methods List :**

 1. call.Do(callLogicName)
 
 2. call.Say(SayOptions)
 
 3. call.Dial(dailOptions)
 
 4. call.GoToLayer(GoToLayerOptions)
 
 5.call.Execute()	

[]: https://www.voicenter.co.il/API