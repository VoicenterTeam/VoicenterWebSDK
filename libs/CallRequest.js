//Load Call Action
const Say = require("../libs/ivrAction/say")


module.exports = class CallRequest {
    constructor(request,reply) {
        this.request = request;
        this.reply = reply;

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

    }

    SetNextLayer(layerId){
        this.ResponseData.NEXT_LAYER=layerId
    }
    async execute() {
        this.reply.send(this.action.GetOutput())
    }

    // Load Action Into the class
    Say(sayOpt) {
       this.action= new Say(sayOpt)

    }


}
