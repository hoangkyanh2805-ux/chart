# Ngữ cảnh 02: Quy trình REA + Clean-Room 4 Bước

Quy trình tái lập phần mềm không chạm vào một dòng mã nguồn gốc:

```mermaid
flowchart TD
    A["Ứng dụng mục tiêu<br>(ChartAnimator.io)"] -->|REA Agent Scan| B["Trích xuất hành vi & cấu trúc"]
    B -->|Biên soạn| C["Tài liệu đặc tả SPEC.md"]
    C -->|Cách ly hoàn toàn| D["Phiên làm việc Clean-Room mới"]
    D -->|Coder Agent Rebuild| E["Source Code mới 100%"]
    E -->|Mutation Testing| F{"Kiểm tra 3 bản lỗi cố tình<br>(Mutations)"}
    F -->|Cả 3 bản đều FAIL| G["ĐẠT TIÊU CHUẨN HOÀN TẤT"]
    F -->|Có bản lọt qua (PASS)| H["Test Suite thiếu sót -> Bổ sung Test"]
    H --> F
```

### 4 Bước thực thi thực tế:
1. **Bước 1 (`npx rea-agents setup`):** Kết nối MCP server để trích xuất API, luồng dữ liệu của app mục tiêu.
2. **Bước 2 (Viết Spec):** Ghi rõ input, output, toán học, ràng buộc UX vào `SPEC.md`.
3. **Bước 3 (Rebuild):** Tạo workspace / session mới toanh, chỉ đưa `SPEC.md` và code lại từ đầu.
4. **Bước 4 (Mutation Test & Goal):** Chạy kiểm thử tự động, thử nghiệm với 3 ca đột biến có chủ đích để đảm bảo hệ thống không bị lỗi ngầm.
