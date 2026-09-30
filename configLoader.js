const fs = require('fs');
const path = require('path');

module.exports = function loadConfig() {
  if (fs.existsSync(path.join(__dirname, 'config.jsonc'))) {
    try {
      const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.jsonc')));
      return config;
    } catch (error) {
      throw new Error(error);
    }
  } else {
    const defaultConfig = {
      security: {
        ssl: false
      },
      server: {
        port: 8080
      },
      database: {
        username: "root",
        password: "",
        port: 3306
      }
    }
    try {
      fs.writeFileSync(path.join(__dirname, 'config.jsonc'), JSON.stringify(defaultConfig));
      return defaultConfig;
    } catch (error) {
      throw new Error(error);
    }
  }
}