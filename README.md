# Spacemesh Init App v2

## Overview

**Spacemesh Init App v2** is a user-friendly application designed to streamline the process of setting up, generating, and managing Proof of Space data\. By leveraging the Tauri framework for its frontend, this app offers a sleek and efficient user experience. At its core, it integrates the `postcli` binary, developed in Go by the Spacemesh team, to handle all essential commands and flags seamlessly. Whether you are a novice or an experienced user, Spacemesh Init App v2 simplifies the complexities of Proof of Space management, making it accessible and straightforward.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16.x or later)
- [Rust](https://www.rust-lang.org/tools/install) (version 1.56.0 or later)
- [Yarn](https://classic.yarnpkg.com/en/docs/install) (version 1.22.10 or later)

### Clone the Repository

```sh
git clone https://github.com/spacemeshos/sm-init-app-v2.git
cd sm-init-app-v2
```

### Install Dependencies

```sh
yarn install
```

## Usage

### Running the Application

To start the application in development mode, run:

```sh
yarn dev
```

This command will start the Tauri development environment and the React development server.

### Building the Application

To build the application for production, run:

```sh
yarn build
```

### Running Tests

To run the tests, use:

```sh
yarn test
```

## Contributing

We welcome contributions to the Spacemesh Init App v2! To contribute:

1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Make your changes.
4. Commit your changes (git commit -m 'Add some feature').
5. Push to the branch (git push origin feature-branch).
6. Open a pull request.
7. Please adhere to the Code of Conduct.

## Contact

For more information, visit [Spacemesh](https://spacemesh.io/) or contact us at [info@spacemesh.io]().
