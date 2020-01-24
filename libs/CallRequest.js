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
       try{
           if(this.request.body.DATA){
               if(this.request.body.DATA.DID)this.Did = this.request.body.DATA.DID
               if(this.request.body.DATA.CALLER_ID)this.CallerID = this.request.body.DATA.CALLER_ID
               if(this.request.body.DATA.IVR_UNIQUE_ID)this.CallID = this.request.body.DATA.IVR_UNIQUE_ID
               if(this.request.body.DATA.DTMF)this.DTMF = this.request.body.DATA.DTMF
               if(this.request.body.DATA.LAYER_ID)this.LayerID = this.request.body.DATA.LAYER_ID
               if(this.request.body.DATA.PREVIOUS_LAYER_ID)this.PreviousLayerID = this.request.body.DATA.PREVIOUS_LAYER_ID
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
