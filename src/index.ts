import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { google, youtube_v3 } from 'googleapis';
import { z } from 'zod';

const API_KEY = process.env.YOUTUBE_API_KEY;

if (!API_KEY) {
  console.error('YOUTUBE_API_KEY environment variable is required');
  process.exit(1);
}

// Initialize YouTube API client
const youtube = google.youtube({
  version: 'v3',
  auth: API_KEY,
});

// Create MCP server
const server = new McpServer({
  name: 'youtube-playlist-generator',
  version: '1.0.0',
});

// Tool: Search for music videos
server.tool(
  'search_music_videos',
  'Search YouTube for music videos',
  {
    query: z.string().describe('Search query for music videos'),
    maxResults: z
      .number()
      .min(1)
      .max(50)
      .default(10)
      .describe('Maximum number of results to return'),
    order: z
      .enum(['relevance', 'date', 'rating', 'viewCount', 'title'])
      .default('relevance')
      .describe('Order to sort results'),
  },
  async ({ query, maxResults, order }) => {
    try {
      const response = await youtube.search.list({
        part: ['snippet'],
        q: `${query} music video`,
        type: ['video'],
        videoCategoryId: '10', // Music category
        maxResults,
        order,
        videoEmbeddable: 'true',
        safeSearch: 'none',
      });

      const videos =
        response.data.items?.map((item) => ({
          videoId: item.id?.videoId,
          title: item.snippet?.title,
          description: item.snippet?.description,
          channelTitle: item.snippet?.channelTitle,
          publishedAt: item.snippet?.publishedAt,
          thumbnails: item.snippet?.thumbnails,
          url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
        })) || [];

      return {
        content: [
          {
            type: 'text',
            text: `Found ${videos.length} music videos for "${query}":\n\n${videos
              .map(
                (video, index) =>
                  `${index + 1}. **${video.title}** by ${video.channelTitle}\n   Video ID: ${
                    video.videoId
                  }\n   URL: ${video.url}\n   Published: ${video.publishedAt}`
              )
              .join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error searching for videos: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Create a new playlist
server.tool(
  'create_playlist',
  'Create a new YouTube playlist',
  {
    title: z.string().describe('Title for the new playlist'),
    description: z.string().optional().describe('Description for the playlist'),
    privacy: z
      .enum(['private', 'public', 'unlisted'])
      .default('private')
      .describe('Privacy setting for the playlist'),
  },
  async ({ title, description, privacy }) => {
    try {
      // Note: This requires OAuth authentication, not just API key
      // For now, we'll return a message explaining this limitation
      return {
        content: [
          {
            type: 'text',
            text: `To create playlists, this server needs to be configured with OAuth authentication instead of just an API key. 

Here's what you would need to do:
1. Set up OAuth 2.0 credentials in Google Cloud Console
2. Implement OAuth flow for user authentication
3. Use authenticated client to create playlist

Playlist details you wanted to create:
- Title: ${title}
- Description: ${description || 'No description'}
- Privacy: ${privacy}

For now, you can manually create a playlist on YouTube and use the other tools to search for videos and get playlist information.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating playlist: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Add video to playlist
server.tool(
  'add_to_playlist',
  'Add a video to a YouTube playlist',
  {
    playlistId: z.string().describe('ID of the playlist to add video to'),
    videoId: z.string().describe('YouTube video ID to add to playlist'),
  },
  async ({ playlistId, videoId }) => {
    try {
      // Note: This also requires OAuth authentication
      return {
        content: [
          {
            type: 'text',
            text: `To add videos to playlists, this server needs OAuth authentication.

You wanted to add video ${videoId} to playlist ${playlistId}.

To do this manually:
1. Go to https://www.youtube.com/watch?v=${videoId}
2. Click "Save" under the video
3. Select the playlist "${playlistId}" or create a new one

For automated playlist management, OAuth setup would be required.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error adding video to playlist: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: List user's playlists
server.tool(
  'list_playlists',
  'List YouTube playlists (requires OAuth)',
  {
    maxResults: z
      .number()
      .min(1)
      .max(50)
      .default(25)
      .describe('Maximum number of playlists to return'),
  },
  async ({ maxResults }) => {
    try {
      return {
        content: [
          {
            type: 'text',
            text: `To list your playlists, this server needs OAuth authentication to access your YouTube account.

With OAuth setup, this would return up to ${maxResults} of your playlists with their IDs, titles, and video counts.

For now, you can:
1. Go to https://www.youtube.com/feed/playlists to see your playlists
2. Get playlist IDs from the URLs to use with other tools`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing playlists: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Get playlist items
server.tool(
  'get_playlist_items',
  'Get videos from a YouTube playlist',
  {
    playlistId: z.string().describe('ID of the playlist to get items from'),
    maxResults: z.number().min(1).max(50).default(25).describe('Maximum number of items to return'),
  },
  async ({ playlistId, maxResults }) => {
    try {
      const response = await youtube.playlistItems.list({
        part: ['snippet', 'contentDetails'],
        playlistId,
        maxResults,
      });

      const items =
        response.data.items?.map((item) => ({
          videoId: item.contentDetails?.videoId,
          title: item.snippet?.title,
          description: item.snippet?.description,
          channelTitle: item.snippet?.videoOwnerChannelTitle,
          publishedAt: item.snippet?.publishedAt,
          thumbnails: item.snippet?.thumbnails,
          url: `https://www.youtube.com/watch?v=${item.contentDetails?.videoId}`,
          position: item.snippet?.position,
        })) || [];

      return {
        content: [
          {
            type: 'text',
            text: `Playlist contains ${items.length} videos:\n\n${items
              .map(
                (item, index) =>
                  `${index + 1}. **${item.title}** by ${item.channelTitle}\n   Video ID: ${
                    item.videoId
                  }\n   URL: ${item.url}\n   Position: ${item.position}\n   Published: ${
                    item.publishedAt
                  }`
              )
              .join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting playlist items: ${
              error instanceof Error ? error.message : String(error)
            }. Make sure the playlist ID is correct and the playlist is public.`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Get video details
server.tool(
  'get_video_details',
  'Get detailed information about a YouTube video',
  {
    videoId: z.string().describe('YouTube video ID'),
  },
  async ({ videoId }) => {
    try {
      const response = await youtube.videos.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: [videoId],
      });

      const video = response.data.items?.[0];
      if (!video) {
        return {
          content: [
            {
              type: 'text',
              text: `No video found with ID: ${videoId}`,
            },
          ],
          isError: true,
        };
      }

      const snippet = video.snippet;
      const statistics = video.statistics;
      const contentDetails = video.contentDetails;

      return {
        content: [
          {
            type: 'text',
            text: `**${snippet?.title}**
Channel: ${snippet?.channelTitle}
Published: ${snippet?.publishedAt}
Duration: ${contentDetails?.duration}
Views: ${statistics?.viewCount?.toLocaleString()}
Likes: ${statistics?.likeCount?.toLocaleString()}
Comments: ${statistics?.commentCount?.toLocaleString()}

Description:
${snippet?.description}

URL: https://www.youtube.com/watch?v=${videoId}
Category: ${snippet?.categoryId}
Tags: ${snippet?.tags?.join(', ') || 'None'}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting video details: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Main function to start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('YouTube Playlist Generator MCP Server is running...');
}

// Handle process termination gracefully
process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await server.close();
  process.exit(0);
});

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
