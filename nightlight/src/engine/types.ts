import { AbstractSprite } from "./sprite";
import { Task } from "./task";

/*
 * A few reusable types
 */

export type TImage = HTMLImageElement;
export type TSound = HTMLAudioElement;
export type Runnable = () => void;
export type TaskRunnable = (task: Task) => void;

export type Sprite = AbstractSprite;

export type TBackground = string | CanvasGradient | CanvasPattern;
