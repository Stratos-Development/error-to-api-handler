class ErrorHandler {
  constructor(url, options = {}) {
    if (!url || typeof url !== "string") {
      throw new Error("A valid URL must be provided.");
    }

    const defaultContentTypes = {
      html: "text/html",
      xml: "application/xml",
      yaml: "application/x-yaml",
      edn: "application/edn",
      "plain-text": "text/plain",
      json: "application/json",
    };

    this.options = {
      method: "POST",
      type: "json",
      callback: null,
      headers: {},
      ...options,
    };

    const contentType =
      this.options.headers["Content-Type"] ||
      defaultContentTypes[this.options.type] ||
      "application/json";

    this.options.headers = {
      "Content-Type": contentType,
      ...this.options.headers,
    };

    this.url = url;

    this.transformers = {
      html: this._sanitize,
      xml: this._sanitize,
      yaml: this._sanitize,
      edn: this._sanitize,
      "plain-text": (err) => String(err),
      json: (err) => JSON.stringify(err),
    };
  }

  Error(error) {
    const transform =
      this.transformers[this.options.type] || this.transformers.json;

    const body = transform(error);

    fetch(this.url, {
      method: this.options.method,
      headers: this.options.headers,
      body,
    })
      .then((response) => {
        if (typeof this.options.callback === "function") {
          this.options.callback(response);
        } else {
          console.log("Response received:", response.status);
        }
      })
      .catch((err) => {
        console.error("Error sending error to API:", err);
      });
  }

  _sanitize(input) {
    if (typeof input === "object") {
      return JSON.stringify(input);
    }
    return String(input).replace(/[<>]/g, (match) => {
      return { "<": "&lt;", ">": "&gt;" }[match];
    });
  }

  static create(url, options) {
    return new ErrorHandler(url, options);
  }
}
