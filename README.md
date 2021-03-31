
# VoicenterWebSDK  
Voicenter API  Web-service SDK  including all what you need for IVR, Popup , Cdr2CRM and more.
### Running the project
For Running the server, run a script with the following logic :
```javascript
    const VoicenterWebSDK = require("voicenter-web-sdk");

    const vcSDK = new VoicenterWebSDK({host:'0.0.0.0',port:3000});

    vcSDK.start();
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
	    call.SetParam("foo","Hello");
	    call.SetParam("foo",call.GetParam("foo")+" World");
	    if(call.CallerID==="0512345678"){
		    call.Say(111);
		   }else{
		    call.GoToLayer(22);
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
```json
	{
	 "SayData":[
	 	{"Recording":"youhave.wav"},
		{"Number":"13"},
		{"Recording":"usd.wav"},
		{"Recording":"in-your-account.wav"},
	 	{"Recording":"your-account-number-is.wav"},
	 	{"Digits":"1234"}
	 	],
	 "NextLayer":13,
	 "Language" :"EN"
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

## 4. call.Dial(Targets,DialOptions,call)
**Description:** Allows forwarding the caller to call external phone number  or Voicenter Extensions .
 1. **Targets** - List of destinations to call (phone or Voicenter Extensions).  
 2. **DialOptions**- Options Dial configuration .
 3. **call** - call object for internal use , Dynamic callerID for example .

```javascript
call.Dial("0523574321",{"Recording":true ,"Duration":1800,"Ring":60,"NextVo":666,"CallerID":"0722776772","CallerName":"Voicenter Api Team"},call)
```
or:
```javascript
call.Dial(["0523574321","0722776772"],{"Recording":true ,"Duration":1800,"Ring":60,"NextVo":666,"CallerID":"0722776772","CallerName":"Voicenter Api Team"},call)
```
or:

```javascript
call.Dial([{"Target":"0523574321","Type":"PHONE"}],{"Recording":true ,"Duration":1800,"Ring":60,"NextVo":666,"CallerID":"0722776772","CallerName":"Voicenter Api Team"},call)
```
## 5.call.Execute()
Description: Mandetory action - to finilized the process of the current request and send back the calculated answer back to Voicenter IVR system.

### Example for a CDR Logic

```javascript
module.exports = async function (cdr) {
  console.debug(cdr);

  cdr.Done();
}
```
### CDR Logic parameters:
CDR logic are function that the server is executing for each CDR request.
the function will be getting the cdr object with the following parameters:

**Parameter List:**

| Parameter name | description   | value for example   
|:--|--|:--|  
| caller | caller is the caller’s phone number. | 0512345678 |
| target | target the destination of the call Can be a phone number or the exten- sion SIP code. | 0512345678 |
| time | time the time that that the call was made in Epoch time. | 1615895784 |
| duration | the duration of the call(seconds). This duration does not include the ringing duration only the actual time of the conversation that was made. | 33 |  
| ivruniqueid | the ID code of the specific call. | 76f4hsd4li45m7ergrtg4562456yt |  
| type | the type of Call. For example: if it is an incoming/outgoing call? There are several call types. | Incoming Call |  
| status | status is what happened with the specific call? There are several call statuses. | ANSWER |
| targetextension | the extension SIP code that answered to the incoming call. | AAPINFzL |
| callerextension | the extension SIP code that the call was dialed from. | AAPINFzL |
| did | the origin phone number that the caller called to. | 0722776772 |
| queueid | If the call was directed to a queue service, it displays the queue code ID. | 12345 |
| queuename | If the call was directed to a queue service, it displays the queue name. | Service Queue |
| record | it is URL link to the call recording. | http://starkey-cen-trex-recordings.s3.amazonaws |
| price | the total price of the call in ILS cents (Agorot). | 7 |
| dialtime | the ringing duration of the call(seconds). Not include the actual conversation duration. | 23 |
| representative_name | the Voicenter user name that the specific call was associated with. | Walter Melon |
| representa-tive_code | the Voicenter user ID code that the specific call was associated with. | 9996 |
| targetexten-sion_name | the Voicenter extension name that answered to the specific call. | Walter Melon |
| callerexten-sion_name | the Voicenter extension name that this specific call was made from. | Walter Melon |
| target_country | the country name that this outgoing call was made to. | Israel |
| caller_country | the country name that this incoming call was made from. | Israel |
| seconds_wait-ing_in_queue | will only be sent in the json CDR, if the specific called was directed to a queue. | 5 |
| Origi-nalIvrUniqueID | will only be sent in the json CDR, if the specific called was related to another call. | 201809131730110122APIAPIAPI-API |

### Example for a PopUp Logic

```javascript
module.exports = async function (popUp) {
  console.debug(popUp);

  popUp.Result.STATUS = "OK";
  popUp.Result.URL = "https://www.google.com/search?q=" + this.phone;
  popUp.Result.COMPANY = "Voicenter Dev Team";
  popUp.Result.CLIENTNAME = "Israel Israeli";
  popUp.Result.TOTAL = 1;

  popUp.Done();
}
```
### CDR Logic parameters:
CDR logic are function that the server is executing for each CDR request.
the function will be getting the cdr object with the following parameters:

**Parameter List:**

| Parameter name | description   | value for example   
|:--|--|:--|  
| phone | The caller caller-ID. | 0722776772 |
| ivrid | The call unique identifier code. | 202010111sdsd3684752bcb3d |
| extenUser | In which extension the call is currently ringing. The value sent is the extension’s SIP code(the extension unique identifier). | SIPSIPl |
| did | To which DID the caller call to? Relevant to incoming calls. | 0722776773 |
| statusCall | The current state of the call. For incoming calls - "Ringing" – the call is currently ringing at the extension. For outgoing calls – "Dialing". | Ringing |

**Respose parameter List:**

| Parameter name | description   | value for example   
|:--|--|:--|  
| STATUS | Only accepts "OK". Any other value will indicate that there was an error on the client side. | OK |
| URL | A link to the caller’s contact details page out of your business information software(CRM). | https://www.yourdomain.com/contact_search.asp?user_phone=0722776772 |
| CLIENTNAME | The caller’s name out of your CRM. | John Doe |
| TOTAL | How many results were found in your CRM. | 1 |
| COMPANY | The caller’s company name out of your CRM. | Voicenter |

# **Methods List :**

## 1. popUp.Done()
**Description:** Send popUp respons to client's application.

```javascript
popUp.Done();
```
