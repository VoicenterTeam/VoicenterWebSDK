
# VoicenterWebSDK  
Voicenter API  Web-service SDK  including all what you need for IVR, Popup , Cdr2CRM and more.
### Running the project
For Running the server, run a script with the following logic :
```javascript
    const VoicenterWebSDK = require("voicenter-web-sdk")
    const vcSDK = new VoicenterWebSDK({host:'0.0.0.0',port:3000})
    vcSDK.start()
```
this will start a web service that will serve and interact with the different Web API's that Voicenter offers to its customers. more information can be found in:
[https://www.voicenter.co.il/API]
The final path of this service will be entered into the "mini-external-url" found in the layer settings tab.

### Testing
A call for a TestLogic Call logic controller will look like this:
http://127.0.0.1:3000/Ivr/TestLogic
### Reloading settings
and call with reload=true will  make the server reload the call logic without the need for a server restart. 
http://127.0.0.1:3000/Ivr/TestLogic?reload=true

### Example for a Call Logic
A simple Call Logic module should look the following example and should be located inside a TestLogic.js file in the root of the project:
```javascript
    module.exports = async function (call) {
	    call.SetParam("foo","Hello")
	    call.SetParam("foo",call.GetParam("foo")+" World")
	    if(call.CallerID=="0512345678"){
		    call.Say(111)}
		   else{
		    call.GoToLayer(22)  
	     }
    }
```
### Call Logic parameters:
Call logic are function that the server is executing for each IVR call request.
the function will be getting the call object with the following parameters and functions:

**Parameter List:**

| Parameter name | description   | value for example   
|:--|--|:--|  
| Did | DID number that the call was received on (Incoming number).  |031234567 |  
| CallerID | Called ID is the number of the current caller calling the DID number | 0512345678 |  
| CallID | Voicenter unique ID of a call. Can be used for state purposes (also referred to as IVR_UNIQUE_ID) | 76f4hsd4li45m7ergrtg4562456yt |  
| DTMF | If the caller was requested to enter some digits over the phone - the input will be passed in this parameter. *In case the caller did not enter any value (did not make any dial action and timeout has been reached), the default value will always be “0”. | 2 |  
| LayerID | The current layer ID in the IVR that the request is sent from.  | 1 |  
| PreviousLayerID | If the call was passed to the layer from another layer, the previous layer will be shown here. | 0 |


# **Methods List :**

## 1. call.Do(callLogicName)
**Description:** Executes different call logics. 
**callLogicName:** String name of a .js file (without the suffix ".js"), located in the main project folder - to be used to process the request.
 
## 2. call.Say(SayOptions)
**Description:** Executes the Say action.
**SayOptions:** An object received by the Say function - allowing Voicenter IVR to announce the values its getting, such as audio file names, numbers, digits or dates - by the order they are received.
```javascript
	{
	 SayData:[
	 	{"Recording":"youhave.wav"},
		{"Number":"13"},
		{"Recording":"usd.wav"},
		{"Recording":"in-your-account.wav"},
	 	{"Recording":"your-account-number-is.wav"},
	 	{"Digits":"1234"}
	 	],
	 NextLayer:13,
	 Language :"EN"
	}
```
#### SayData  - can contain any of the following options.
Voicenter IVR will announce it in the order its received:
 1. **Recording** - A full file name to play.  
 2. **Number**- A number to announce ("101" will be announced as "one hundred and one").
 3. **Digits** - Digits to announce ("13" will be announced as "one tree" and not as "thirteen").
 4. **Date** - a date to announce.

#### Other parameters:
**NextLayer** - the Next Layer in Voicenter IVR to redirect the call to after playing the Say command.
**Language**- The current language of the current caller to the IVR.


 
## 3. call.GoToLayer(GoToLayerOptions)
**Description:** Allows forwarding the caller to another IVR layer in Voicenter IVRs.
**GoToLayerOptions:**
```javascript
call.GoToLayer(layerID,callerName)
```
are is a valid example:
```javascript
call.GoToLayer({NextLayer:22,callerName:"John Doe"})
```
## 4.call.Execute()
Description: Mandetory action - to finilized the process of the current request and send back the calculated answer back to Voicenter IVR system.
