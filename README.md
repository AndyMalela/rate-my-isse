# ISSE Student Portal - React Version

A modern React-based student portal for the Information Systems and Software Engineering (ISSE) course professor reviewing system.

## Features

* **Modern React Architecture**: Built with React 19, React Router, and modern JavaScript
* **Responsive Design**: Mobile-friendly interface with adaptive layouts
* **Red Theme**: Consistent red color scheme throughout the application
* **Professor Rating System**: Multi-dimensional rating system with star ratings
* **Course Management**: Comprehensive course listing and search functionality
* **Google-style Autocomplete**: Real-time search suggestions with highlighted matches
* **User Authentication**: Secure login system with session management

## Pages

1.  **Login Page**: Secure authentication with demo credentials
2.  **Find Professor**: Search and rate professors with autocomplete
3.  **Find Course**: Search courses with detailed information
4.  **Professor Detail**: Professional profile layout with rating system
5.  **Course Detail**: Course information with professor links
6.  **Profile**: Student information and profile management

## Demo Credentials

* **Username**: CHU Mingzuo
* **Password**: 020418

## Installation
### FrontEnd
1.  Navigate to the project directory:
    ```bash
    cd isse-student-portal
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser

### backend
1.  Navigate to the project backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    node server.js
    ```
## Technology Stack

* **React 19**: Modern React with hooks and functional components
* **React Router**: Client-side routing
* **FontAwesome**: Icon library for UI elements
* **CSS3**: Modern styling with gradients and animations
* **Local Storage**: Session management and data persistence

## Project Structure

    Query successful

I can help you fix this file by reformatting it into a valid Markdown file.
Markdown

# ISSE Student Portal - React Version

A modern React-based student portal for the Information Systems and Software Engineering (ISSE) course professor reviewing system.

## Features

* **Modern React Architecture**: Built with React 19, React Router, and modern JavaScript
* **Responsive Design**: Mobile-friendly interface with adaptive layouts
* **Red Theme**: Consistent red color scheme throughout the application
* **Professor Rating System**: Multi-dimensional rating system with star ratings
* **Course Management**: Comprehensive course listing and search functionality
* **Google-style Autocomplete**: Real-time search suggestions with highlighted matches
* **User Authentication**: Secure login system with session management

## Pages

1.  **Login Page**: Secure authentication with demo credentials
2.  **Find Professor**: Search and rate professors with autocomplete
3.  **Find Course**: Search courses with detailed information
4.  **Professor Detail**: Professional profile layout with rating system
5.  **Course Detail**: Course information with professor links
6.  **Profile**: Student information and profile management

## Demo Credentials

* **Username**: CHU Mingzuo
* **Password**: 020418

## Installation

1.  Navigate to the project directory:
    ```bash
    cd isse-student-portal
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

* `npm start`: Runs the app in development mode
* `npm run build`: Builds the app for production
* `npm test`: Launches the test runner
* `npm run eject`: Ejects from Create React App (not recommended)

## Technology Stack

* **React 19**: Modern React with hooks and functional components
* **React Router**: Client-side routing
* **FontAwesome**: Icon library for UI elements
* **CSS3**: Modern styling with gradients and animations
* **Local Storage**: Session management and data persistence

## Project Structure

src/
├── components/
│   ├── pages/
│   │   ├── FindProfessor.js
│   │   ├── FindCourse.js
│   │   ├── ProfessorDetail.js
│   │   ├── CourseDetail.js
│   │   └── Profile.js
│   ├── Login.js
│   ├── Dashboard.js
│   ├── Sidebar.js
│   ├── TopBar.js
│   └── StarRating.js
├── data/
│   ├── professors.json
│   ├── courses.json
│   └── ratings.json
├── App.js
└── App.css

### Authentication

* Secure login with validation
* Session persistence using localStorage
* Automatic redirect based on authentication status

### Professor Rating System

* Multi-dimensional ratings (Overall, Friendliness, Professionalism)
* Star rating component with half-star support
* Real-time rating updates and statistics
* User-specific rating management

### Search Functionality

* Google-style autocomplete for professors and courses
* Highlighted search matches
* Keyboard navigation support
* Real-time search suggestions

### Responsive Design

* Mobile-friendly interface
* Adaptive layouts for different screen sizes
* Touch-friendly interactions

## Browser Support

* Chrome (recommended)
* Firefox
* Safari
* Edge

## Development Notes

* Built with Create React App
* Uses modern React patterns and hooks
* Implements responsive design principles
* Follows accessibility guidelines
* Includes error handling and validation

## Future Enhancements

* Backend integration
* Real-time notifications
* File upload functionality
* Advanced filtering and search
* Dark mode support
* Multi-language support
