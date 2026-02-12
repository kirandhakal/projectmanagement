# Kanban Board Application

A simple and intuitive Kanban board application for managing tasks and workflows. This application helps teams visualize their work, limit work-in-progress, and maximize efficiency.

## Features

- Add and delete cards in any column
- Drag-and-drop functionality for moving tasks between columns
- Task counter for each column
- Add new board functionality
- Clean, minimalist interface with a modern design

## To-do

-Add activity -log of task



To see live demo :
```bash
https://kirandhakal.github.io/kanban/
```
## DEMO
  ```bash
https://drive.google.com/file/d/1B50OaijqHUCn4j86IaletkDQZ5Xpg6gc/view?usp=drive_link
```


## Getting Started

### Prerequisites

- Modern web browser
- Node.js (version 12 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kirandhakal/kanban
```

2. Navigate to the project directory:
```bash
cd kanban
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

## Usage

1. **Adding Tasks**
   - Click the "+ Add Card" button in any column
   - Enter task details
   - Press Enter or click Save

2. **Moving Tasks**
   - Drag and drop cards between columns
   - Update task status by moving to appropriate column

3. **Deleting Tasks**
   - Click the menu (...)
   - Select "Delete Card"

4. **Adding New Boards**
   - Click "Add Board" button in the top right
   - Enter board name
   - Press Enter to create

## Project Structure

```
kanban/
├── node_modules/
├── public/  
├── src/
│   ├── Components/
│   │   ├── Board/
│   │   │   ├── Board.css
│   │   │   └── Board.js
│   │   ├── Card/
│   │   │   ├── CardInfo/
│   │   │   ├── Card.css
│   │   │   └── Card.js
│   │   ├── Dropdown/
│   │   │   ├── Dropdown.css
│   │   │   └── Dropdown.js
│   │   ├── Editable/
│   │   │   ├── Editable.css
│   │   │   └── Editable.js
│   │   └── Modal/
│   │       ├── Modal.css
│   │       └── Modal.js
│   ├── App.css
│   ├── App.js
├── package.json
├── package-lock.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Inspired by Agile and Lean methodologies
- Built with React and modern web technologies


shsh
- Special thanks to all contributors
