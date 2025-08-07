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

### Read-Only Tools (API Key Authentication)

#### search_music_videos
Search YouTube for music videos with specified criteria.

**Parameters:**
- `query` (string): Search query for music videos
- `maxResults` (number, 1-50, default: 10): Maximum number of results
- `order` (enum): Sort order - "relevance", "date", "rating", "viewCount", "title"

#### get_video_details
Get detailed information about a specific YouTube video.

**Parameters:**
- `videoId` (string): YouTube video ID

#### get_playlist_items
Retrieve videos from a public YouTube playlist.

**Parameters:**
- `playlistId` (string): YouTube playlist ID
- `maxResults` (number, 1-50, default: 25): Maximum number of items

### OAuth-Required Tools (Playlist Management)

#### authenticate_youtube
Authenticate with YouTube OAuth to enable playlist management features.

**Parameters:**
- `getAuthUrl` (boolean, default: false): Set to true to get the authorization URL
- `authCode` (string, optional): Authorization code from OAuth flow

#### get_auth_status
Check current OAuth authentication status.

**Parameters:** None

#### create_playlist
Create a new YouTube playlist (requires OAuth authentication).

**Parameters:**
- `title` (string): Playlist title
- `description` (string, optional): Playlist description
- `privacy` (enum): "private", "public", or "unlisted"

#### add_to_playlist
Add a video to an existing playlist (requires OAuth authentication).

**Parameters:**
- `playlistId` (string): Target playlist ID
- `videoId` (string): Video ID to add

#### list_playlists
List user's playlists (requires OAuth authentication).

**Parameters:**
- `maxResults` (number, 1-50, default: 25): Maximum number of playlists
- `mine` (boolean, default: true): List authenticated user's playlists

#### remove_from_playlist
Remove a video from a playlist (requires OAuth authentication).

**Parameters:**
- `playlistItemId` (string): ID of the playlist item to remove (get from get_playlist_items)

## OAuth Authentication Setup

For full playlist management capabilities, you need to set up OAuth 2.0:

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the YouTube Data API v3
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Desktop Application" as application type
6. Download the credentials or copy the Client ID and Client Secret

### 2. Environment Configuration

Add your OAuth credentials to the `.env` file:

```bash
YOUTUBE_CLIENT_ID=your_client_id_here
YOUTUBE_CLIENT_SECRET=your_client_secret_here
```

### 3. Authentication Flow

1. Use the `authenticate_youtube` tool with `getAuthUrl: true`
2. Open the provided URL in your browser
3. Sign in to your Google account and grant permissions
4. Copy the authorization code
5. Use `authenticate_youtube` tool again with the `authCode` parameter

### 4. Using Authenticated Features

Once authenticated, you can:
- Create new playlists
- Add videos to your playlists
- List your private playlists
- Remove videos from playlists

## API Limitations

- **Quota Limits**: YouTube API has daily quota limits (10,000 units/day by default)
- **Rate Limiting**: API calls are subject to rate limiting
- **OAuth Tokens**: Access tokens expire and need refresh (handled automatically)
- **Permissions**: OAuth scope determines available operations

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

---

*This project was created using GitHub Copilot*
