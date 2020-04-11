import React from "react";
// import { IdentityContext } from "../../identity-context";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Flex, Label, Checkbox, Button, Input } from "theme-ui";

// $text string variable is required to make a new todo
const ADD_TODO = gql`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      id
    }
  }
`;

const UPDATE_TODO_DONE = gql`
  mutation UpdateTodoDone($id: ID!) {
    updateTodoDone(id: $id) {
      id
      text
      done
    }
  }
`;

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      text
      done
    }
  }
`;

// const todosReducer = (state, action) => {
//   switch (action.type) {
//     case "addTodo":
//       return [{ done: false, value: action.payload }, ...state];
//     case "toggleTodoDone":
//       const newState = [...state];
//       newState[action.payload] = {
//         done: !state[action.payload].done,
//         value: state[action.payload].value,
//       };
//       return newState;
//     default:
//       return state;
//   }
// };

const Dashboard = () => {
  // const [todos, dispatch] = React.useReducer(todosReducer, []);
  const inputRef = React.useRef();
  // deconstruct the user from the provider
  // const { user } = React.useContext(IdentityContext);

  // useQuery will fetch data when it is initialized
  // and refetch needs to be called every time a refesh is needed
  const { loading, error, data, refetch } = useQuery(GET_TODOS);

  // useMutation return a function that takes an object
  // with the variables required to perform that mutation.
  // The 'data' is destructured from the response of that
  // mutation.
  const [addTodo] = useMutation(ADD_TODO);
  const [updateTodoDone] = useMutation(UPDATE_TODO_DONE);

  return (
    <>
      <Flex
        as="form"
        onSubmit={async (e) => {
          e.preventDefault();
          const todoText = inputRef.current.value;
          if (todoText) {
            await addTodo({ variables: { text: todoText } });
            await refetch();
            // dispatch({ type: "addTodo", payload: inputRef.current.value });
            inputRef.current.value = "";
          }
        }}
      >
        <fieldset>
          <legend>Add Todos</legend>

          <Label sx={{ display: "flex" }}>
            <Input ref={inputRef} sx={{ marginLeft: 1 }} />
          </Label>
          <Button sx={{ marginLeft: 1 }}>Submit</Button>
        </fieldset>
      </Flex>

      <Flex sx={{ flexDirection: "column" }}>
        {loading && <div>laoding...</div>}
        {error && <div>{error.message}</div>}
        {!loading && !error && (
          <ul sx={{ listStyleType: "none" }}>
            {data.todos.length === 0 ? <Flex as="li">No TODOs.</Flex> : null}
            {data.todos.map((todo) => {
              return (
                <Flex
                  as="li"
                  key={todo.id}
                  onClick={async () => {
                    await updateTodoDone({ variables: { id: todo.id } });
                    await refetch();
                    // dispatch({ type: "toggleTodoDone", payload: index });
                  }}
                >
                  <Label>
                    <Checkbox checked={todo.done} readOnly />
                    {todo.text}
                  </Label>
                </Flex>
              );
            })}
          </ul>
        )}
      </Flex>
    </>
  );
};

export default Dashboard;
