//Load Call Action
const Say = require("../libs/ivrAction/say")
const GoToLayer = require("../libs/ivrAction/goToLayer")
const Dial = require("../libs/ivrAction/dial")


module.exports = class CallRequest {
    constructor(request,reply) {
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
            this.callLogic = require( '../'+global.config.callLogicFolder+'/'+request.params.CallLogic );
        }
        catch( e ) {
            if ( e.code === 'MODULE_NOT_FOUND' ) {
                // The module hasn't been found
            }
            this.callLogic = require("../logic/DefualtCallLogic")
        }

        //
        this.action = null
        this.ResponseData ={

        }

       /* if(options){
            if(options.port)this.port=options.port
            if(options.host)this.host=options.host
        }*/

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
                           that.CustomDataParmList.push(new CallCustomParam(varName,this.request.body.DATA.CUSTOM_DATA[varName],false))
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
        if(!this.done)this.execute()

    }
    async Do(nextLogic) {
        if(nextLogic.constructor.name=="Function"){
            await nextLogic(this)
        }else if (nextLogic.constructor.name=="String") {
            try {
                let nextLogicFuncaion  = require( '../'+global.config.callLogicFolder+'/'+nextLogic );
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
    async execute() {
        this.done =true
        this.reply.send(this.action.GetOutput())
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


}


class CallCustomParam {
    constructor(paramName,paramValue,isUpdated){
        this.Name=""
        this.Value =""
        this.IsUpdated=true
        if(paramName.constructor.name=="Object" && paramName.Name&& paramName.Name.length>0 ){
            this.Name=paramName.Name
            this.SetParamValue(paramName.Value)
            if(paramName.IsUpdated===false)this.IsUpdated=false
        }else if (paramName.constructor.name=="String") {
            this.Name=paramName
            this.SetParamValue(paramValue)
            if(isUpdated===false)this.IsUpdated=false
        }
    }
    SetParamValue(val){
        let valStr =""
        if(val.constructor.name=="Object" ||val.constructor.name=="Array"){
            valStr=JSON.stringify(val)
        }else if(val.constructor.name=="String" ) {
            valStr=val
        }else{
            console.error("Failed to set value to call parameter ",this)
        }
        if(valStr.length<0){
            console.error("parameter value is empty",this)
        }else if(valStr.length>128){
            console.error("parameter value is to big ... cant be more than 128 characters ",this)
        }else{
            this.Value=valStr
        }
    }


}