# Backlog

### [Vừa] Tool authenticate_youtube chặn tới 5 phút khi chờ callback
- Vị trí: `src/index.ts`, `runLoopbackFlow` / tool `authenticate_youtube`.
- Vấn đề: nhiều MCP client timeout request sớm hơn 5 phút; khi đó client huỷ nhưng server callback vẫn chạy tới hết timeout. Nên khởi động server nền, trả `authUrl` ngay, rồi xác nhận qua `get_auth_status`; hoặc nghe `extra.signal` để đóng server khi client huỷ.
- Ghi ngày: 2026-10-29.

### [Vừa] Thiếu PKCE cho luồng OAuth loopback
- Vị trí: `src/index.ts`, `getAuthUrl` và `getToken`.
- Vấn đề: Google khuyến nghị PKCE (S256) cho installed app; dùng `generateCodeVerifierAsync()` của google-auth-library.
- Ghi ngày: 2026-10-29.

### [Thấp] Token OAuth chỉ lưu trong RAM
- Vị trí: `src/index.ts`, nơi `setCredentials`.
- Vấn đề: restart MCP server là phải đăng nhập lại; nên lưu refresh token ra file (đã có `access_type: offline`).
- Ghi ngày: 2026-10-29.

### [Thấp] Retry trong add_videos_to_playlist có thể thêm trùng video
- Vị trí: `src/index.ts`, tool `add_videos_to_playlist`.
- Vấn đề: lỗi 5xx/timeout sau khi server đã chèn xong thì retry sẽ chèn lần nữa (playlist cho phép trùng).
- Ghi ngày: 2026-10-29.

### [Thấp] get_playlist_items không phân trang
- Vị trí: `src/index.ts`, tool `get_playlist_items`.
- Vấn đề: chỉ trả tối đa 50 bài, playlist dài hơn bị thiếu; nên thêm `pageToken` / tự lặp hết.
- Ghi ngày: 2026-10-29.
