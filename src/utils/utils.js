import { Actions, Manager, TaskHelper } from "@twilio/flex-ui";

class Utils {
  _manager = Manager.getInstance();

  get flexState() {
    return this._manager.store.getState().flex;
  }

  get manager() {
    return this._manager;
  }

  isSupervisor() {
    const { roles } = this._manager.user;
    return roles.indexOf("supervisor") >= 0 || roles.indexOf("admin") >= 0;
  } 
}

export default new Utils();
