var React = require('react');
var ReactAsync = require('react-async');
var Promise = require('bluebird');
var isServer = (typeof window == 'undefined');

// TODO be smart, prevent inject model values to DOM more than once
var Injected = {};

// take props
// - model      Object : server : real model instance
// - modelName  String : client
var DataInjector = React.createClass({
  mixins: [ReactAsync.Mixin],
  getInitialStateAsync: function(cb) {
    var model_name = this.props['data-modelName'];
    var model = this.props['data-model'];

    // TODO 不要重覆塞資料

    if(Injected[model_name] || !isServer) {
      cb(null, {});

    } else {
      model.getter().then(function(data) {
        cb(null, {
          payload_data: JSON.stringify(data)
        });
      });
    }
  },
  render: function() {
    var model_name = this.props['data-modelName'];
    var scripts = '';

    // TODO 不要重覆塞資料
    if(isServer) {
      scripts = '' +
        'window.__preloadedModelValues["' + model_name + '"] = ' +
        this.state.payload_data + ';';
    }

    var payload = {
      __html: scripts
    };

    return React.DOM.script({
      dangerouslySetInnerHTML:payload
    });
  }
});

module.exports = DataInjector;

