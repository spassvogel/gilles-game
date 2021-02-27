import { BaseSceneController } from "./BaseSceneController";

export class AIDirector {
  static sceneController?: BaseSceneController<unknown>;

  static initialize(sceneController: BaseSceneController<unknown>) {
    this.sceneController = sceneController;
  }
}