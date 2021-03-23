const Request = require('./Request');

const CallCustomParam = require("../libs/ivrAction/callParam");
//Load Call Action
const Say = require("../libs/ivrAction/say");
const GoToLayer = require("../libs/ivrAction/goToLayer");
const Dial = require("../libs/ivrAction/dial");

module.exports = class CallRequest extends Request {
  constructor(request, reply, config) {
    super(request, reply, config);

    if (config.callLogicFolder) this.modulePath = config.callLogicFolder;

    this.clearActionModule();
    this.requestFields = new Map([
      ['DID', 'Did'],
      ['CALLER_ID', 'CallerID'],
      ['IVR_UNIQUE_ID', 'CallID'],
      ['DTMF', 'DTMF'],
      ['LAYER_ID', 'LayerID'],
      ['PREVIOUS_LAYER_ID', 'PreviousLayerID'],
    ]);

    this.requestFields.forEach((classField) => {
      this[classField] = null;
    });

    // Load var From Request
    this.requireActionModule();
    this.parseRequest();
  }

  parseRequest() {
    try {
      if (this.request.body.DATA) {
        this.parseRequestToObject(this.request.body.DATA);
        this.parseCustomData(this.request.body.DATA.CUSTOM_DATA);
      }
    } catch (err) {
      console.error("parseRequest failed ", err);
    }
  }

  async execute() {
    await this.executeModule(this);

    if (!this.done) {
      this.done = true;

      let responseObj = {};

      responseObj = this.action.GetOutput();
      responseObj.CUSTOM_DATA = this.OutputParam();

      this.reply.send(responseObj);
    }

  }

  async Do(nextLogic) {
    if (nextLogic.constructor.name == "Function") {
      await nextLogic(this)
    } else if (nextLogic.constructor.name == "String") {
      try {
        let nextLogicFuncaion = require(this.modulePath + '/' + nextLogic);

        nextLogicFuncaion(this);
      } catch (err) {
        console.error("Failed to Do Logic " + nextLogic, err)
      }
    }
  }

  SetNextLayer(layerId) {
    this.ResponseData.NEXT_LAYER = layerId
  }

  // Load Action Into the class Start
  Say(sayData, nextLayer, language) {
    this.action = new Say(sayData, nextLayer, language)
  }

  GoToLayer(goToLayerData, callerName) {
    this.action = new GoToLayer(goToLayerData, callerName)
  }

  Dial(target, dialOpt, call) {
    this.action = new Dial(target, dialOpt, call)
  }
  // Load Action Into the class End

  // Call Custom Param Functions Start
  SetParam(parmName, paramValue) {
    let params = this.CustomDataParmList.filter((param) => param.Name == parmName);

    if (params.length > 0) {
      params.forEach(function (param) {
        param.Update(paramValue);
      })
    } else {
      this.CustomDataParmList.push(new CallCustomParam(parmName, paramValue, true))
    }
  }

  GetParam(parmName) {
    let param = this.CustomDataParmList.find((param) => param.Name == parmName);

    return param ? param.Value : '';
  }

  OutputParam() {
    let parmsOutput = {}

    let params = this.CustomDataParmList.filter((param) => param.IsUpdated);

    params.forEach(function (param) {
      parmsOutput[param.Name] = param.Value;
    });

    return parmsOutput
  }
  // Call Custom Param Functions  End
}
