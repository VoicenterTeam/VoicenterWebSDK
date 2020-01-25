let callLogicFolder = __dirname+"/../../../"
if(global.config.callLogicFolder)callLogicFolder= __dirname+"/../../../"+global.config.callLogicFolder
console.log("Loading CallRequest Class , Call Logic folder is :",callLogicFolder)
const clear = require("clear-module");

const CallCustomParam = require("../libs/ivrAction/callParam")
//Load Call Action
const Say = require("../libs/ivrAction/say")
const GoToLayer = require("../libs/ivrAction/goToLayer")
const Dial = require("../libs/ivrAction/dial")

module.exports = class CallRequest {
    constructor(request,reply) {
        if(request.query.reload||request.query.Reload){
            clear(callLogicFolder+'/'+request.params.CallLogic )
        }
        this.request = request;
        this.reply = reply;
        // Main Request IVR_LAYER_INPUT Vars
        this.Did = null
        this.CallerID = null
        this.CallID = null
        this.DTMF = ""
        this.LayerID = null
        this.PreviousLayerID = null
        this.CustomDataParmList =[]
        // Load var From Request
        this.parseRequest()

        try {
            this.callLogic = require( callLogicFolder+'/'+request.params.CallLogic  );
        }
        catch( e ) {
            if ( e.code === 'MODULE_NOT_FOUND' ) {
                // The module hasn't been found
                console.error("MODULE_NOT_FOUND "+ request.params.CallLogic  ,e)
            }
            console.error("MODULE load failed  "+ request.params.CallLogic  ,e)
            console.error("Loading  "+__dirname+"../DefualtCallLogic")

            this.callLogic = require("../logic/DefualtCallLogic")
        }

        //
        this.action = null
        this.ResponseData ={

        }
    }
    parseRequest(){
        let that =this
        try{
           if(this.request.body.DATA){
               if(this.request.body.DATA.DID)this.Did = this.request.body.DATA.DID
               if(this.request.body.DATA.CALLER_ID)this.CallerID = this.request.body.DATA.CALLER_ID
               if(this.request.body.DATA.IVR_UNIQUE_ID)this.CallID = this.request.body.DATA.IVR_UNIQUE_ID
               if(this.request.body.DATA.DTMF)this.DTMF = this.request.body.DATA.DTMF
               if(this.request.body.DATA.LAYER_ID)this.LayerID = this.request.body.DATA.LAYER_ID
               if(this.request.body.DATA.PREVIOUS_LAYER_ID)this.PreviousLayerID = this.request.body.DATA.PREVIOUS_LAYER_ID

               //Parsing CUSTOM_DATA
               if(this.request.body.DATA.CUSTOM_DATA&&this.request.body.DATA.CUSTOM_DATA.constructor.name=="Object"){
                   Object.keys(this.request.body.DATA.CUSTOM_DATA).forEach(function (varName) {
                       try{
                           that.CustomDataParmList.push(new CallCustomParam(varName,that.request.body.DATA.CUSTOM_DATA[varName],false))
                       }catch (e) {
                           console.error("Failed adding CUSTOM_DATA parameter ",varName)
                       }
                   })
               }
           }
       }catch (e) {
           console.error("parseRequest failed ",e)
       }
    }
    async DoCallLogic() {
        await this.callLogic(this)
        if(!this.done)this.Execute()

    }
    async Do(nextLogic) {
        if(nextLogic.constructor.name=="Function"){
            await nextLogic(this)
        }else if (nextLogic.constructor.name=="String") {
            try {
                let nextLogicFuncaion  = require( callLogicFolder+'/'+nextLogic );
                nextLogicFuncaion(this)
            }
            catch( e ) {
               console.error("Failed to Do Logic "+ nextLogic ,e)
            }
        }


    }
    SetNextLayer(layerId){
        this.ResponseData.NEXT_LAYER=layerId
    }
    async Execute() {
        this.done =true
        let responseObj ={}
        responseObj=this.action.GetOutput();
        responseObj.CUSTOM_DATA = this.OutputParam()
        this.reply.send(responseObj)
    }

    // Load Action Into the class Start
    Say(sayOpt) {
        this.action= new Say(sayOpt)

    }
    GoToLayer(goToLayerOpt) {
        this.action= new GoToLayer(goToLayerOpt)
    }
    Dial(dialOpt) {
        this.action= new Dial(dialOpt)
    }
    // Load Action Into the class End

    // Call Custom Param Functions  Start
    SetParam(parmName,paramValue){
        let params = this.CustomDataParmList.filter(function (p) {return p.Name ==parmName });
        if(params.length>0){
            params.forEach(function (param) {
                param.Update(paramValue)
            })
        }else{
            this.CustomDataParmList.push(new CallCustomParam(parmName,paramValue,true))
        }


    }
    GetParam(parmName){
        let params = this.CustomDataParmList.filter(function (p) {return p.Name ==parmName });
        return params[0].Value
    }
    OutputParam(){
        let parmsOutput ={}
        let params = this.CustomDataParmList.filter(function (p) {return p.IsUpdated  });
        params.forEach(function (param) {
          parmsOutput[param.Name]=param.Value
        })

        return parmsOutput
    }
    // Call Custom Param Functions  End
}
