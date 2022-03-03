const ACTION_SET_QUEUES = "SET_QUEUES";
const ACTION_SET_QUEUE_TASKS = "SET_QUEUE_TASKS";
const ACTION_HANDLE_TASK_UPDATED = "HANDLE_TASK_UPDATED";
const ACTION_HANDLE_TASK_REMOVED = "HANDLE_TASK_REMOVED";



const initialState = {
  queues: undefined,
};

// Define plugin actions
export class Actions {

  static setQueues = (queues) => ({
    type: ACTION_SET_QUEUES,
    queues
  });
  static setQueueTasks = (queueSid, tasks) => ({
    type: ACTION_SET_QUEUE_TASKS,
    payload: {
      queueSid,
      tasks
    }
  });
  static handleTaskUpdated = (task) => ({
    type: ACTION_HANDLE_TASK_UPDATED,
    task
  });
  static handleTaskRemoved = (taskSid) => ({
    type: ACTION_HANDLE_TASK_REMOVED,
    taskSid
  });
}

// Define how actions influence state
export function reduce(state = initialState, action) {
  switch (action.type) {

    case ACTION_SET_QUEUES:
      return {
        ...state,
        queues: action.queues,
      };
    case ACTION_SET_QUEUE_TASKS:
      return {
        ...state,
        queues: state.queues.map((item, index) => {
          // Update the matching queue
          if (item.queue_sid === action.payload.queueSid) {
            return {
              ...item,
              tasks: action.payload.tasks,
              taskStats: getTaskStats(action.payload.tasks)
            }
          }
          // Non matching queues left untouched
          return item;
        }),
      };
    case ACTION_HANDLE_TASK_UPDATED:
      return {
        ...state,
        queues: state.queues.map(queue => {
          if (queue.queue_name === action.task.queue_name) {
            const copyOfTasks = [...queue.tasks];
            const existingTaskIndex = copyOfTasks.findIndex(t => t.task_sid === action.task.task_sid);
            if (existingTaskIndex < 0) {
              copyOfTasks.push(action.task);
            } else {
              copyOfTasks[existingTaskIndex] = action.task;
            }
            return {
              ...queue,
              tasks: copyOfTasks,
              taskStats: getTaskStats(copyOfTasks),
            }
          }
          return queue;
        }),
      };
    case ACTION_HANDLE_TASK_REMOVED:
      return {
        ...state,
        queues: state.queues.map(queue => {
          const existingTaskIndex = queue.tasks.findIndex(t => t.task_sid === action.taskSid);
          if (existingTaskIndex >= 0) {
            const filteredTasks = queue.tasks.filter(task => task.task_sid !== action.taskSid);
            return {
              ...queue,
              tasks: filteredTasks,
              taskStats: getTaskStats(filteredTasks)            
            };
          }
          return queue;
        }),
      };
    default:
      return state;
  }

  function getTaskStats(tasks) {

    const stats = {
      longestActiveTime: 0
    };

    if (!tasks || tasks.length === 0) {
      return stats;
    }

    // First, let's sort by age to get the longest waiting
    const orderedByAge = tasks.sort((a, b) => (a.age > b.age) ? 1 : -1);
    stats.longestActiveTaskDateCreated = orderedByAge[0].date_created;
    stats.longestActiveTaskSid = orderedByAge[0].task_sid;

    // That's it for now
    return stats;
  }
};
