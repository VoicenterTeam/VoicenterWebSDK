//Load Call Action
const Say = require("../libs/ivrAction/say")


module.exports = class CallRequest {
    constructor(request,reply) {
        this.request = request;
        this.reply = reply;
        this.done = false ;

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

    // Load Action Into the class
    Say(sayOpt) {
       this.action= new Say(sayOpt)

    }


}
