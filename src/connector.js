var redux  = require('redux');
var utils  = require('./utils');
var ERRORS = require('./constants').ERRORS;
var _      = require('lodash');

var _store;

/**
 * @desc initialize the store with a redux store.
 *
 * @param store
 */
exports.initStore = function (store) {
  if(_store){
    return console.error(ERRORS.STORE_INIT);
  }
  return _store = store;
};

/**
 * @desc a property or method annotation. bind a property on
 * the state to the decorated property of the class.
 *
 * @param {string} value - to be find on the state
 * @returns {Function} the annotate function
 *
 */
exports.MapState = function (value) {
  value = value || null;

  return function (target, prop) {

    if (target.ngOnInit) {
      var _onInit     = target.ngOnInit;
      target.ngOnInit = function () {
        _onInit.apply(target);
        unsubscribe(target, mapStateSlice(target, prop, value));
      }
    } else {
      target.ngOnInit = function () {
        unsubscribe(target, mapStateSlice(target, prop, value));
      };
    }
  }
};

/**
 * @desc bind one or more action creators
 * to a property on the class.
 *
 * @param {Function | object } actions
 * @returns {Function} the annotator function
 *
 */
exports.BindActions = function (actions) {
  return function (target, prop) {
    if (target.ngOnInit) {
      var _onInit     = target.ngOnInit;
      target.ngOnInit = function () {
        target[prop] = redux.bindActionCreators(actions, _store.dispatch);
        _onInit.apply(target);
      }
    } else {
      target.ngOnInit = function () {
        target[prop] = redux.bindActionCreators(actions, _store.dispatch)
      }
    }
  }
};

/**
 * @desc identify the decorated property
 * (class method or property) and call the appropriate
 * function for binding
 *
 * @param {*} target - the component instance
 * @param prop - the component property to bind to
 * @param {string} value - the value to be bind on the state
 *
 */
function mapStateSlice(target, prop, value) {

  if (utils.isFunction(target[prop])) {
    return useMapFunction(target, prop);
  }

  return mapSliceToProp(target, prop, value)
}

/**
 * @desc if a map function was decorated,
 * it will be invoked with the current state and
 * the returned object will be merged with the component
 * instance
 *
 * @param target
 * @param prop
 * @returns {*}
 */
function useMapFunction(target, prop) {
  var _state = _store.getState();
  _.assign(target, target[prop](_state));

  return _store.subscribe(()=> {
    _.assign(target, target[prop](_store.getState()));
  })
}

/**
 * @desc map a value from the state to
 * a property on the component instance
 *
 * @param target - the component instance
 * @param prop - the component property to bind to
 * @param value - the value of the prop on state
 *
 */
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

/**
 * @desc returns a slice of the state
 * to be bind to
 *
 * @param store
 * @param slice
 * @returns {*}
 */
function getStateSlice(store, slice) {
  var _state = store.getState();

  if (utils.isString(slice)) {
    var _keys = slice.split('.');

    switch (_keys.length) {
      case 1:
        return _state[_keys[0]];
      case 2:
        return _state[_keys[0]][_keys[1]];
      case 3:
        return _state[_keys[0]][_keys[1]][_keys[2]];
      default:
        console.error(ERRORS.DEEP_NESTING);
        return _state;
    }
  }
}

/**
 * @desc unsubscribe from the store on
 * when the component destroyed
 *
 * @param target
 * @param unsubscribeFn
 */
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