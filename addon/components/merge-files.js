import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { saveAs } from "file-saver";
import { task } from "ember-concurrency-decorators";
import naturalSort from "javascript-natural-sort";

export default class MergeComponent extends Component {
  @service ajax;

  @tracked error = null;
  @tracked templates = null;
  filename = "download1";

  constructor(...args) {
    super(...args);
    this.fetchTemplates.perform();
  }

  @task
  *fetchTemplates() {
    try {
      const response = yield this.ajax.request("/template/");
      const templates = response.results.sort((a, b) =>
        naturalSort(a.description, b.description)
      );
      this.templates = templates;
    } catch (error) {
      this.templates = [];
    }
  }

  @action mergeTemplate(event) {
    event.preventDefault();
    const form = event.target;
    const slug = form.elements.template.value;

    if (!slug) {
      return;
    }

    // https://stackoverflow.com/a/23797348
    const filename = `${this.filename}.docx`;
    const payload = JSON.stringify({ data: this.args.data });
    const request = new XMLHttpRequest();

    request.open(
      "POST",
      `${this.ajax.host || ""}${this.ajax.namespace ||
        ""}/template/${slug}/merge/`
    );

    request.setRequestHeader("Content-Type", this.ajax.contentType);

    request.responseType = "blob";

    request.addEventListener("load", ({ target: { response } }) => {
      try {
        saveAs(response, filename);
      } catch (error) {
        this.error = error.message;
      }
    });

    request.addEventListener("error", error => {
      this.error = error.message;
    });

    request.send(payload);
  }
}
