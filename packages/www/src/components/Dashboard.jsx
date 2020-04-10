import React from "react";
// import { IdentityContext } from "../../identity-context";
import { Flex, Label, Checkbox, Button, Input } from "theme-ui";

const todosReducer = (state, action) => {
  switch (action.type) {
    case "addTodo":
      return [{ done: false, value: action.payload }, ...state];
    case "toggleTodoDone":
      const newState = [...state];
      newState[action.payload] = {
        done: !state[action.payload].done,
        value: state[action.payload].value,
      };
      return newState;
    default:
      return state;
  }
};

const Dashboard = () => {
  const [todos, dispatch] = React.useReducer(todosReducer, []);
  const inputRef = React.useRef();
  // deconstruct the user from the provider
  // const { user } = React.useContext(IdentityContext);

  return (
    <>
      <Flex
        as="form"
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({ type: "addTodo", payload: inputRef.current.value });
          inputRef.current.value = "";
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
        <ul sx={{ listStyleType: "none" }}>
          {todos.map((todo, index) => {
            return (
              <Flex as="li" key={index}>
                <Label htmlFor={index}>
                  <Checkbox
                    id={index}
                    checked={todo.done}
                    onChange={() => {
                      dispatch({ type: "toggleTodoDone", payload: index });
                    }}
                  />
                  {todo.value}
                </Label>
              </Flex>
            );
          })}
        </ul>
      </Flex>
    </>
  );
};

export default Dashboard;
