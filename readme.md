
# 🪐 CrossMint MegaVerse Assignment

Hey there! Welcome to the **Megaverse Entity Creation Project** 🚀! This project is all about automating the creation of a cool pattern of celestial entities (Polyanet, Soloon, and Cometh) based on a given "goal map". The goal is to build it without manually calling APIs over and over. 😎

## 🌌 Project Overview

So, what's this all about? The Megaverse is a unique space with different entities placed in a grid pattern. Your mission is to automate their creation based on a **goal map** fetched dynamically from an API. Each of these entities has its own set of attributes like type, color, or direction, and they define how it looks in the Megaverse. Pretty cool, right?

### Key Entities
1. **Polyanet**: The main celestial body in the Megaverse.
2. **Soloon**: Little celestial dots that come in different colors (`red`, `blue`, `white`, or `purple`).
3. **Cometh**: Space travelers moving in a specific direction (`up`, `down`, `left`, or `right`).

## 🛠️ Project Structure

This project is split into several components, each doing its own thing. Here’s the main breakdown:

### 1. `MegaverseBuilder`
This guy's responsible for building the Megaverse by going through the goal map and creating the entities.

### 2. `Entity` Classes
- **Polyanet**
- **Soloon**
- **Cometh**

Each of these classes represents a unique entity in the Megaverse. They handle how to create each type and keep the code clean and organized.

### 3. `MegaverseAPIClient`
This one handles all the API stuff, like fetching the goal map and making requests to create entities. It also deals with rate limiting (so we don’t spam the server).

### 4. `RequestQueue`
It’s a queue for all the API requests. Makes sure we don’t hit the server too fast and adjusts based on server responses.

### 5. `Logger`
Keeps track of everything happening in the app and logs it in style with some fancy colors!

## 🚀 Getting Started

Follow these steps to set up and run the project on your machine.

### Prerequisites

You need the following installed:

- [Node.js](https://nodejs.org/) (v14+)
- [npm](https://www.npmjs.com/) (v6+)

### Setup & Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-repo/megaverse-entity-creator.git
   ```

2. **Go to the project directory:**

   ```bash
   cd megaverse-entity-creator
   ```

3. **Install the dependencies:**

   ```bash
   npm install
   ```

4. **Create a `.env` file in the root directory with these values:**

   ```bash
   BASE_URL=<Your API Base URL>
   CANDIDATE_ID=<Your Candidate ID>
   ```

   Replace `<Your API Base URL>` and `<Your Candidate ID>` with your own values.

### Running the App

1. **Run the app:**

   ```bash
   npm run dev
   ```

   This command starts the project using `nodemon` and builds the Megaverse based on the goal map.

### Output Example

When the app runs successfully, you’ll see something like this in your console:

```
[2024-10-10T02:50:30.140Z] [INFO] 🪐 Polyanet created at row 13, column 13
[2024-10-10T02:50:30.341Z] [INFO] 🪐 Soloon created at row 14, column 10 with color: red
[2024-10-10T02:50:30.561Z] [INFO] ☄️ Cometh created at row 14, column 11 moving: up
```

### Testing

To run the test suite and check your implementation:

```bash
npm test
```

This will run unit tests for the core components like `MegaverseBuilder`, `RequestQueue`, and `APIClient`.

## 💡 Design Thoughts

1. **Modular Structure**: Each module does its own thing, making it easy to add new stuff.
2. **Scalability**: The design lets you easily add new entity types with minimal changes.
3. **Dynamic Rate Limiting**: Adjusts the API call speed based on server feedback.
4. **Object-Oriented Approach**: Each entity type has its own class, making the design clean and easy to maintain.

## 🎨 Logger with Enhanced Colors

All logs are color-coded for easy reading:

- **Info**: Shows up in green.
- **Warn**: Pops up in yellow.
- **Error**: You guessed it, it’s red.
- **Success**: Cool green for when things go well.

## 📂 Project File Structure

```
src
├── apiClient.ts           # API client for interacting with the Megaverse API
├── index.ts               # Entry point for the project
├── entities.ts            # Contains all entity classes
├── megaverseBuilder.ts    # Main builder class for creating the Megaverse
├── utils
│   ├── logger.ts          # Enhanced logger utility
│   └── RequestQueue.ts    # Request queue manager with dynamic rate limiting
```
