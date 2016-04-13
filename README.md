angular2 redux binding
==========

Bind state and actions creators to angular components
using annotations


How to use:
--------------------------

Add to your packages:

    npm install angular2-redux-binding --save

call the `initStore()` before angular bootstrap:

    import {initStore} from 'angular2-redux-bindings'

    initStore(store)


bind state to your component with `@MapState`:
```
  import {mapState} from 'angular2-redux-bindings'

  class Component () {

    @MapState('value')
      private value;
  }

```

you can use a function instead:
```
  import {mapState} from 'angular2-redux-bindings'

  class Component () {

    @MapState()
    mapStateToThis(state){
      return {
        value: state.value
      }
    }
  }

```
Bind action creators (one or more):
```
  import {bindActions}   from 'angular2-redux-bindings'
  import {actionCreator} from 'your-acrions'

  class Component () {

    @BindActions(actionCreator)
    private action;
  }

```

```
  import {bindActions}   from 'angular2-redux-bindings'
  import * as actions    from 'your-acrions'

  class Component () {

    @BindActions(actions)
    private actions;
  }

```

better documentation on the way...