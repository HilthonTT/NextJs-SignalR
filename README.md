# NextJs-SignalR

## Getting Started

This repository contains a Next.js application and an ASP.NET Core Web API project that demonstrate the use of SignalR for real-time communication.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (which includes npm)
- [.NET SDK](https://dotnet.microsoft.com/download)

### Setting Up the Next.js Application

1. Clone the repository:

    ```bash
    git clone https://github.com/your-repo/NextJs-SignalR.git
    cd NextJs-SignalR
    ```

2. Navigate to the Next.js application directory:

    ```bash
    cd nextjs-app
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

    Your Next.js app should now be running on `http://localhost:3000`.

### Setting Up the ASP.NET Core Web API

1. Navigate to the ASP.NET Core Web API project directory:

    ```bash
    cd ../aspnetcore-api
    ```

2. Restore the .NET dependencies:

    ```bash
    dotnet restore
    ```

3. Run the ASP.NET Core Web API:

    ```bash
    dotnet run
    ```

    Your ASP.NET Core Web API should now be running on `http://localhost:7186`.

### Running Both Projects

Ensure both projects are running concurrently to enable real-time communication via SignalR.

1. Open two terminal windows.
2. In the first terminal, navigate to the Next.js app directory and run `npm run dev`.
3. In the second terminal, navigate to the ASP.NET Core Web API directory and run `dotnet run`.

Your development environment is now set up with a Next.js front-end and an ASP.NET Core back-end using SignalR for real-time communication.
