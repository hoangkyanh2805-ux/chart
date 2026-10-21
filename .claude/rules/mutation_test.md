# Rule: Kỷ luật kiểm thử đột biến (Mutation Testing Rule)

Trước khi coi một tính năng là hoàn thành (`Done`):
1. Phải xây dựng bộ Test Suite kiểm tra toàn bộ các điều kiện biên và logic chính.
2. Phải thử nghiệm bộ test với ít nhất **3 biến thể cố tình làm lỗi (Mutations)**:
   - Mutation 1: Lỗi hoán đổi trục / tọa độ hoặc tính toán sai scale.
   - Mutation 2: Lỗi vi phạm tính toàn vẹn dữ liệu (ví dụ: $High < Low$).
   - Mutation 3: Lỗi timing, render drop frame hoặc memory leak.
3. **Điều kiện bắt buộc:** Cả 3 biến thể lỗi phải làm test FAIL. Nếu bất kỳ bản lỗi nào mà test vẫn PASS, test suite được coi là chưa đạt và phải viết lại test.
