import { GENERATE_TASK, START_TIMER, STOP_TIMER, DELETE_TASK } from './types';

export const generateTask = () =>  ({ type: GENERATE_TASK })

export const startTask = (currentTask) =>  ({ type: START_TIMER, currentTask })

export const stopTask = (currentTask, tasks) => ({ type: STOP_TIMER, currentTask, tasks })

export const deleteTask = (tasks) => ({ type: DELETE_TASK, tasks: [...tasks] })