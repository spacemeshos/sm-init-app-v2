# Development Guide

This document provides technical details and implementation notes for developers working on the Spacemesh Init App v2.

## Architecture

The application is built using:

- Tauri (Rust backend)
- React (TypeScript frontend)
- Styled Components for styling
- React Router for navigation
- Context API for state management

## Project Structure

```bash
sm-init-app-v2/
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── services/         # Service layer (API calls, postcli interaction)
│   ├── state/           # Context providers and state management
│   ├── styles/          # Global styles and theme
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript type definitions
├── src-tauri/            # Rust backend code
│   ├── src/             # Rust source code
│   └── bin/             # Binary files location
└── public/              # Static assets
```

## Known Implementation Details

### External Links

Several external links are pending updates (marked as TODO):

- Terms of Service link
- Disclaimer link
- Privacy Policy link

These links currently point to testnet URLs and need to be updated with production URLs.

### Important External Resources

The application relies on several external resources:

- User Guide: <https://github.com/spacemeshos/wiki/wiki/Smesher-Guide>
- Requirements Documentation: <https://docs.spacemesh.io/docs/start/smeshing/requirements>
- Main Documentation: <https://docs.spacemesh.io/docs/start>
- Issue Reporting: <https://github.com/spacemeshos/sm-init-app-v2/issues/new>
- Community Discord: <https://discord.com/invite/yVhQ7rC>

### Installation Guides

Platform-specific installation guides for dependencies:

- Windows Visual C++ Redistributable: <https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist>
- Windows OpenCL Installation: <https://sasview.org/docs/old_docs/4.1.2/user/opencl_installation.html>
- Ubuntu OpenCL Installation: <https://saturncloud.io/blog/how-to-install-cudaopencl-on-ubuntu-installed-on-a-usb-drive/>

### Hardcoded Values

1. **Initialization**
   - In the src/utils/postcliUtils.tsx file there are values that should be updated according to the latest indications from devs: 
     - Temporary flag for quicker testing:   
       - args.push("-labelsPerUnit=4096");
       - args.push("-yes");
     - To be implemented: let user choose whether or not to run genproof after init (recommended)
       - args.push("-genproof");
   - In the src/utils/sizeUtils.tsx:
     - Convert total size to MiB (numUnits * 64 GiB * 1024 MiB/GiB)
     - Currently: const totalSizeInMiB = numUnits * 0.00006103515625 * 1024; //TESTING PURPOSES TO BE REVERTED TO 64

2. **ATX ID**: * Update: it's implemented, please check.
   - Mock ATX ID used for testing: "65f77244a23870ee39f15cf088ee1651745c3b73195491e277bc65aa56937425"
   - API endpoint for fetching latest ATX ID not implemented yet
   - TODO: Implement actual API call to fetch ATX ID

3. **Validation Rules**:
   - Minimum number of units hardcoded to 4
   - Default max file size: 4096 MiB
   - Provider selection required
   - Public key must be valid hex if provided

### Unimplemented Features

1. **Split in Subsets**:
   - Feature placeholder exists in UI
   - Implementation pending
   - Required for handling large datasets

2. **ATX API Integration**:
   - Currently using mock data
   - Need to implement actual API call when endpoint is available
   - Endpoint will be: <https://mainnet-api.spacemesh.network/spacemesh.v2alpha1.ActivationService/Highest>

### Test-Specific Code

1. **Mock Data**:
   - ATX ID response in postcliService.tsx
   - Test-specific validation rules

2. **Console Output**:
   - Extensive console.log statements for debugging
   - Can be removed/modified for production

## State Management

The application uses React Context for state management with three main contexts:

1. **ConsoleContext**: Manages console output and commands
2. **POSProcessContext**: Handles POS generation process state
3. **SettingsContext**: Manages application settings and configuration

## Backend Integration

### PostCLI Service

The postcliService.tsx file handles interaction with the postcli binary through Tauri commands:

1. **Commands**:
   - run_postcli_command: Synchronous execution
   - run_postcli_detached: Asynchronous execution
   - stop_postcli_process: Process termination

