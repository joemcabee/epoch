# Epoch - Time Tracker

A modern React web application for tracking work time with browser storage. Built with Vite and React.

## Features

- **Week View**: Display time blocks for each day of the week
- **Time Block Management**: Add and remove time blocks with start/end times
- **Daily & Weekly Totals**: See total time worked per day and for the entire week
- **Browser Storage**: Data persists locally using localStorage
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## Getting Started

### Prerequisites

- Node.js (version 20.16.0 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd epoch
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Adding Time Blocks

1. Click the "+ Add Time Block" button on any day
2. Enter the start and end times
3. Optionally add a description
4. Click "Add Time Block" to save

### Navigation

- Use the "Previous" and "Next" buttons to navigate between weeks
- The current day is highlighted with a blue border
- Today's date is automatically detected and highlighted

### Data Storage

- All data is stored locally in your browser's localStorage
- Data persists between browser sessions
- No data is sent to external servers

## Project Structure

```
src/
├── components/
│   ├── TimeTracker.jsx      # Main component
│   ├── TimeBlock.jsx        # Individual time block display
│   ├── TimeBlockForm.jsx    # Form for adding time blocks
│   └── *.css               # Component styles
├── utils/
│   ├── storage.js          # Browser storage utilities
│   └── dateUtils.js        # Date and time calculations
├── App.jsx                 # Root component
└── main.jsx               # Entry point
```

## Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool and development server
- **CSS3**: Styling with modern features
- **localStorage**: Browser storage for data persistence

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style

The project uses ESLint for code quality. Run `npm run lint` to check for issues.

## License

This project is open source and available under the MIT License.
