import React, { useState } from "react";
import {
  Grid,
  IconButton,
  Typography,
  Stack,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useTaskManager } from "../context/TaskManagerContext";
import DataTable from "react-data-table-component";
import ConfirmDeleteDialog from "./DeleteDialog";

const TaskList = () => {
  const { tasks, dispatch, toggleShowForm, setEditingTask } = useTaskManager();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleDelete = (taskId) => {
    setTaskToDelete(taskId);
    setDialogOpen(true);
  };

  const handleStatusChange = (row, newStatus) => {
    dispatch({
      type: "UPDATE_TASK",
      payload: {
        updatedTask: {
          id: row.id,
          title: row?.title,
          description: row?.description,
          completed: newStatus === "Completed",
        },
      },
    });
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      dispatch({
        type: "REMOVE_TASK",
        payload: { taskId: taskToDelete },
      });
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "Completed") return task.completed;
    if (filterStatus === "Incomplete") return !task.completed;
    return true;
  });

  const columns = [
    {
      name: "S.No",
      selector: (row) => row.id,
    },
    {
      name: "Task Name",
      selector: (row) => row.title,
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
    {
      name: "Task Status",
      cell: (row) => (
        <Select
          value={row.completed ? "Completed" : "Incomplete"}
          onChange={(e) => handleStatusChange(row, e.target.value)}
          style={{ width: "70%", padding: "8px", height: "40px" }}
        >
          <MenuItem value="Incomplete">Incomplete</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <IconButton
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(row.id)}
          >
            <DeleteIcon color="primary" />
          </IconButton>
          <IconButton
            variant="contained"
            color="secondary"
            onClick={() => handleEdit(row)}
          >
            <EditIcon color="primary" />
          </IconButton>
        </>
      ),
    },
  ];
  const customStyles = {
    rows: {
      style: {
        justifyContent: "center",
        textAlign: "center",
      },
    },
    headCells: {
      style: {
        minHeight: "65px",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "#5773ff",
        fontSize: "14px",
        color: "white",
        paddingLeft: "16px",
        paddingRight: "auto",
      },
    },
    cells: {
      style: {
        paddingLeft: "2px",
        paddingRight: "2px",
        pointer: "cursor",
        justifyContent: "center",
        textAlign: "center",
      },
    },
  };
  return (
    <Grid container height="100vh">
      <Grid item xs={12} px="4rem" mt="2rem">
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{
                color: "#270082",
                fontSize: { xs: "24px", md: "32px" },
                fontWeight: 700,
                mb: 2,
                "&:hover": {
                  color: "#8CC0DE",
                },
              }}
            >
              Task List
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <FormControl
                variant="outlined"
                sx={{ minWidth: 200, mr: "20px" }}
              >
                <InputLabel id="status-select-label">
                  Filter By Task Status
                </InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  sx={{ mr: "20px", width: "150px" }}
                  label="search by status"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="Incomplete">Incomplete</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={toggleShowForm}
                sx={{ height: "50px", width: "150px" }}
              >
                Add Task
              </Button>
            </Stack>
          </Stack>
          {filteredTasks.length === 0 ? (
            <Box
              sx={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Typography variant="h5">No tasks available</Typography>
            </Box>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={filteredTasks}
                customStyles={customStyles}
              />
              <ConfirmDeleteDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={confirmDelete}
              />
            </>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default TaskList;
