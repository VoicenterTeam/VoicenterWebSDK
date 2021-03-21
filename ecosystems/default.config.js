module.exports = {
  apps: [
    {
      name: 'WebSDK',
      script: "app.js",
      args: 'config/default.json',
      instances: 1,
      watch: false,
      autorestart: true,
      out_file: "/var/log/WebSDK/out.log",
      error_file: "/var/log/WebSDK/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss ",
    }
  ]
};
