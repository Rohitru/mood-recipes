# Mood-Based Recipe Recommendation App

A simple web application that recommends recipes based on your current mood. Select how you're feeling, and we'll suggest a recipe that matches your mood!

## Features

- Select from different mood options
- Get recipe recommendations based on your mood
- Request new recipes if you don't like the current suggestion
- Simple and intuitive interface

## Technologies Used

- **Backend**: Express.js with SQLite database
- **Frontend**: HTML, CSS with Tailwind CSS, and vanilla JavaScript

## Setup and Running

### Prerequisites

- Node.js installed on your computer

### Installation

1. Clone this repository or download the files
2. Open a terminal and navigate to the project folder
3. Install dependencies:

```
npm install
```

### Running the App

1. Build the CSS:

```
npx tailwindcss -i ./src/styles.css -o ./public/styles.css
```

2. Start the server:

```
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

### Development Mode

For development, you can run:

```
npm run build:css
```

In one terminal to watch for CSS changes, and:

```
npm run dev
```

In another terminal to run the server with auto-restart on file changes.

## License

MIT 