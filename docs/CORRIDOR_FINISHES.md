# Bộ màu đá sàn/tường hành lang

| Tầng | Bộ tone | Texture sàn / tường | Sàn / tường |
|---|---|---|---|
| SUB-DUNGEONS, DUNGEONS | basalt | slate / rubble | #858c89 / #a3a69a |
| KITCHENS, F1 | warm-limestone | cobble / stone | #afa58e / #c1b69d |
| F2, F3 | blue-grey | slate / ashlar | #a3afb2 / #bcc5c2 |
| F4, F5 | sandstone | octagon / limestone | #c4b496 / #d0c2a7 |
| F6, F7 | moss-grey | diamond / stone | #afb5a3 / #c2c7b5 |
| F8 | pearl-stone | mosaic / ashlar | #c8c9c0 / #d7d5c8 |

Chia hai tầng liên tiếp theo thứ tự W4 từ SUB-DUNGEONS lên F8. Mỗi bộ có màu nền, màu phụ và màu mạch riêng. F8 là bộ cuối vì W4 hiện dừng tại F8.

Dùng lại pattern SVG sàn/tường hiện có. `assets/styles.json` chứa bảng phối; `src/corridor-finish.js` đọc scope tầng và đổi tham chiếu màu/texture sau khi dựng xong. `src/index.js` nối bước hoàn thiện này vào bản đồ Generated.

Không sửa `src/build.js`, `assets/source/corridors.js`, source artwork, floor/wall geometry, cửa, kích thước, thứ tự layer, nội thất hoặc ID. Tường giáp hành lang dùng bộ tone tương ứng, kể cả cạnh chung phòng/hành lang; các vỏ phòng/artwork nguồn không bị ghi lại. Sàn phòng giữ nguyên. Fixed, Outdoor, phòng đơn không hành lang và scope không xác định giữ nguyên.

MAP_DATA có thể chọn `corridorFinish:{palette:"blue-grey"}` hoặc chỉ định `floor`/`wall` với `texture`, `base`, `accent`, `grout`. `corridorFinish:"approved"` giữ cách tô gốc. Mặc định Hogwarts chọn tự động theo cặp tầng; AU không tự suy đoán tầng.

Kiểm định và trạng thái phát hành: xem `docs/RELEASE_READINESS.md`. Ảnh `docs/corridor-tones.png` là render SVG tĩnh. Các test tương ứng: `tests/corridor-finishes.cjs` và `tests/corridor-finishes-browser.cjs`.
