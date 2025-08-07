# YouTube Playlist Generator MCP Server

A Model Context Protocol (MCP) server that enables AI applications to search for YouTube music videos and manage playlists using the official YouTube Data API v3.

## Features

- **Search Music Videos**: Find music videos on YouTube with customizable search parameters
- **Get Video Details**: Retrieve comprehensive information about specific videos
- **Get Playlist Items**: List videos from public playlists
- **Playlist Management**: Basic framework for creating and managing playlists (requires OAuth setup)

## Setup

### Prerequisites

- Node.js 18 or higher
- A Google Cloud Project with YouTube Data API v3 enabled
- YouTube Data API key

### Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd yt-playlist-generator
```

2. Install dependencies:
```bash
npm install
```

3. Get a YouTube Data API key:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the YouTube Data API v3
   - Create credentials (API key)
   - Copy the API key

4. Set up environment variables:
```bash
# Create a .env file
echo "YOUTUBE_API_KEY=your_api_key_here" > .env
```

5. Build the TypeScript code:
```bash
npm run build
```

### Running the Server

For development with auto-rebuild:
```bash
npm run dev
```

For production:
```bash
npm start
```

### Using with MCP Clients

This server uses the stdio transport, so it can be used with any MCP client that supports stdio.

#### Claude Desktop Configuration

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "youtube-playlist-generator": {
      "command": "node",
      "args": ["/absolute/path/to/yt-playlist-generator/build/index.js"],
      "env": {
        "YOUTUBE_API_KEY": "your_youtube_api_key_here"
      }
    }
  }
}
```

## Available Tools

### search_music_videos
Search YouTube for music videos with specified criteria.

**Parameters:**
- `query` (string): Search query for music videos
- `maxResults` (number, 1-50, default: 10): Maximum number of results
- `order` (enum): Sort order - "relevance", "date", "rating", "viewCount", "title"

### get_video_details
Get detailed information about a specific YouTube video.

**Parameters:**
- `videoId` (string): YouTube video ID

### get_playlist_items
Retrieve videos from a public YouTube playlist.

**Parameters:**
- `playlistId` (string): YouTube playlist ID
- `maxResults` (number, 1-50, default: 25): Maximum number of items

### create_playlist
Create a new YouTube playlist (requires OAuth authentication).

**Parameters:**
- `title` (string): Playlist title
- `description` (string, optional): Playlist description
- `privacy` (enum): "private", "public", or "unlisted"

### add_to_playlist
Add a video to an existing playlist (requires OAuth authentication).

**Parameters:**
- `playlistId` (string): Target playlist ID
- `videoId` (string): Video ID to add

### list_playlists
List user's playlists (requires OAuth authentication).

**Parameters:**
- `maxResults` (number, 1-50, default: 25): Maximum number of playlists

## OAuth Authentication Setup (Optional)

For full playlist management capabilities (creating playlists, adding videos), you'll need to set up OAuth 2.0:

1. In Google Cloud Console, create OAuth 2.0 credentials
2. Download the credentials JSON file
3. Implement the OAuth flow in the server code
4. Handle token refresh and storage

Currently, the server provides guidance for manual playlist management when OAuth is not configured.

## API Limitations

- **API Key Only**: Current implementation uses API key authentication, which limits functionality to read-only operations
- **Quota Limits**: YouTube API has daily quota limits
- **Public Content**: Can only access public playlists and videos
- **Rate Limiting**: API calls are subject to rate limiting

## Development

### Building
```bash
npm run build
```

### Development Mode
```bash
npm run dev
```

### Project Structure
```
src/
├── index.ts          # Main server implementation
├── types/            # TypeScript type definitions
└── utils/            # Utility functions

build/                # Compiled JavaScript output
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Troubleshooting

### Common Issues

1. **"YOUTUBE_API_KEY environment variable is required"**
   - Make sure you've set the YOUTUBE_API_KEY environment variable
   - Verify the API key is valid and has YouTube Data API access

2. **"Quota exceeded" errors**
   - You've hit the daily API quota limit
   - Wait for quota reset or request quota increase

3. **"Playlist not found" errors**
   - Ensure the playlist ID is correct
   - Verify the playlist is public (private playlists require OAuth)

4. **Build errors**
   - Make sure you have Node.js 18+ installed
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript compilation with `npm run build`

## Security Considerations

- Never commit API keys to version control
- Use environment variables for sensitive configuration
- Consider implementing proper OAuth 2.0 for production use
- Validate all user inputs
- Implement proper error handling and logging
