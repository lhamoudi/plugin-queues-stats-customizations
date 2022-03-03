import React from "react";

import { ActiveTaskListener } from "../../state";

/**
 * Renderless component to monitor active tasks via LiveQuery
 */
class ActiveTasksMonitor extends React.Component {

  activeTaskListener = undefined;

  constructor(props) {
    super(props);
    this.activeTaskListener = ActiveTaskListener.create();
  }


  componentDidMount() {
    this.activeTaskListener.queuesSearch();
  }

  componentWillUnmount() {
    this.activeTaskListener.unsubscribe();
  }

  render() {
    return null; // Renderless component
  }
}

export default ActiveTasksMonitor;