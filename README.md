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
- Download Windows-specific binaries (*.exe)
- Required Visual C++ Redistributable packages must be installed
- Application expects postcli.exe in the bin/postcli directory

#### macOS
- Download macOS-specific binaries (double check the architecture)
- Application expects postcli in the bin/postcli directory
- Ensure binary files have execute permissions (`chmod +x`)

### Installation Steps

1. Clone the repository:
```sh
git clone https://github.com/spacemeshos/sm-init-app-v2.git
cd sm-init-app-v2
```

2. Install dependencies:
```sh
yarn install
```

## Usage

### Development Mode

```sh
yarn dev
```

### Production Build

```sh
yarn build
```

### Running Tests

```sh
yarn test
```

## Important Notes

1. **Hardware Requirements**:
   - GPU with sufficient memory for PoS data generation
   - Stable power supply
   - Adequate storage space based on configuration

2. **Generation Process**:
   - Generation time varies based on hardware (days to weeks)
   - System should remain powered and stable throughout
   - GPU will operate at full capacity during generation

3. **Post-Generation**:
   - Generated PoS data is required for node setup
   - Data must be accessible to your node
   - Backup recommendations provided in documentation

## Contributing

See [CONTRIBUTING.md](CODE_OF_CONDUCT.md) for contribution guidelines.

## Documentation

- [Development Guide](DEVELOPMENT.md) - Technical details for developers
- [Security Policy](SECURITY.md) - Security considerations and reporting
- [Code of Conduct](CODE_OF_CONDUCT.md) - Community guidelines

## Contact

For more information:
- Website: [Spacemesh](https://spacemesh.io/)
- Email: [info@spacemesh.io](mailto:info@spacemesh.io)
