import Controller from "@ember/controller";
import { guidFor } from "@ember/object/internals";
import { tracked } from "@glimmer/tracking";

export default class ApplicationController extends Controller {
  @tracked input = "{}";
  elementId = guidFor(this);

  get data() {
    try {
      return JSON.parse(this.input);
    } catch (error) {
      alert(error.message);
      return {};
    }
  }
}
