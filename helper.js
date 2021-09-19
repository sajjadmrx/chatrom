const moment = require('moment');

class helper {


    formatMessage(username, message, type) {

        return {
            sender: username,
            text: message,
            time: moment().format('h:mm a'),
            type: type,
            id: this.getRandom()

        }
    }

    getRandom() {
        return Date.now() + Math.floor(Math.random() * 1000);
    }


}

module.exports = new helper();