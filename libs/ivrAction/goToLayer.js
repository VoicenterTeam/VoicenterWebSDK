module.exports = class GoToLayerAction {
    constructor(goToLayerData) {
       this.output = {
           "STATUS": 0,
           "ACTION": "GO_TO_LAYER",
           "LAYER": 0,
           "CALLER_NAME": null,
           "CUSTOM_DATA": {}
       }
       this.SayList = []
        if(goToLayerData&&goToLayerData.constructor.name=="Object"){
            if (goToLayerData.NextLayer) {
                this.output.LAYER=goToLayerData.NextLayer
            }
        }
        else if(goToLayerData&&goToLayerData.constructor.name=="Number"){
            this.output.LAYER=goToLayerData
       }
    }
    GetOutput(){
        return this.output
    }
}