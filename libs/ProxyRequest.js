const Request = require("./Request");

module.exports = class ProxyRequest extends Request {

  constructor (request, reply, config) {
    super(request, reply, config);
    this.done = false;

    if (config.popupLogicFolder) this.modulePath = config.popupLogicFolder;

    this.clearActionModule();

    this.requireActionModule();

    this.result = { status: 'OK' };
  }

  parseRequest() {
    try {
      if (this.request.body) {
        this.method = 'POST',
        this.data = this.request.body;
      } else {
        this.method = 'GET',
        this.data = this.request.query;
      }
    } catch (err) {
      console.error("parseRequest failed ", err);
    }
  }
}
