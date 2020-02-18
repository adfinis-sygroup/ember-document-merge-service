import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { guidFor } from "@ember/object/internals";

export default class UploadComponent extends Component {
  @service ajax;

  @tracked error = null;
  elementId = guidFor(this);

  @action async uploadTemplate(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);

    // Append data with values that should not be set by the user.
    data.append("engine", "docx-template");

    const options = {
      data,
      // https://stackoverflow.com/a/5976031
      contentType: false,
      processData: false
    };

    try {
      const response = await this.ajax.post("/template/", options);
      this.args["on-upload"](response);

      // Clear the form on success.
      form.reset();
    } catch (error) {
      this.error = error.payload;
    }
  }
}
