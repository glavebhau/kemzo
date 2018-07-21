var initialState = {
  color: 'red',
  counter: 5,
  enabled: false,
  shoppingList: {
    key1: { name: 'eggs', amount: 12, position: '-2 0 -5', color: 'red' },
    key2: { name: 'milk', amount: 2, position: '2 0 -5', color: 'blue' }
  },
  nested: {
    enabled: false,
    enabled2: false
  },
  position: { x: 0, y: 0, z: 0 }
};

AFRAME.registerState({
  initialState: initialState,

  handlers: {
    fooAdd: (state, payload) => {
      state.counter += payload.number;
      console.log('fooAdd called : ', state.counter);
    },

    fooAddPropertyToNested: (state, payload) => {
      state.nested.item = payload.item;
    },

    fooDisable: (state, payload) => {
      state.enabled = false;
    },

    fooEnable: (state, payload) => {
      state.enabled = true;
    },

    fooEnableNested: (state, payload) => {
      state.nested.enabled = true;
    },

    fooEnableNested2: (state, payload) => {
      state.nested.enabled2 = true;
    },

    fooSubtract: (state, payload) => {
      state.counter -= payload.number;
    },

    fooColor: (state, payload) => {
      state.color = payload.color;
    },

    fooPosition: (state, payload) => {
      state.position.x = payload.position.x;
      state.position.y = payload.position.y;
      state.position.z = payload.position.z;
    },

    shoppingListAdd: (state, payload) => {
      state.shoppingList.push(payload);
    },

    shoppingListRemove: state => {
      state.shoppingList.splice(0, 1);
    },

    shoppingListUpdate: (state, payload) => {
      state.shoppingList.find(item => item.name === payload.name).amount = payload.amount;
      state.shoppingList.__dirty = true;
    }
  },

  computeState: function(state) {
    console.log('computeState called : ', state);
    state.colorCounter = `${state.color}${state.counter}`;
  }
});
