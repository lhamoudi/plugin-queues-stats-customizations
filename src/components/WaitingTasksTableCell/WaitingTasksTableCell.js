import React from "react";
import { Utils } from "@twilio/flex-ui";

import { Ticker } from "..";
import { Constants } from "../../utils";


/**
 * Override column for waiting tasks
 */
class WaitingTasksTableCell extends React.Component {

  constructor(props) {
    super(props);
  }


  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return this.renderWaitingTasks(this.props.queue);
  }

  renderWaitingTasks(queue) {
    // Calculate number of waiting tasks by adding pending and reserved
    const { pending, reserved } = queue.tasks_by_status;
    const waitingTasks = pending + reserved;

    // Set the style to color: red if # of waiting tasks is > threshold
    const spanStyle =
      waitingTasks > Constants.WAITING_TASKS_THRESHOLD ? { color: "red", fontWeight: "bold" } : {};

    // Return the element to render
    return <span style={spanStyle}>{waitingTasks}</span>;
  }
}



export default WaitingTasksTableCell;