2. **Event Handling**:
   - Uses Tauri events for progress updates
   - Implements custom event dispatching for UI updates

## Future Improvements

1. **API Integration**:
   - Implement actual ATX ID fetching
   - Add error handling for API failures
   - Consider caching mechanisms

2. **Feature Completion**:
   - Implement subset splitting functionality
   - Add validation for subset configurations
   - Complete progress tracking features

3. **Testing**:
   - Add end-to-end tests
   - Implement integration tests for postcli interaction
   - Add more unit tests for utility functions

4. **Performance**:
   - Optimize large file handling
   - Improve progress calculation accuracy
   - Add resource usage monitoring

5. **Security**:
   - Implement proper key management
   - Add checksum verification for generated files
   - Improve error handling for security-related operations

6. **Documentation**:
   - Update external links when production URLs are available
   - Complete API documentation
   - Add troubleshooting guides

## Development Guidelines

1. **Code Style**:
   - Follow existing TypeScript/React patterns
   - Use functional components with hooks
   - Maintain consistent styling with styled-components

2. **Testing**:
   - Write tests for new features
   - Update existing tests when modifying functionality
   - Use jest and React Testing Library

3. **Documentation**:
   - Document new features and changes
   - Update this guide for significant changes
   - Include inline documentation for complex logic

4. **Error Handling**:
   - Implement proper error boundaries
   - Log errors appropriately
   - Provide user-friendly error messages

## Building and Testing

### Development Build

```bash
yarn dev
```

### Production Build

```bash
yarn build
```

### Running Tests

```bash
yarn test
```

### Linting

```bash
yarn lint
```

## Troubleshooting

Common issues and solutions:

1. **Binary Missing**:
   - Ensure all required binaries are in src-tauri/bin/
   - Check file permissions
   - Verify binary compatibility with OS

2. **Build Errors**:
   - Check Rust toolchain version
   - Verify Node.js version
   - Ensure all dependencies are installed

3. **Runtime Errors**:
   - Check console for error messages
   - Verify postcli binary execution permissions
   - Confirm sufficient system resources

4. **OpenCL Issues**:
   - Follow platform-specific OpenCL installation guides
   - Verify GPU compatibility
   - Check driver installations
  
5. **Release**:
   - libwebkit2gtk-4.0-dev with Tauri issues to be investigated further, I did not have enough time to resolve it, so I decided to exclude the Linux platforms from releases for now

## Roadmap (OLD NOTES, incomplete)

### Home miners

- Need a fancy gui app that will explain the process etc
- Mainly 1 GPU 1-n drives scenario
- #Init / resume /grow/shrink for "local" machine only
- Some fancy progress etc
- "As easy as possible" (easier than #Smapp with deps)
  
### Init

Explain the process in detail - infographic/animation? +docs, tooltips and clear steps

### Select Directory

- [x] select dir (handle errors - not enough space, dir not available, no permissions, no dir selected, the same dir selected)
- [x] save and show in summary
- [ ] check the available space
- [ ] check disk IO speed
- [ ] info on why choosing a good location is crucial

### Data Size

pos data

- [x] space units calculations vs what's shown
- [x] input to choose the amount of space by steps (SU)
- [x] save and keep in a variable for summary and other components
- [ ] Verify dynamically if not surpassing max suggested value
- [x] do not allow less that minimum
- [ ] round up to the full space units when input manual
- [x] dynamically modify the units (GiB/TiB/PiB)
- [ ] calculate rewards amount example?

### Max file size

- [x] max file size default setup
- [x] input to choose the amount of space by steps (in MiB)
- [ ] warn about the FS limitations
- [ ] explanation and info that it's safe to leave default
- [x] calculate the number of files that will be generated

### Find Provider

- [x] find processors (only local machine)
- [x] display all the processors details
- [x] select automatically the fastest
- [x] allow selecting other
- [x] save the choice as the int accordindly
- [ ] show calculated speed
- [ ] show calulated total time of pos generation (with * that it only counts the perfect conditions)
