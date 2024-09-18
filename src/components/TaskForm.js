import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import backgroundImage from "../assets/Images/task3.jpeg";
import { Field, Form } from "react-final-form";
import { composeValidators, validateRequired } from "../Utils";
import TaskList from "./TaskList";
import { useTaskManager } from "../context/TaskManagerContext";
import { ADD_TASK, UPDATE_TASK } from "../constants/taskManagerConstants";

const TaskForm = () => {
  const { showForm, toggleShowForm, dispatch, editingTask, clearEditingTask } =
    useTaskManager();
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (editingTask) {
      setFormValues({
        title: editingTask.title,
        description: editingTask.description,
      });
    } else {
      setFormValues({
        title: "",
        description: "",
      });
    }
  }, [editingTask]);

  const onSubmit = (values, form) => {
    if (editingTask) {
      // Update the existing task
      const updatedTask = {
        ...editingTask,
        title: values.title,
        description: values.description,
      };

      dispatch({
        type: UPDATE_TASK,
        payload: { updatedTask },
      });
    } else {
      // Create a new task
      const taskId = Date.now().toString();
      const newTask = {
        id: taskId,
        title: values.title,
        description: values.description,
        completed: false,
      };

      dispatch({
        type: ADD_TASK,
        payload: { task: newTask },
      });
    }

    // Reset the form fields
    form.reset();
    // Close the form
    toggleShowForm();
    // Clear the editing task if it was set
    clearEditingTask();
  };

  return (
    <>
      {showForm && (
        <Grid height="99vh" container>
          <Grid item md={6} height="100%" display={{ xs: "none", md: "flex" }}>
            <img
              width="100%"
              height="100%"
              src={backgroundImage}
              alt="taskManager"
            />
          </Grid>

          <Grid item md={6} height="100vh" px="4rem" mt="6rem">
            <Button
              variant="contained"
              sx={{ float: "right", mt: "10px" }}
              onClick={() => {
                toggleShowForm();
                clearEditingTask();
              }}
            >
              Back
            </Button>
            <Stack>
              <Divider />
              <Typography
                sx={{
                  color: "#270082",
                  fontSize: { xs: "22px", md: "32px" },
                  fontWeight: 700,
                  "&:hover": {
                    color: "#8CC0DE",
                  },
                }}
              >
                {editingTask ? "Edit Task" : "Create Tasks Here"}
              </Typography>
            </Stack>
            <Form
              initialValues={formValues}
              onSubmit={onSubmit}
              render={({ handleSubmit, form }) => (
                <form onSubmit={handleSubmit}>
                  <Stack spacing={4} mt={1}>
                    <Grid
                      container
                      spacing={2}
                      sx={{
                        ml: "-16px !important",
                      }}
                    >
                      <Grid item xs={12}>
                        <Field
                          name="title"
                          validate={composeValidators(validateRequired)}
                          render={({ input, meta }) => (
                            <TextField
                              label="Task Name"
                              {...input}
                              fullWidth
                              error={meta.touched && !!meta.error}
                              helperText={meta.touched && meta.error}
                              inputProps={{ maxLength: 25 }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          name="description"
                          validate={composeValidators(validateRequired)}
                          render={({ input, meta }) => (
                            <TextField
                              label="Task Description"
                              {...input}
                              fullWidth
                              error={meta.touched && !!meta.error}
                              helperText={meta.touched && meta.error}
                              multiline
                              rows={4}
                              inputProps={{ maxLength: 150 }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      fullWidth
                      size="large"
                      variant="contained"
                    >
                      {editingTask ? "Update Task" : "Submit"}
                    </Button>
                  </Stack>
                </form>
              )}
            />
          </Grid>
        </Grid>
      )}
      {!showForm && <TaskList />}
    </>
  );
};

export default TaskForm;
