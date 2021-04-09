const jwt = require('jsonwebtoken');

const Request = require('./Request');

module.exports = class PopupRequest extends Request {
  constructor(request, reply, config) {
    super(request, reply, config);

    if (config.popupLogicFolder) this.modulePath = config.popupLogicFolder;

    this.done = false;
    // Main Request Popup Vars
    this.queueid = null;
    this.requestFields = new Map([
      ['phone', 'phone'],
      ['ivrid', 'ivruniqueid'],
      ['extenUser', 'target'],
      ['did', 'did'],
      ['statusCall', 'status'],
      ['approved', 'approved'],
    ]);

    this.requestFields.forEach((classField) => {
      this[classField] = null;
    });

    this.Result = {
      STATUS: "OK",
      URL: "",
      CLIENTNAME: "",
      TOTAL: 0,
      COMPANY: "",
    };

    this.clearActionModule();
    this.requireActionModule();
  }

  parseRequest() {
    try {
      if (this.request.body) {
        this.parseRequestToObject(this.request.body);
        this.parseCustomData(this.request.body.CUSTOM_DATA);
      } else {
        this.parseRequestToObject(this.request.query);
        this.parseCustomData(this.request.query.CUSTOM_DATA);
      }
    } catch (err) {
      console.error("parseRequest failed ", err);
    }
  }

  ApprovePopup(approveUrlPath) {
    try {
      this.done = true;

      const protocol = this.request.protocol || 'http://';
      const host = this.request.hostname;
      const popupPath = this.request.raw.originalUrl.split('?')[0];

      const query = {
        ...this,
        request: undefined,
        reply: undefined,
        Result: undefined,
        popupURL: protocol + host + popupPath,
        responseContentType: undefined,
      };

      this.Result["URL"] = protocol + host + '/PopupApprove/' + approveUrlPath + '?&data=' + jwt.sign(query, this.config.jwtKey);

      this.reply.send(this.Result);
    } catch (err) {
      console.error("Faled to encode data to jwt", err);
    }
  }
}
