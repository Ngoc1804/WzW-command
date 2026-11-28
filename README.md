# WzW — Các cơ chế

## Hogwarts Map

Map 2 nhận `MAP_DATA` từ Gemini và dựng bản đồ trong HTML Preview. Nhánh `main` chứa mã nguồn, Atlas, bộ bản đồ Fixed và bản dựng phát hành.

- [Hợp đồng runtime và cấu trúc dự án](PROJECT_INSTRUCTION.md)
- [Bản xem thử Fixed và giao diện](examples/WIZAMAP_FIXED_UI.html)
- [Trạng thái phát hành đã kiểm định](docs/RELEASE_READINESS.md)

Chạy `python tools/rebuild.py` để tạo lại bản dựng. SHA mà loader sử dụng nằm trong [runtime-release.json](assets/runtime-release.json).

## GTA Phone

Giao diện điện thoại GTA dùng nhánh riêng [`GTA_phone`](https://github.com/Ngoc1804/WzW-command/tree/GTA_phone).
