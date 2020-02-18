import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { A } from "@ember/array";
import { action } from "@ember/object";

export default class ManageComponent extends Component {
  @tracked templates = null;

  @action setTemplates(templates) {
    this.templates = A(templates);
  }

  @action addTemplate(template) {
    this.templates = A([...this.templates, template]);
  }

  @action removeTemplate(template) {
    this.templates = A(this.templates.without(template));
  }
}
