var sprintf = require('sprintf-js').sprintf;
var $ = require('jquery');

var DakaraUtils = {
    getCookie: function(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = $.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    },

    formatHourTime: function(timestamp) {
        var date = new Date(timestamp);
        return sprintf("%02d:%02d",date.getHours(), date.getMinutes());
    },

    formatTime: function(seconds) {
        var hours = Math.floor(seconds / 3600);
        var remaining = seconds % 3600;
        var minsec = sprintf("%02d:%02d", Math.floor(remaining / 60), remaining % 60);
        return (hours == 0 ? '' : (hours + ":")) + minsec;
    },

    formatDuration: function(seconds) {
        var hours = Math.floor(seconds / 3600);
        var remaining = seconds % 3600;
        var minsec = sprintf("%01d:%02d", Math.floor(remaining / 60), remaining % 60);
        return (hours == 0 ? '' : (hours + ":")) + minsec;
    },

    params: {
        url: "/",
        pollInterval: 1000
    }
}

module.exports = DakaraUtils;
