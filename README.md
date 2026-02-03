# Beats Website

A modern, minimalist website for showcasing and selling beats.

## How to Add/Change MP3 Files

### Easy Steps:

1. **Place your MP3 file** in the `beats` folder
   - Example: `beats/woo1.mp3`

2. **Update `beats-data.js`** to add or modify beats:
   ```javascript
   const beatsData = [
       {
           id: 1,
           name: "woo1",
           audioFile: "beats/woo1.mp3"
       },
       {
           id: 2,
           name: "your-beat-name",
           audioFile: "beats/your-file.mp3"
       }
   ];
   ```

3. **That's it!** The website will automatically display your beats.

## File Structure

```
/
├── index.html          # Home page
├── beats.html          # Beats catalog page
├── styles.css          # All styling
├── beats-data.js       # Beat data (easy to edit)
├── audio-player.js     # Audio player functionality
├── beats/              # Place MP3 files here
│   └── woo1.mp3
└── README.md           # This file
```

## Features

- Modern, minimalist design
- Smooth hover animations
- Full audio player with progress bar
- Easy MP3 management
- Responsive design
- Production-ready

## Usage

Simply open `index.html` in a web browser to view the site.
