/* eslint-disable no-bitwise */
import React, {
  useState, useCallback, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TextField, Button } from '@material-ui/core';

import { startTask, stopTask } from '../../store/actionsCreator';
import { formatTimerCounter } from '../../utils/durationFormatter';
import AlertDialog from '../AlertDialog';
import useStyles from './styles';

let interval;

const Timer = ({
  currentTask, startTimer, stopTimer,
}) => {
  const classes = useStyles();
  const taskNameInputRef = useRef(null);
  const [counter, setCounter] = useState(
    currentTask.id ? new Date().valueOf() - currentTask.startTime.valueOf() : 0,
  );
  const [buttonText, setButtonText] = useState(currentTask.id ? 'Stop' : 'Start');

  const [dialogOpen, setDialogOpen] = React.useState(false);

  useEffect(() => {
    const { id, startTime, name } = currentTask;
    if (id) {
      interval = setInterval(() => {
        setCounter(new Date().valueOf() - startTime.valueOf());
      }, 1000);
      taskNameInputRef.current.value = name || '';
    }
    return () => clearInterval(interval);
  }, [currentTask]);

  const onButtonClick = useCallback(() => {
    if (buttonText === 'Start') {
      const startTime = new Date();
      startTimer({
        duration: 0, startTime, name: taskNameInputRef.current.value, id: `f${(~~(Math.random() * 1e8)).toString(16)}`,
      });
      setButtonText('Stop');
      interval = setInterval(() => setCounter(new Date().valueOf() - startTime.valueOf()), 1000);
    } else {
      if (taskNameInputRef.current.value === '') {
        setDialogOpen(true);
        return;
      }
      clearInterval(interval);
      const endTime = new Date();
      stopTimer({
        ...currentTask,
        endTime,
        duration: endTime - currentTask.startTime,
        name: taskNameInputRef.current.value,
      });
      taskNameInputRef.current.value = '';
      taskNameInputRef.current.disabled = false;
      setCounter(0);
      clearInterval(interval);
      setButtonText('Start');
    }
  }, [buttonText, currentTask, startTimer, stopTimer]);

  return (
    <div className={classes.timerContainer}>
      <TextField
        className={classes.taskNameInput}
        InputProps={{
          className: classes.taskNameInput,
        }}
        placeholder="Name of your task"
        autoFocus
        inputRef={taskNameInputRef}
      />
      <div className={classes.timerClock}>{formatTimerCounter(counter)}</div>
      <Button
        color="primary"
        size="large"
        className={classes.stopBtn}
        onClick={onButtonClick}
      >
        {buttonText}
      </Button>
      <AlertDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        taskNameInputRef={taskNameInputRef}
      />
    </div>
  );
};

Timer.propTypes = {
  currentTask: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    startTime: PropTypes.instanceOf(Date),
    endTime: PropTypes.instanceOf(Date),
    duration: PropTypes.number,
  }).isRequired,
  startTimer: PropTypes.func.isRequired,
  stopTimer: PropTypes.func.isRequired,
};


export default connect(
  ({ tasksStore: { tasks, currentTask } }) => ({ tasks, currentTask }),
  { startTimer: startTask, stopTimer: stopTask },
)(Timer);
