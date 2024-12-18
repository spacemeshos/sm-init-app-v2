# Spacemesh Init App

## Overview

**Spacemesh Init App v2** is a user-friendly application designed to streamline the process of setting up, generating, and managing Proof of Space data\. At its core, it integrates the `postcli` binary, developed in Go by the Spacemesh team, to handle all essential commands and flags seamlessly.

## Table of Contents

- [Installation](#installation)
- [Required Binaries](#required-binaries)
- [Usage](#usage)
- [Contributing](#contributing)

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16.x or later)
- [Rust](https://www.rust-lang.org/tools/install) (version 1.56.0 or later)
- [Yarn](https://classic.yarnpkg.com/en/docs/install) (version 1.22.10 or later)

### Required Binaries

This application requires specific binary files to function properly. These files are not included in the repository and need to be downloaded separately:

1. Download the required binaries from the official Spacemesh releases:
   - post-rs binaries:
     - macOS: libpost.dylib, post-service, profiler
     - Windows: post.dll, post-service.exe, profiler.exe
   - postcli binaries:
     - macOS: libpost.dylib, postcli
     - Windows: post.dll, postcli.exe

2. Place the downloaded files in their respective directories:
   ```
   src-tauri/bin/post-rs/
   src-tauri/bin/postcli/
   ```

You can find the latest versions of these binaries at:
- [Post-rs Releases](https://github.com/spacemeshos/post-rs/releases) for post-rs
- [PostCli Releases](https://github.com/spacemeshos/post/releases) for postcli

### Platform-Specific Notes

#### Windows
- Ensure you download the Windows-specific binaries (*.exe and *.dll files)
- The application expects postcli.exe to be in the bin/postcli directory
- Make sure you have the required Visual C++ Redistributable packages installed

#### macOS
- Ensure you download the macOS-specific binaries (*.dylib files)
- The application expects postcli to be in the bin/postcli directory
- Make sure the binary files have execute permissions (`chmod +x`)

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

1. Fork the repository
2. Create a new branch (git checkout -b feature-branch)
3. Make your changes
4. Run tests locally to ensure everything passes
5. Commit your changes (git commit -m 'Add some feature')
6. Push to the branch (git push origin feature-branch)
7. Open a pull request

### Pull Request Process

1. Ensure all tests pass in the PR build
2. Update documentation if needed
3. Follow the existing code style and conventions
4. Add tests for new functionality
5. Make sure your PR description clearly describes the changes

Please adhere to the Code of Conduct when contributing.

## Contact

For more information, visit [Spacemesh](https://spacemesh.io/) or contact us at [info@spacemesh.io]().
