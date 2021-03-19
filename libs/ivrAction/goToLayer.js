module.exports = class GoToLayerAction {
  constructor(goToLayerData, callerName) {
    //call.GoToLayer(layerID,callerName)
    //call.GoToLayer({NextLayer:22,callerName:"John Doe"})
    this.output = {
      "STATUS": 0,
      "ACTION": "GO_TO_LAYER",
      "LAYER": 0,
      "CALLER_NAME": null,
      "CUSTOM_DATA": {}
    }
    if (goToLayerData && goToLayerData.constructor.name == "Object") {
      if (goToLayerData.NextLayer) {
        this.output.LAYER = goToLayerData.NextLayer
      }
      if (goToLayerData.CallerName) {
        this.output.CALLER_NAME = goToLayerData.CallerName
      }
    } else if (goToLayerData && goToLayerData.constructor.name == "Number") {
      this.output.LAYER = goToLayerData
      if (callerName) this.output.CALLER_NAME = callerName
    }
  }
  GetOutput() {
    return this.output
  }
}