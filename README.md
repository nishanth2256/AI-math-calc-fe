#  AI Canvas Math Solver

AI Handwritten Math Solver

An interactive web application that allows users to draw mathematical expressions on a canvas, sends the drawing to a backend for processing, and renders the result as properly formatted LaTeX equations. The system also supports variable assignments, draggable result cards, and dynamic equation rendering.

#  🚀 Features
Core Features


-Draw mathematical expressions on a canvas
-Erase and color drawing tools
-Send canvas image to backend for expression recognition
-Render results using LaTeX
-Draggable result cards
-Variable assignment support (e.g., x = 5, y = x + 2)
-Automatic equation positioning based on drawing location
-Multiple results rendered sequentially
-Reset canvas and variables
-Dark UI for better writing experience

Math Rendering Features


-Integrals
-Derivatives
-Fractions
-Powers (x², x³)
-Square roots
-Pi and mathematical symbols
-Multiplication dot formatting
-LaTeX formatted output

#  🏗️ Project Architecture

-User Draws Equation
        ↓
-Canvas Image Captured
        ↓
-Image Sent to Backend API
        ↓
-Backend Processes Image / Expression
        ↓
-Backend Returns Expression + Result
        ↓
-Frontend Converts to LaTeX
        ↓
-MathJax Renders Equation
        ↓
-Draggable Result Displayed



# ⚙️ Installation & Setup
1. Clone Repository
-git clone https://github.com/yourusername/AI-math-calc-fe.git
-cd AI-math-calc-fe
2. Install Frontend Dependencies
-npm install
3. Run Frontend
-npm run dev
