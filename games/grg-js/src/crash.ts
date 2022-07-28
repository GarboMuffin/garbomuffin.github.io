// Crash handling
window.onerror = function (e: any) {
  document.getElementById("error-msg").innerText = e.toString();
  document.getElementById("crash-msg").style.cssText += "display: block !important;";
  document.getElementById("restart-success").style.cssText += "display: none !important;";
  state = null; // IT'S TIME TO STOP
}

interface RestartTaskOptions {
  task: () => void
  name: string
}

class RestartTask {
  public constructor(options: RestartTaskOptions) {
    this.task = options.task;
    this.name = options.name;
  }

  public name: string
  public task() { }
}

const RESTART_TASKS = [
  new RestartTask({
    task: function () {
      state();
    },
    name: "restart",
  }),
  new RestartTask({
    task: function () {
      player.reset();
      state();
    },
    name: "reset player then restart"
  }),
  new RestartTask({
    task: function () {
      reset();
      state();
    },
    name: "reset then restart"
  })
]

function attemptResume() {
  state = play;
  var success = false;
  document.getElementById("restart-fail").style.cssText += "display: none !important;"
  for (let task of RESTART_TASKS) {
    try {
      task.task();
      render(); // some errors are caused by rendering
      console.log(`Attempting '${task.name}'... success`);
      success = true;
      break;
    } catch (e) {
      console.warn(e);
      console.log(`Attempting '${task.name}'... fail`);
    }
  }
  if (success) {
    document.getElementById("crash-msg").style.cssText += "display: none !important;"
    document.getElementById("restart-fail").style.cssText += "display: none !important;"
    document.getElementById("restart-success").style.cssText += "display: block !important;";
    loop();
  } else {
    console.warn("All tasks failed, aborting...");
    document.getElementById("restart-fail").style.cssText += "display: inline !important;";
  }
}
