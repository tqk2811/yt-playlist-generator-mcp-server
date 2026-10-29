# Backlog

### [Vừa] Tool authenticate_youtube chặn tới 5 phút khi chờ callback
- Vị trí: `src/index.ts`, `runLoopbackFlow` / tool `authenticate_youtube`.
- Vấn đề: nhiều MCP client timeout request sớm hơn 5 phút; khi đó client huỷ nhưng server callback vẫn chạy tới hết timeout. Nên khởi động server nền, trả `authUrl` ngay, rồi xác nhận qua `get_auth_status`; hoặc nghe `extra.signal` để đóng server khi client huỷ.
- Ghi ngày: 2026-10-29.

### [Vừa] Thiếu PKCE cho luồng OAuth loopback
- Vị trí: `src/index.ts`, `getAuthUrl` và `getToken`.
- Vấn đề: Google khuyến nghị PKCE (S256) cho installed app; dùng `generateCodeVerifierAsync()` của google-auth-library.
- Ghi ngày: 2026-10-29.

### [Thấp] Retry trong add_videos_to_playlist có thể thêm trùng video
- Vị trí: `src/index.ts`, tool `add_videos_to_playlist`.
- Vấn đề: lỗi 5xx/timeout sau khi server đã chèn xong thì retry sẽ chèn lần nữa (playlist cho phép trùng).
- Ghi ngày: 2026-10-29.

### [Thấp] get_playlist_items không phân trang
- Vị trí: `src/index.ts`, tool `get_playlist_items`.
- Vấn đề: chỉ trả tối đa 50 bài, playlist dài hơn bị thiếu; nên thêm `pageToken` / tự lặp hết.
- Ghi ngày: 2026-10-29.

### [Vừa] add_videos_to_playlist trả lỗi rỗng và không chèn được vào vị trí cụ thể
- Vị trí: `src/index.ts`, tool `add_videos_to_playlist` (khối catch).
- Vấn đề: có lần insert lỗi trả `error: ""` nên không biết lý do, cũng không retry; video vẫn hợp lệ, chèn lại thì thành công. Nên lấy message từ `error.response.data` / `errors[0].reason`, coi lỗi không rõ là retryable, và thêm tham số `position` để chèn bù đúng chỗ.
- Ghi ngày: 2026-10-29.
