# ErrorHandler

A simple JavaScript utility to capture errors and send them to a specified URL with flexible content type support. 

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Transformers](#transformers)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Ease of Use**: Minimal setup required—just provide a valid URL and call the `Error()` method to send the error payload.
- **Flexible Payload Type**: Supports various content types (JSON, HTML, XML, YAML, EDN, or plain text). 
- **Custom Transformers**: Automatically sanitizes or transforms payloads for non-JSON types.
- **Custom Callbacks**: Receive the `fetch` response in a callback for further handling.

---

## Installation

You can include the `ErrorHandler` class in your project by copying the file directly or installing via a package manager (after publishing to NPM, for example).

### Direct Usage

1. Copy the `ErrorHandler.js` file (or whichever name you choose) into your project.
2. Import or require it in your JavaScript code.

```js
// Using ES6 import
import ErrorHandler from './ErrorHandler.js';
```

```js
// Using CommonJS require
const ErrorHandler = require('./ErrorHandler.js');
```

---

## Usage

1. **Initialize**: Create a new `ErrorHandler` instance with a URL and optional settings.
2. **Report Errors**: Pass your error to the `Error(error)` method.

### Example

```js
import ErrorHandler from './ErrorHandler.js';

// Create an instance of ErrorHandler
const handler = ErrorHandler.create('https://your-logging-endpoint.com/api/logs', {
  method: 'POST',
  type: 'json',
  headers: {
    'Authorization': 'Bearer your-token'
  },
  callback: (response) => {
    console.log('Custom callback:', response.status);
  }
});

// Use it when an error occurs
try {
  // Some operation that may throw
  throw new Error('Something went wrong!');
} catch (err) {
  handler.Error(err);
}
```

---

## Options

When creating an instance with `ErrorHandler.create(url, options)`, you can pass an `options` object with the following properties:

| Option     | Type     | Default            | Description                                                                           |
|------------|----------|--------------------|---------------------------------------------------------------------------------------|
| `method`   | String   | `"POST"`           | The HTTP method to be used when sending the error data.                               |
| `type`     | String   | `"json"`           | Determines the content type and internal transformer. Available: `html`, `xml`, `yaml`, `edn`, `plain-text`, `json`. |
| `callback` | Function | `null`             | A function called with the `fetch` response object once the request completes.        |
| `headers`  | Object   | `{}`               | Additional headers to be sent along with the request.                                 |

**Example Usage with Custom Options:**

```js
const customOptions = {
  method: 'PUT',
  type: 'yaml',
  headers: {
    'Custom-Header': 'xyz'
  },
  callback: (response) => {
    if (response.ok) {
      console.log('Error logged successfully!');
    } else {
      console.error('Failed to log error:', response.status);
    }
  }
};

const handler = ErrorHandler.create('https://example.com/errors', customOptions);
handler.Error(new Error('Critical error occurred!'));
```

---

## Transformers

By default, the library provides built-in transformers based on the `type` you specify:

- **json**: `JSON.stringify(err)`
- **html**: Sanitizes special characters `<` and `>`
- **xml**: Same sanitization as HTML
- **yaml**: Sanitizes special characters `<` and `>`
- **edn**: Sanitizes special characters `<` and `>`
- **plain-text**: Converts error to string

All non-JSON transformers eventually sanitize the content by replacing `<` and `>` with HTML entities. You can see the `_sanitize` method for details.

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Create a new Pull Request.

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](../../issues).

---

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute this project as you wish.

---
