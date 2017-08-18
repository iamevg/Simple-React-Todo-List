// Dependences:
// + React
// + Redux
// + ReactRedux
// + ReactDOM

// --------- actions start  ----------

const ADD_TODO = "ADD_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const SET_VISIBILITY_FILTER = "SET_VISIBILITY_FILTER";
const VisibilityFilters = {
  SHOW_ALL: "SHOW_ALL",
  SHOW_COMPLETED: "SHOW_COMPLETED",
  SHOW_ACTIVE: "SHOW_ACTIVE"
};

let nextTodoId = 3;

function addTodo(text) {
  return {
    type: ADD_TODO,
    id: nextTodoId++,
    text
  }
}

function toggleTodo(id) {
  return {
    type: TOGGLE_TODO,
    id
  }
}

function setVisibilityFilter(filter) {
  return {
    type: SET_VISIBILITY_FILTER,
    filter
  }
}

// --------- actions end  ----------

// --------- reducers start  ----------

function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO: {
      return [...state, {
        text: action.text,
        completed: false,
        id: action.id
      }];
    }

    case TOGGLE_TODO: {
      return state.map((todo, id) => {
        if (id === action.id) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          });
        }

        return todo;
      });
    }

    default: {
      return state;
    }
  }
}

function visibilityFilter(state = VisibilityFilters.SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER: {
      return action.filter;
    }

    default: {
      return state
    }
  }
}

const todoApp = Redux.combineReducers({
  visibilityFilter,
  todos
});

// --------- reducers end  ----------

// --------- components start  ----------

const App = () => {
  return (
    <div>
      <AddTodo />
      <VisibleTodoList />
      <Footer />
    </div>
  );
};

const Footer = () => {
  return (
    <p>
      <FilterLink filter="SHOW_ALL">Все задачи</FilterLink>
      <FilterLink filter="SHOW_ACTIVE">Активные задачи</FilterLink>
      <FilterLink filter="SHOW_COMPLETED">Завершенные задачи</FilterLink>
    </p>
  );
};

const Link = ({ active, children, onClick }) => {
  if (active) {
    return <span>{ children }</span>
  }

  return (
    <a href="#" onClick = { event => {
        event.preventDefault();

        onClick();
      } }>{ children }</a>
  );
};

const Todo = ({ onClick, completed, text }) => {
  const styles = { textDecoration: completed ? "line-through" : "none" };

  return (
    <li onClick = { onClick } style = { styles }>
      { text }
    </li>
  );
};

const TodoList = ({ todos, onTodoClick }) => {
  return (
    <ul>
      {
        todos.map(todo => <Todo
          key = { todo.id } { ...todo }
          onClick = { () => onTodoClick(todo.id) } />)
      }
    </ul>
  );
};

// --------- components end  ----------

// --------- containers start  ----------

let AddTodo = ({ dispatch }) => {
  let input;

  return (
    <div>
      <form onSubmit = { event => {
          event.preventDefault();

          if (!input.value.trim()) {
            return;
          }

          dispatch(addTodo(input.value));

          input.value = "";
        } }>
        <input type="text" placeholder="Что нужно сделать?" ref = { node => input = node }/>
        <button type="submit">Доавить задачу</button>
      </form>
    </div>
  );
};

AddTodo = ReactRedux.connect()(AddTodo);

var mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
};

var mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter));
    }
  };
};

const FilterLink = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Link);

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case "SHOW_ALL": {
      return todos;
    }

    case "SHOW_COMPLETED": {
      return todos.filter(todo => todo.completed);
    }

    case "SHOW_ACTIVE": {
      return todos.filter(todo => !todo.completed);
    }

    default: {
      return todos;
    }
  }
};

var mapStateToProps = state => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
};

var mapDispatchToProps = dispatch => {
  return {
    onTodoClick: id => {
      dispatch(toggleTodo(id));
    }
  };
};


const VisibleTodoList = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);

// --------- containers end  ----------

// --------- application start  ----------

const initialState = {
  visibilityFilter: "SHOW_ALL",
  todos: [
    {
      id: 0,
      text: "Изучить React",
      completed: true
    },
    {
      id: 1,
      text: "Изучить Redux",
      completed: true
    },
    {
      id: 2,
      text: "Написать приложение \"Список задач\"",
      completed: false
    }
  ]
};

let store = Redux.createStore(todoApp, initialState);

ReactDOM.render(
  <ReactRedux.Provider store = { store }>
    <App />
  </ReactRedux.Provider>,
  document.querySelector("#root")
);

// --------- application end  ----------