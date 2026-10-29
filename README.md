# Tân An - hệ thống chấm điểm công tác Hội

## Cấu trúc

- Các trang `.html`, `app.js`, `styles.css`: giao diện web nằm ngay trong thư mục gốc để tải lên thư mục `htdocs`.
- `backend/`: API PHP kết nối MySQL, đăng nhập phiên và phân quyền admin/ấp.
- `images/`: logo hiển thị trên trang đăng nhập và các trang web.
- Thư mục hiện tại không kèm file dump/schema SQL; cần xuất database đang sử dụng từ phpMyAdmin trước khi triển khai trên host khác.

## Các bảng dữ liệu

- `ap`: danh sách ấp.
- `tieu_chi_danh_gia`: danh sách tiêu chí và điểm tối đa.
- `diem_danh_gia`: điểm số và minh chứng hiện tại theo ấp.
- `tai_khoan`: tài khoản admin và tài khoản các ấp.
- `xac_nhan_diem`: trạng thái xác nhận hiện tại.
- `lich_su_danh_gia`: bản ghi mỗi lần ấp gửi đánh giá.
- `chi_tiet_lich_su_danh_gia`: điểm tự đánh giá, điểm xã đánh giá và minh chứng được chụp theo từng tiêu chí.

## Chạy bằng XAMPP và phpMyAdmin

1. Chép thư mục dự án vào `C:\xampp\htdocs\danhgiaxatanan`.
2. Nếu cần dựng database mới, import file SQL đã xuất từ database dự án vào phpMyAdmin.
3. Tạo `backend/config.php` dựa trên `backend/config.example.php`, thay thông tin MySQL của máy. Tệp `config.php` được `.gitignore` bỏ qua.
4. Bật Apache và MySQL trong XAMPP.
5. Mở `http://localhost/danhgiaxatanan/` để vào trang đăng nhập. Các trang web nằm ngay trong thư mục gốc; API vẫn ở `backend/api.php`.
6. Tạo admin đầu tiên từ terminal tại thư mục dự án bằng `php backend/create-admin.php`. Lệnh sẽ hỏi tên đăng nhập và mật khẩu; mật khẩu phải có ít nhất 12 ký tự. Trên Windows, mật khẩu được nhập ẩn bằng PowerShell.
7. Đăng nhập admin, tạo tài khoản thường trong mục **Quản lý tài khoản các ấp**, chọn ấp và cấp tên đăng nhập/mật khẩu tạm (chỉ gồm số, ít nhất 6 chữ số) cho người phụ trách ấp.

## Tải lên InfinityFree

1. Trong File Manager của InfinityFree, mở thư mục `htdocs` của website.
2. Tải các trang `.html`, `app.js`, `styles.css` ở thư mục gốc dự án lên ngay trong `htdocs`; tải cả thư mục `backend` và `images` lên cùng cấp. Không tạo thư mục `frontend` trên host.
3. Tạo database MySQL trong InfinityFree Control Panel. Xuất database đang dùng từ phpMyAdmin local rồi import file SQL đó bằng phpMyAdmin của InfinityFree; dự án hiện không kèm file dump/schema SQL.
4. Tạo `backend/config.php` dựa trên `backend/config.example.php`, nhập đúng hostname, database name, username và password được cấp trong Control Panel. Không tải `backend/config.php` cục bộ lên host; file đó chứa thông tin đăng nhập MySQL của máy local.
5. Mở tên miền để vào trang đăng nhập. API đã cấu hình tương đối tới `backend/api.php`; các trang và logo dùng đường dẫn tương đối từ thư mục gốc.

## Chạy thử bằng PHP built-in server

Sau khi đã import SQL và tạo `backend/config.php`, mở terminal ở thư mục dự án:

```powershell
php -S 127.0.0.1:8000
```

Sau đó mở `http://127.0.0.1:8000/` để đến trang đăng nhập.

## Phân quyền

- **Admin**: xem điểm của tất cả 13 ấp, tạo tài khoản thường và gán tài khoản cho một ấp; mở trang chi tiết của từng ấp từ trang quản trị để kiểm tra minh chứng, xác nhận hoặc gỡ xác nhận điểm.
- **Thường**: chỉ API trả về ấp được gán; chỉ xem và lưu điểm của ấp đó.
- Khi ấp lưu điểm sau khi đã được xác nhận, hệ thống tự gỡ xác nhận để admin kiểm tra và xác nhận lại phiên bản mới.
- Điểm và minh chứng của mỗi lần đánh giá được giữ thành bản chụp trong lịch sử; khi xã xác nhận, bản chụp đó được đánh dấu xác nhận và không thay đổi khi ấp bắt đầu lần đánh giá mới. Khi nâng cấp, migration lưu lại bản xác nhận hiện còn hiệu lực; các lần đã bị gỡ xác nhận trước khi cài migration không thể khôi phục.
- Mỗi lần tài khoản ấp lưu điểm sẽ tạo một bản chụp riêng trong lịch sử ở trạng thái chờ xác nhận; ngay sau đó, các điểm và minh chứng hiện tại được làm trống để bắt đầu lần đánh giá tiếp theo. Xã xác nhận bản chụp trong lịch sử, không phải phiếu hiện tại.
- Mỗi lần xã xác nhận, đúng bản chụp đang chờ được đánh dấu đã xác nhận và giữ nguyên trong lịch sử. Gỡ xác nhận không làm thay đổi bản ghi lịch sử hay phiếu hiện tại.
- Khi xác nhận, điểm xã của mỗi tiêu chí mặc định bằng điểm tự đánh giá; admin chỉ cần sửa các tiêu chí có điểm khác. Điểm xã và tổng điểm xã được lưu riêng bên cạnh điểm tự đánh giá. Lịch sử cũ chưa có điểm xã riêng sẽ hiển thị “Chưa chấm”.
- Nếu trang tự đánh giá vẫn đang mở lúc xã xác nhận một bản ghi cũ, trang sẽ tự kiểm tra định kỳ và đồng bộ trạng thái từ máy chủ.
- Trang tự đánh giá hiển thị trạng thái bản ghi lịch sử mới nhất đã lưu/đang chờ xác nhận, trong khi các trường điểm và minh chứng hiện tại được để trống.
- Admin chỉ sử dụng trang quản trị; nếu mở trang tổng quan hoặc tự đánh giá, hệ thống sẽ chuyển về trang quản trị.
- API dùng mật khẩu băm, phiên PHP `HttpOnly`/`SameSite=Strict`, mã CSRF cho thao tác ghi và kiểm tra quyền ấp ở phía máy chủ.
- Chạy qua HTTPS khi triển khai ngoài máy cá nhân/mạng nội bộ đáng tin cậy. Chưa có chức năng đổi hoặc đặt lại mật khẩu; quản trị tài khoản hiện dành cho admin tạo tài khoản thường.

API đọc dữ liệu bằng `GET`, lưu điểm/minh chứng bằng `PUT`, đăng nhập/đăng xuất và tạo tài khoản bằng `POST`.
