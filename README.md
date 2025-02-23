# Dify Batch Files Uploader

## Project Overview

This is a tool for uploading files to different LLM (Large Language Model) services. This project integrates with multiple LLM services, allowing users to send files to specified LLM services for processing through simple commands.

## Features

- Send files to Dify service
- Send files to AnytyingLLM services
- Provide utility tools for file processing

## Environment Setup and Dependency Installation

### Environment Setup

1. Ensure Node.js is installed
2. Ensure npm (Node Package Manager) is installed
3. Configure your `config.json` file (see Configuration section below)

### Configuration

The `config.json` file contains all necessary configurations for the services. Here's a detailed explanation of each configuration option:

```json
{
  "folderPath": "<Your Folder Path for files to be processed>",
  "dify": {
    "enabled": false,
    "apiUrl": "<Your Dify API URL>",
    "apiKey": "<Your API Key>",
    "datasetId": "<Your Dataset ID>",
    "supportedExtensions": [".txt", ".md", ".pdf"]
  },
  "anythingLLM": {
    "enabled": false,
    "apiUrl": "<Your AnythingLLM API URL>",
    "apiKey": "<Your API Key>",
    "fileTypes": {
      "text/plain": [".txt", ".md"],
      "application/pdf": [".pdf"]
    }
  }
}
```

#### General Configuration
- `folderPath`: The directory path containing the files you want to process

#### Dify Configuration
- `enabled`: Set to `true` to enable Dify service
- `apiUrl`: Your Dify service API endpoint
- `apiKey`: Your Dify API authentication key
- `datasetId`: The ID of your Dify dataset
- `supportedExtensions`: List of file extensions that can be processed

#### AnythingLLM Configuration
- `enabled`: Set to `true` to enable AnythingLLM service
- `apiUrl`: Your AnythingLLM service API endpoint
- `apiKey`: Your AnythingLLM API authentication key
- `fileTypes`: Mapping of MIME types to supported file extensions

### Dependencies

The project uses the following main dependencies:
- axios: ^1.6.2
- form-data: ^4.0.0

Development dependencies:
- TypeScript: ^5.3.3
- Jest (for testing): ^29.7.0
- ts-node: ^10.9.2

### Installation

Run the following command in the project root directory to install all dependencies:
```bash
npm install
```

## Project Running Guide

### Available Scripts

- Build the project:
```bash
npm run build
```

- Start the project (builds first):
```bash
npm run start
```

- Run in development mode:
```bash
npm run dev
```

## License Information

This project is licensed under the MIT License. For more details, please refer to the LICENSE file.
