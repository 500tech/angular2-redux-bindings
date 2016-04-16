var redux     = require('redux');
var expect    = require('expect');
var connector = require('../src/connector');

describe('connector', function () {

  it('should map a state value to a component property', function () {
    var prop = 'VALUE';

    function mockReducer(state) {
      return state;
    }

    var store = redux.createStore(mockReducer, {value: 'CONNECTOR'});
    connector.initStore(store);

    var component = {};
    connector.MapState('value')(component, prop);
    component.ngOnInit();

    expect(component[prop]).toBe('CONNECTOR');
  });

  it('should map a nested state value to a component property', function () {
    var prop = 'VALUE';

    function mockReducer(state) {
      state = state || {value: 'CONNECTOR'};
      return state;
    }

    var store = redux.createStore(redux.combineReducers({mockReducer:mockReducer}));
    connector.initStore(store);

    var component = {};
    connector.MapState('mockReducer.value')(component, prop);
    component.ngOnInit();

    expect(component[prop]).toBe('CONNECTOR');

  });

  it('should map a nested state value up to 3 levels to a component property', function () {
    var prop = 'VALUE';

    function mockReducer(state) {
      state = state || {value: {nested:'CONNECTOR'}};
      return state;
    }

    var store = redux.createStore(redux.combineReducers({mockReducer:mockReducer}));
    connector.initStore(store);

    var component = {};
    connector.MapState('mockReducer.value.nested')(component, prop);
    component.ngOnInit();

    expect(component[prop]).toBe('CONNECTOR');

  })
});
