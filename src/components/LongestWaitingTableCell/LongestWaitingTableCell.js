import React from "react";
import { Utils } from "@twilio/flex-ui";

import { Ticker } from "..";
import { Constants } from "../../utils";


/**
 * New column for longest waiting time
 */
class LongestWaitingTableCell extends React.Component {

  constructor(props) {
    super(props);
  }


  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return this.renderLongestWaitingTimeTicker(this.props.queue);
  }

  renderLongestWaitingTimeTicker(queue) {
    const timestamp = queue.longest_task_waiting_from;

    const ticker = (
      <Ticker>
        {() => {
          // Set the style to color: red if duration is more than 5 secs
          const spanStyle =
            getDurationFromTimestamp(timestamp) > Constants.LONGEST_WAITING_THRESHOLD_MS ? { color: "red", fontWeight: "bold" } : {};
          return <span style={spanStyle}>{Utils.formatTimeDuration(getDurationFromTimestamp(timestamp), "short")}</span>
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



export default LongestWaitingTableCell;