# 🧠 AI Handwritten Math Solver with Canvas Rendering and Variable Memory

An interactive web application that allows users to draw mathematical expressions on a canvas, send the drawing to a backend for processing, and render the result as properly formatted LaTeX equations. The system also supports variable assignments, draggable result cards, and dynamic equation rendering.

# 🚀 Features

## Core Features
- Draw mathematical expressions on a canvas
- Erase and color drawing tools
- Send canvas image to backend for expression recognition
- Render results using LaTeX
- Draggable result cards
- Variable memory system
- Variable assignment support (e.g., x = 5, y = x + 2)
- Automatic equation positioning based on drawing location
- Multiple results rendered sequentially
- Reset canvas and variables
- Dark UI for better writing experience

## Math Rendering Features
- Integrals
- Derivatives
- Fractions
- Powers (x², x³)
- Square roots
- Pi and mathematical symbols
- Multiplication dot formatting
- LaTeX formatted output

# 🏗️ Project Architecture

## Workflow
User Draws Equation  
↓  
Canvas Image Captured  
↓  
Image Sent to Backend API  
↓  
Backend Processes Image / Expression  
↓  
Backend Returns Expression + Result  
↓  
Frontend Converts to LaTeX  
↓  
MathJax Renders Equation  
↓  
Draggable Result Displayed  


# 🖥️ Tech Stack

## Frontend
- React
- TypeScript
- Tailwind CSS
- Canvas API
- MathJax (LaTeX rendering)
- Axios
- React Draggable
- Mantine UI Components




# ⚙️ Installation & Setup

## 1. Clone Repository

```bash
  git clone https://github.com/yourusername/AI-math-calc-fe.git  
  cd ai-math-canvas 
```

## 2. Install Frontend Dependencies

```bash
  npm install 
```

## 3. Run Frontend

```bash
  npm run dev
```


# Screenshots

![App Screenshot](https://github.com/nishanth2256/AI-math-calc-fe/blob/main/Screenshot%202026-03-25%20114943.png?raw=true)


![App Screenshot](https://github.com/nishanth2256/AI-math-calc-fe/blob/main/Screenshot%202026-03-25%20115126.png?raw=true)
