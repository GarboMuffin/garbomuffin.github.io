import { TaskRunnable } from "./types";
import { getOrDefault } from "./utils";

/*
 * Tasks and TaskRunners are a very core part of the engine
 *
 * Handles what to run, when to run it, to repeat it, and removal.
 */

export interface ITask {
  run(): void;
}

export interface ITaskOptions {
  run: TaskRunnable;
  delay?: number;
}

export interface IRepeatingTaskOptions extends ITaskOptions {
  repeatEvery: number;
  repeatMax?: number;
  onend?: (() => void) | null;
}

export type TaskOptions = ITaskOptions | IRepeatingTaskOptions;

// a task is something to be run at a certain time, maybe repeating
export class Task {
  public runnable: TaskRunnable;
  public delay: number;
  public repeatEvery: number;
  public repeatCount: number = 0;
  public repeatMax: number;
  public onend: () => void;
  public readonly originalOptions: ITaskOptions;

  constructor(options: TaskOptions) {
    const runnable = options.run;
    const delay = getOrDefault(options.delay, 0);
    const repeatEvery = getOrDefault((options as IRepeatingTaskOptions).repeatEvery, -1);
    const repeatMax = getOrDefault((options as IRepeatingTaskOptions).repeatMax, Infinity);
    const onend = getOrDefault((options as IRepeatingTaskOptions).onend, null);

    this.originalOptions = options;

    this.runnable = runnable;
    this.delay = delay;
    this.repeatEvery = repeatEvery;
    this.repeatMax = repeatMax;
    this.onend = onend;
  }

  public run() {
    // pass this task to the function so that it can call things like task.stop();
    this.runnable(this);
  }

  public stop() {
    this.delay = -1;
  }
}

// the things that runs tasks
// adds everything tasks use
// most methods prefixed with _ to avoid as many collisions as possible
// almost EVERYTHING extends this (and as such can have tasks on it)
export class TaskRunner {
  private _tasks: Task[] = [];
  private _newTasks: Task[] = [];

  protected runTasks() {
    if (this._newTasks.length > 0) {
      for (const newTask of this._newTasks) {
        this._tasks.push(newTask);
      }
      this._newTasks = [];
    }

    for (const task of this._tasks) {
      if (task.delay <= 0) {
        task.run();
        task.repeatCount++;

        if (task.delay === -1) {
          // called task.stop();
        } else if (task.repeatEvery >= 0 && task.repeatCount < task.repeatMax) {
          task.delay = task.repeatEvery;
        } else {
          task.delay = -1;
        }
      } else {
        task.delay--;
      }
    }

    this._tasks = this._tasks.filter((task) => {
      if (task.delay === -1) {
        if (task.onend) {
          task.onend();
        }
        return false;
      }
      return true;
    });
  }

  public resetTasks() {
    this._tasks = [];
  }

  public stopAllTasks() {
    this._tasks = [];
    this._newTasks = [];
  }

  // add a task
  // can either be a task or a function
  // if it is a task it is added as you would expect
  // if it is a function it will repeat every frame
  public addTask(task: Task | TaskRunnable): Task {
    if (typeof task === "function") {
      return this.addTask(new Task({
        run: task as TaskRunnable,
        repeatEvery: 0,
      }));
    } else {
      this._newTasks.push(task);
      return task;
    }
  }
}
