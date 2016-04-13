var redux = require('redux');
var utils = require('./utils');
var _     = require('lodash');

// reference to the store
var _store;

exports.initStore = function (store) {
  _store = store;
};

exports.MapState = function (value) {
  value = value || null;

  return function (target, prop) {
    if (target.ngOnInit) {
      var _onInit     = target.ngOnInit;
      target.ngOnInit = function () {
        _onInit();
        unsubscribe(target, mapStateSlice(target, prop, value));
      }
    } else {
      target.ngOnInit = function () {
        unsubscribe(target, mapStateSlice(target, prop, value));
      };
    }
  }
};

exports.BindActions = function (actions) {
  return function (target, prop) {
    if (target.ngOnInit) {
      var _onInit     = target.ngOnInit;
      target.ngOnInit = function () {
        _onInit();
        target[prop] = redux.bindActionCreators(actions, _store.dispatch)
      }
    } else {
      target.ngOnInit = function () {
        target[prop] = redux.bindActionCreators(actions, _store.dispatch)
      }
    }
  }
};

function mapStateSlice(target, prop, value) {

  if (utils.isFunction(target[prop])) {
    return useMapFunction(target, prop);
  }

  return mapSliceToProp(target, prop, value)
}

function useMapFunction(target, prop) {
  var _state = _store.getState();
  _.assign(target, target[prop](_state));

  return _store.subscribe(()=> {
    _.assign(target, target[prop](_state));
  })
}

function mapSliceToProp(target, prop, value) {
  if (!target[prop]) {
    target[prop] = getStateSlice(_store, value);
  }

  return _store.subscribe(function () {
    if (target[prop] !== getStateSlice(_store, value)) {
      target[prop] = getStateSlice(_store, value)
    }
  })
}

function getStateSlice(store, slice) {
  var _state = store.getState();

  if (utils.isString(slice)) {
    var _keys = slice.split('.');

    _keys.forEach(function (key) {
      return _state = _state[key]
    });
    return _state;
  }
}

function unsubscribe(target, unsubscribeFn) {
  if (target.ngOnDestroy) {
    var _onDestroy = target.ngOnDestroy;

    target.ngOnDestroy = function () {
      _onDestroy();
      unsubscribeFn();
    }
  } else {
    target.ngOnDestroy = function () {
      unsubscribeFn();
    }
  }
}
