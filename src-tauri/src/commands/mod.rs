//! Commands Module
//! 
//! This module serves as the central hub for all Tauri commands used in the application.
//! It exports various submodules that provide different functionalities:
//! 
//! - `file_dialog`: Handles directory selection and validation operations
//! - `postcli`: Manages interactions with the post-processing CLI tool
//! - `cpu`: Provides CPU-related functionality and information
//! - `profiler`: Implements profiling and performance analysis features
//! 
//! Each submodule contains specific Tauri commands that can be invoked from the frontend
//! to perform various system-level operations.

pub mod file_dialog;
pub mod postcli;
pub mod cpu;
pub mod profiler;
pub mod fs;