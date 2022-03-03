import React from "react";
import { connect } from 'react-redux';
import { Utils } from "@twilio/flex-ui";

import { Ticker } from "..";

import { namespace } from '../../state';
import { Constants } from "../../utils";

/**
 * New column for longest active time
 */
class LongestActiveTableCell extends React.Component {

  constructor(props) {
    super(props);
  }


  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return this.renderLongestActiveTimeTicker(this.props.queue)
  }

  renderLongestActiveTimeTicker(queue) {
    let timestamp = this.props.queueActiveTaskStats?.longestActiveTaskDateCreated;

    if (!timestamp) {
      // fallback to mirroring longest wait time value - if there are no active tasks
      timestamp = queue.longest_task_waiting_from;
    }
  
    const ticker = (
      <Ticker>
        {() => {
          // Set the style to color: red if duration is more than 60 secs
          const spanStyle =
            getDurationFromTimestamp(timestamp) > Constants.LONGEST_ACTIVE_THRESHOLD_MS
              ? { color: "red", fontWeight: "bold" }
              : {};
          return (
            <span style={spanStyle}>
              {Utils.formatTimeDuration(
                getDurationFromTimestamp(timestamp),
                "short"
              )}
            </span>
          );
        }}
      </Ticker>
    );
    return ticker;
  }
}



function getDurationFromTimestamp(timestamp) {
  const duration = timestamp ? Date.now() - new Date(timestamp).getTime() : 0;

  return duration;
}

function getQueueActiveTaskStats(state, queueSid) {
  const queueState = state.activeTasksSummary?.queues.find((q) => q.queue_sid === queueSid);

  if (!queueState) { 
    return null;
  }
  return queueState.taskStats;
} 

function mapStateToProps(state, ownProps) {
  const customReduxStore = state?.[namespace];

  return {
    queueActiveTaskStats: getQueueActiveTaskStats(customReduxStore, ownProps.queue.key)
  }
}

export default connect(mapStateToProps)(LongestActiveTableCell);