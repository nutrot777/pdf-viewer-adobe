# React Document Viewer Modal

This project is a React + Vite-based document viewer modal supporting PDF (with selectable text), DOCX, and PPTX files. It features a modern modal UI, per-resource note-taking, and an 'Ask AI' feature. PDF viewing uses react-pdf for robust, selectable, and well-aligned text.

## Features
- View PDFs, DOCX, and PPTX files in a modal
- Selectable text for PDFs (via react-pdf)
- Per-resource note-taking (localStorage)
- 'Ask AI' modal for highlighted text
- Modern, accessible modal UI

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```
3. Open your browser to the local server URL (usually http://localhost:5173)

## Next Steps
- Migrate modal and document logic from the previous JS/HTML/CSS codebase into React components.
- Add react-pdf and other required packages.
- Implement DOCX and PPTX support.
- Polish UI and add note-taking/AI features.
