import React from "react";
import { FlexPlugin } from "@twilio/flex-plugin";
import { ColumnDefinition, QueuesStats } from "@twilio/flex-ui";

import reducers, { namespace } from "./state";
import { utils } from "./utils";
import { ActiveTasksMonitor, LongestActiveTableCell, LongestWaitingTableCell, WaitingTasksTableCell } from "./components";

const PLUGIN_NAME = "QueuesStatsCustomizationsPlugin";

export default class QueuesStatsCustomizationsPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {
    if (utils.isSupervisor()) {
      this.registerReducers(manager);
      this.initComponents(flex);
    }
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(
        `You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`
      );
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }

  initComponents(flex) {
    // Add the renderless monitor component
    flex.MainHeader.Content.add(
      <ActiveTasksMonitor key="active-tasks-monitor" />,
      {
        sortOrder: 100,
      }
    );

    // TEMP: Filter out noisy queues
    // QueuesStats.setFilter((queue) =>
    //   queue.friendly_name !== "Recovery Ping"
    //   && queue.friendly_name !== "Manual Pick"
    // );

    // Create a new "Longest Active Time" column with custom formatting
    flex.QueuesStats.QueuesDataTable.Content.add(
      <ColumnDefinition
      key="my-longest-active-time"
      header="Longest"
      content={(queue) => {
        return <LongestActiveTableCell queue={queue}/>
      }}/>,
      { sortOrder: 1 } // Put this after the second column
    );

    // Replace "Waiting Tasks" with a custom formatted one
    flex.QueuesStats.QueuesDataTable.Content.remove("waiting-tasks");
    flex.QueuesStats.QueuesDataTable.Content.add(
      <ColumnDefinition
      key="my-waiting-tasks"
      header="Waiting"
      content={(queue) => {
        return <WaitingTasksTableCell queue={queue}/>
      }}/>,
      { sortOrder: 2 } // Put this after the third column
    );
    
    // Replace "Longest Waiting Time" with a custom formatted one
    flex.QueuesStats.QueuesDataTable.Content.remove("longest-wait-time");
    flex.QueuesStats.QueuesDataTable.Content.add(
      <ColumnDefinition
      key="my-longest-wait-time"
      header="Longest"
      content={(queue) => {
        return <LongestWaitingTableCell queue={queue}/>
      }}/>,
      { sortOrder: 3 } // Put this after the fourth column
    );
}
}
