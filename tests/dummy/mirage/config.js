import Response from "ember-cli-mirage/response";

export default function() {
  this.passthrough("/write-coverage");

  this.urlPrefix = "http://localhost:8888";
  this.namespace = "/api/v1";

  this.get("/template/", schema => {
    return schema.templates.all();
  });

  this.del("/template/:slug", (schema, request) => {
    const slug = request.params.slug;
    schema.templates.where({ slug }).destroy();
  });

  this.post("/template/", (schema, request) => {
    const body = request.requestBody;
    let data = {};

    if (body instanceof FormData) {
      for (const [key, value] of body.entries()) {
        data[key] = value;
      }
    } else {
      data = JSON.parse(body);
    }
    data.template = `${data.slug}.docx`;

    const template = schema.templates.create(data);
    return template.attrs;
  });

  this.post("/template/:slug/merge", (schema, request) => {
    const slug = request.params.slug;
    const file = schema.templates.findBy({ slug }).file;
    return new Response(200, { "Content-Type": file.type }, file);
  });
}
