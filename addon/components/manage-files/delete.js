import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency-decorators";
import naturalSort from "javascript-natural-sort";

export default class DeleteComponent extends Component {
  @service ajax;

  @tracked error = null;
  templates = null;
  /**
   * The selected property holds the currently selected template
   * to be used in the modal dialog before deleting a template.
   * @property selected
   */
  selected = null;

  constructor(...args) {
    super(...args);
    this.fetchTemplates.perform();
  }

  didReceiveAttrs() {
    super.didReceiveAttrs();
    this.templates = this.args.templates;
  }

  @task
  *fetchTemplates() {
    try {
      const onFetch = this.args["on-fetch"];
      const response = yield this.ajax.request("/template/");
      const templates = response.results.sort((a, b) =>
        naturalSort(a.description, b.description)
      );

      if (onFetch) {
        onFetch(templates);
      }
    } catch (error) {
      this.error = error;
    }
  }

  @action requestDelete(template) {
    this.selected = template;
  }

  @action async submitDelete() {
    const template = this.selected;

    this.selected = null;
    this.error = null;

    try {
      const onDelete = this.args["on-delete"];
      await this.ajax.del(`/template/${template.slug}`);

      if (onDelete) {
        onDelete(template);
      }
    } catch (error) {
      this.error = error;
    }
  }

  @action cancelDelete() {
    this.selected = null;
  }
}
