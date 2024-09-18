import React, { useEffect, createContext, useReducer, useContext } from "react";
import {
  ADD_TASK,
  REMOVE_TASK,
  UPDATE_TASK,
  SET_FILTER,
  TOGGLE_COMPLETED,
  TASKS,
  FILTER,
  TOGGLE_SHOW_FORM,
  SET_EDITING_TASK,
  CLEAR_EDITING_TASK,
} from "../constants/taskManagerConstants";

// Initial state
const initialState = {
  [TASKS]: [],
  [FILTER]: "all",
  showForm: false,
  editingTask: null,
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case ADD_TASK: {
      const { task } = action.payload;
      const updatedTasks = [...state[TASKS], task];
      localStorage.setItem(TASKS, JSON.stringify(updatedTasks));
      return {
        ...state,
        [TASKS]: updatedTasks,
      };
    }

    case REMOVE_TASK: {
      const { taskId } = action.payload;
      const updatedTasks = state[TASKS].filter((task) => task.id !== taskId);
      localStorage.setItem(TASKS, JSON.stringify(updatedTasks));
      return {
        ...state,
        [TASKS]: updatedTasks,
      };
    }

    case UPDATE_TASK: {
      const { updatedTask } = action.payload;
      const updatedTasks = state[TASKS].map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      localStorage.setItem(TASKS, JSON.stringify(updatedTasks));
      return {
        ...state,
        [TASKS]: updatedTasks,
      };
    }

    case SET_FILTER: {
      const { filter } = action.payload;
      localStorage.setItem(FILTER, filter);
      return {
        ...state,
        [FILTER]: filter,
      };
    }

    case TOGGLE_COMPLETED: {
      const { taskId } = action.payload;
      const updatedTasks = state[TASKS].map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      localStorage.setItem(TASKS, JSON.stringify(updatedTasks));
      return {
        ...state,
        [TASKS]: updatedTasks,
      };
    }

    case TOGGLE_SHOW_FORM: {
      return {
        ...state,
        showForm: !state.showForm,
      };
    }
    case SET_EDITING_TASK: {
      return {
        ...state,
        editingTask: action.payload.task,
      };
    }

    case CLEAR_EDITING_TASK: {
      return {
        ...state,
        editingTask: null,
      };
    }

    default:
      return state;
  }
};

const TaskManagerContext = createContext({
  ...initialState,
});

export const TaskManagerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(TASKS);
      const savedFilter = localStorage.getItem(FILTER);

      if (savedTasks) {
        dispatch({
          type: "SET_TASKS",
          payload: {
            tasks: JSON.parse(savedTasks),
          },
        });
      }
      if (savedFilter) {
        dispatch({
          type: SET_FILTER,
          payload: {
            filter: savedFilter,
          },
        });
      }
    } catch (err) {
      console.error("Failed to load data from localStorage", err);
    }
  }, []);

  const toggleShowForm = () => {
    dispatch({
      type: TOGGLE_SHOW_FORM,
    });
  };
  const setEditingTask = (task) => {
    dispatch({
      type: "SET_EDITING_TASK",
      payload: { task },
    });
    toggleShowForm();
  };

  const clearEditingTask = () => {
    dispatch({
      type: "CLEAR_EDITING_TASK",
    });
  };
  return (
    <TaskManagerContext.Provider
      value={{
        ...state,
        dispatch,
        toggleShowForm,
        setEditingTask,
        clearEditingTask,
      }}
    >
      {children}
    </TaskManagerContext.Provider>
  );
};

export const useTaskManager = () => {
  const context = useContext(TaskManagerContext);
  if (!context) {
    throw new Error("useTaskManager must be used within a TaskManagerProvider");
  }
  return context;
};

export default TaskManagerContext;
