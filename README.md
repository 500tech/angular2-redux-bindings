angular2 redux binding
==========

Bind redux store and actions creators to angular2 components
using annotations.


How to use:
--------------------------

Add to your packages:
```
    npm install angular2-redux-binding --save
```
call the `initStore()` before angular bootstrap:
```javascript
    import {initStore} from 'angular2-redux-bindings'

    initStore(store)
    // bootstrap angular
```

bind state values to your component properties with `@MapState`:

```javascript
  import {mapState} from 'angular2-redux-bindings'

  @Component({
    template: '<p>{{ value }}</p>'
  })

  class Component {

    @MapState('value')
    private value;
  }

```

you can bind a deeply nested value up to three levels :

```javascript
  import {mapState} from 'angular2-redux-bindings'

  @Component({
      template: '<h2>{{ title }}</h2>'
    })

  class Component {

    @MapState('app.list.title')
    private title;

  }

```

if the value is deeply nested, use a function instead:

```javascript
  import {mapState} from 'angular2-redux-bindings'

  @Component({
      template: `
            <h2>{{ title }}</h2>
            <p>{{ value }} </p>
            `
  })

  class Component {

    @MapState()
    mapStateToThis(state){
      return {
        title: state.app.list.title,
        value: state.app.list.item.value
      }
    }
  }

```

Bind an action creator to a component property with `@BindActions`:

```javascript
  import {bindActions}   from 'angular2-redux-bindings'
  import {actionCreator} from 'your-acrions'

  @Component({
      template: `<button (click)='action()'>click</h2>`
   })

  class Component {

    @BindActions(actionCreator)
    private action;
  }

```

Bind multiple action creators:

```javascript
  import {bindActions} from 'angular2-redux-bindings'
  import * as actions  from 'your-acrions'

  @Component({
     template: `<button (click)='actions.action()'>click</h2>`
  })


  class Component {

    @BindActions(actions)
    private actions;
  }

```

The module is under development, **but the API won't change** so you can use it in your
project if you like.

contribution:
--------------------------

PR's are welcome!
the module does't required any compilation.
just clone it. to run tests (in watch mode) run;

```
  npm test
```