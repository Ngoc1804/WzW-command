(() => {
  "use strict";
  const mount = document.getElementById("gta-phone");
  if (!mount) return;
  if (window.GTA_PHONE_CSS_FAILED) return window.gtaPhoneLoadError?.();
  const assetBase = document.currentScript?.src
    ? new URL("../", document.currentScript.src).href
    : document.baseURI;
  mount.innerHTML = "<main class=\"frame\" aria-label=\"Điện thoại iFruit\">\n  <div class=\"screen\">\n    <div class=\"wallpaper\" aria-hidden=\"true\"><img id=\"wallpaper-image\" alt=\"\" hidden></div>\n    <div class=\"camera\" aria-hidden=\"true\"></div>\n    <header class=\"status\" aria-label=\"Thanh trạng thái\">\n      <div><time class=\"status-time\" id=\"status-time\"></time></div>\n      <div id=\"signal\"></div>\n    </header>\n    <div class=\"main\" id=\"main\">\n      <section class=\"home\" id=\"home\" aria-labelledby=\"brand\">\n        <div class=\"brand\">\n          <p id=\"region\"></p>\n          <h1 id=\"brand\">iFruit</h1>\n        </div>\n        <nav class=\"launcher\" id=\"launcher\" aria-label=\"Ứng dụng\"></nav>\n      </section>\n      <div class=\"workspace\" id=\"workspace\" hidden>\n        <section class=\"app\" id=\"app\" aria-labelledby=\"app-title\"></section>\n      </div>\n      <aside class=\"widgets\" id=\"widgets\" aria-label=\"Trạng thái nhanh\"></aside>\n      <nav class=\"dock\" id=\"dock\" aria-label=\"Ứng dụng truy cập nhanh\"></nav>\n    </div>\n    <footer class=\"gesture\"><button type=\"button\" id=\"home-button\" aria-label=\"Về màn hình chính\" title=\"Về màn hình chính\"></button></footer>\n  </div>\n</main>\n<script type=\"application/json\" id=\"WALLPAPERS\">\n[]\n</script>\n<script type=\"application/json\" id=\"POST_POOL\">\n[\n{\"author\":\"@hamlet.local\",\"time\":\"08:48\",\"mediaType\":\"clip\",\"caption\":\"Đường thông rồi nha. Hỏi cái biển thì nó chịu.\",\"likes\":12,\"comments\":[{\"author\":\"@keys.tow\",\"time\":\"12p\",\"text\":\"Qua được. Quay đầu mới tính tiền.\",\"likes\":8},{\"author\":\"@marta.bait\",\"time\":\"9p\",\"text\":\"Biển đó đứng từ tháng ba rồi ông ơi.\",\"likes\":4},{\"author\":\"@hamlet.local\",\"time\":\"5p\",\"text\":\"Tháng ba năm nào thì chị nói rõ đi.\",\"likes\":6},{\"author\":\"@bridge.danny\",\"time\":\"2p\",\"text\":\"Tui thấy xe cứu hộ tới trước đội sửa đường.\",\"likes\":2}],\"scene\":\"canal\",\"duration\":\"00:14\",\"id\":\"canal\",\"imageDescription\":\"Máy quay rung từ ghế phụ. Một chiếc bán tải bò qua vũng nước ven kênh, hất bùn lên tấm biển «Đường đang sửa».\"},\n{\"author\":\"@marta.bait\",\"time\":\"08:22\",\"mediaType\":\"photo\",\"caption\":\"Ca sáng có quản lý mới. Đừng nhìn thẳng vào mắt nó.\",\"likes\":27,\"comments\":[{\"author\":\"@hamlet.local\",\"text\":\"Quản lý cũ còn thiếu tui ba đô.\",\"time\":\"31p\",\"likes\":3}],\"scene\":\"bait\",\"id\":\"bait\",\"imageDescription\":\"Ly cà phê đọng nước trên thùng giữ lạnh. Sau quầy, một con mòng biển đang đứng chễm chệ trên tấm bảng «Cấm cho chim ăn».\"},\n{\"author\":\"@hamlet.notice\",\"time\":\"07:56\",\"caption\":\"Làn đón khách ở cổng Hamlet đã mở lại. Xe chờ lâu thì tấp qua bãi bên kia đường.\",\"locationId\":\"hamlet-gate\",\"comments\":[{\"author\":\"@keys.tow\",\"text\":\"Bãi trống phía hàng rào xanh nha.\",\"time\":\"42p\",\"likes\":2}],\"headline\":\"Làn đón khách mở lại\",\"posterLabel\":\"THÔNG BÁO · HAMLET\",\"locationLabel\":\"Cổng trại giam Hamlet\",\"id\":\"hamlet-notice\",\"mediaType\":\"photo\",\"imageSvg\":\"\\u003csvg viewBox=\\\"0 0 640 400\\\">\\u003crect width=\\\"640\\\" height=\\\"400\\\" fill=\\\"#584250\\\"/>\\u003cpath d=\\\"M0 270L180 175l82 38 85-45 293 104v128H0Z\\\" fill=\\\"#e8af83\\\"/>\\u003crect x=\\\"95\\\" y=\\\"105\\\" width=\\\"450\\\" height=\\\"190\\\" rx=\\\"12\\\" fill=\\\"#f3dfb2\\\"/>\\u003ctext x=\\\"320\\\" y=\\\"211\\\" text-anchor=\\\"middle\\\" font-size=\\\"26\\\" fill=\\\"#3a2b36\\\">Làn đón khách mở lại\\u003c/text>\\u003c/svg>\",\"imageDescription\":\"Một tấm bảng thông báo bên đường.\"},\n{\"author\":\"@keys.tow\",\"time\":\"07:38\",\"headline\":\"Mất một chiếc dép\",\"posterLabel\":\"NHẮN TÌM ĐỒ · LEONIDA KEYS\",\"caption\":\"Ai lượm được chiếc dép trái ở bến số 4, cho tui xin. Chiếc bên phải vẫn mang đi làm bình thường.\",\"likes\":17,\"comments\":[{\"author\":\"@marta.bait\",\"time\":\"48p\",\"text\":\"Cho mượn đôi ủng, nhớ trả trước khi nước lên.\",\"likes\":3}],\"id\":\"lost-sandal\",\"mediaType\":\"photo\",\"imageSvg\":\"\\u003csvg viewBox=\\\"0 0 640 400\\\">\\u003crect width=\\\"640\\\" height=\\\"400\\\" fill=\\\"#265352\\\"/>\\u003cpath d=\\\"M0 270L180 175l82 38 85-45 293 104v128H0Z\\\" fill=\\\"#e8af83\\\"/>\\u003crect x=\\\"95\\\" y=\\\"105\\\" width=\\\"450\\\" height=\\\"190\\\" rx=\\\"12\\\" fill=\\\"#f3dfb2\\\"/>\\u003ctext x=\\\"320\\\" y=\\\"211\\\" text-anchor=\\\"middle\\\" font-size=\\\"26\\\" fill=\\\"#3a2b36\\\">Mất một chiếc dép\\u003c/text>\\u003c/svg>\",\"imageDescription\":\"Một tấm bảng thông báo bên đường.\"}\n]\n</script>";
  try {
(() => {
  "use strict";
  const glyphs = {
    chat:'<path d="M4 5h16a1 1 0 0 1 1 1v10H9l-5 4v-4H3V6a1 1 0 0 1 1-1Z"/><path d="M7 10h10m-10 3h7"/>',
    phone:'<path d="m8 4 2 5-2 2a12 12 0 0 0 5 5l2-2 5 2v3a2 2 0 0 1-2 2C10 21 3 14 3 6a2 2 0 0 1 2-2z"/>',
    gps:'<path d="M19 10c0 5-7 10-7 10s-7-5-7-10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    quest:'<path d="M8 5H5v16h14V5h-3m-8 6h8m-8 4h5"/><rect x="8" y="3" width="8" height="4" rx="1.5"/>',
    cash:'<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18m-14 5h4"/>',
    contact:'<rect x="4" y="3" width="16" height="18" rx="3"/><circle cx="12" cy="9" r="2"/><path d="M8 16a4 4 0 0 1 8 0"/>',
    eye:'<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.5"/>',
    social:'<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M8 6l2-3h4l2 3"/><circle cx="12" cy="13" r="3.2"/>',
    key:'<circle cx="8" cy="9" r="4"/><path d="m11 12 8 8m-3-3 2-2m-4 0 2-2"/>',
    bag:'<path d="M5 8h14l2 12H3L5 8Zm4 1V6a3 3 0 0 1 6 0v3"/>',
    health:'<path d="M2 12h5l2-5 3 11 2-6h8"/>',
    chevron:'<path d="m9 6 6 6-6 6"/>',
    signal:'<path d="M4 19v-3m5 3v-6m5 6V9m5 10V5" stroke-width="2.7"/>',
    home:'<path d="m3 10 9-7 9 7v10h-7v-6h-4v6H3Z"/>'
  };
  const apps = {
    whatup:{label:"WhatUp",icon:"chat",color:"#a5e3bc"},
    calls:{label:"Cuộc gọi",icon:"phone",color:"#a5dcca"},
    gps:{label:"GPS",icon:"gps",color:"#f8bb8c"},
    missions:{label:"Nhiệm vụ",icon:"quest",color:"#f6a9bb"},
    buckme:{label:"BuckMe",icon:"cash",color:"#f2d889"},
    contacts:{label:"Danh bạ",icon:"contact",color:"#b8c6ea"},
    social:{label:"Snapmatic",icon:"social",color:"#e9afd0"},
    inventory:{label:"Túi đồ",icon:"bag",color:"#e5bc9f"}
  };

  const byId = id => document.getElementById(id);
  const escapeText = value => String(value ?? "").replace(/[&<>"']/g, char =>
    ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
  const currency = new Intl.NumberFormat("en-US", {style:"currency",currency:"USD",maximumFractionDigits:2,minimumFractionDigits:0});
  const dollars = value => Number.isFinite(value) ? currency.format(value) : "—";
  const list = value => Array.isArray(value) ? value.filter(entry => entry && typeof entry === "object") : [];
  const listStrings = value => Array.isArray(value) ? value.filter(entry=>typeof entry === "string" && entry.trim()) : [];
  const last = items => items.at(-1) ?? {};
  const icon = (key, extra = "") => `<svg class="icon ${extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${glyphs[key]}</svg>`;
  const avatar = name => `<span class="avatar" aria-hidden="true">${escapeText(String(name ?? "?").trim().split(/\s+/).slice(0,2).map(word => word[0] ?? "").join("").toLocaleUpperCase("vi"))}</span>`;
  const tile = key => `<span class="tile" data-icon="${key}" style="--tile:${apps[key].color}">${icon(apps[key].icon)}</span>`;
  const empty = message => `<p class="muted">${message}</p>`;
  const app = byId("app");
  const launcher = byId("launcher");

  function readJson(id, fallback) {
    try { return JSON.parse(byId(id).textContent) ?? fallback; }
    catch { return fallback; }
  }

  function drawPosts(pool, count) {
    const remaining = [...pool];
    const result = [];
    while (remaining.length && result.length < count) {
      const index = Math.floor(Math.random() * remaining.length);
      result.push(...remaining.splice(index, 1));
    }
    return result;
  }

  const wallpapers = readJson("WALLPAPERS", []);
  const postPool = list(readJson("POST_POOL", []));

  function setWallpaper(data) {
    const image = byId("wallpaper-image");
    const selected = Number.isInteger(data.wallpaperIndex) && data.wallpaperIndex >= 1 &&
      data.wallpaperIndex <= wallpapers.length ? data.wallpaperIndex - 1 : Math.floor(Math.random() * wallpapers.length);
    image.hidden = true;
    image.removeAttribute("src");
    if (typeof wallpapers[selected] !== "string" || !wallpapers[selected].trim()) return;
    try {
      const url = new URL(wallpapers[selected], assetBase);
      if (!["https:", "http:", "file:"].includes(url.protocol)) return;
      image.src = url.href;
      image.hidden = false;
    } catch {}
  }

  function prepareData(payload) {
    const data = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : {};
    const phoneState = data.phoneState && typeof data.phoneState === "object" &&
      !Array.isArray(data.phoneState) ? data.phoneState : {};
    const snapshot = {...phoneState, ...data};
    const social = Array.isArray(snapshot.newPosts) || !Array.isArray(snapshot.social)
      ? [...drawPosts(postPool, 3), ...list(snapshot.newPosts).slice(0, 2)] : list(snapshot.social);
    const missions = list(snapshot.missions).filter(mission=>mission.status !== "done" ||
      !snapshot.date || !mission.completedOn || mission.completedOn === snapshot.date);
    return {...snapshot, threads: list(snapshot.threads ?? snapshot.messages), missions, social};
  }

  let data;
  let state;
  function setData(payload) {
    data = prepareData(payload);
    state = {
      page:"home", thread:0, call:0, contact:0, contactQuery:"", mission:0, missionFilter: data.missions.some(mission=>missionStatus(mission) === "active") ? "active" : data.missions.length ? missionStatus(data.missions[0]) : "active", item:0, transaction:-1, post:0,
      gpsOrigin:"", gpsPoi:-1, read:new Set(), liked:new Set(data.social.flatMap((post,index) => post.liked ? [index] : [])),
      snapTab:"explore", commentLikes:new Set(), userComments:new Map(), drafts:new Map(), hiddenDescriptions:new Set()
    };
    setWallpaper(data);
    renderStatus();
    renderWidgets();
    const page = data.app === "messages" ? "whatup" : data.app === "snapmatic" ? "social" : data.app;
    open(typeof page === "string" && Object.hasOwn(apps, page) ? page : "home");
  }

  function renderStatus() {
    byId("status-time").textContent = data.time ?? "—";
    byId("region").textContent = String(data.region ?? "Leonida").toLocaleUpperCase("vi");
    const battery = Number.isFinite(data.battery) ? Math.min(100, Math.max(0, Math.round(data.battery))) : 0;
    byId("signal").innerHTML = `${icon("signal")}<span class="network">${escapeText(data.network)}</span>
      <svg class="icon battery" viewBox="0 0 25 14" role="img" aria-label="Pin ${battery}%"><rect x="1" y="2" width="20" height="10" rx="3" fill="none" stroke="currentColor"/><rect x="3" y="4" width="${16*battery/100}" height="6" rx="1.5" fill="currentColor"/><path d="M23 5v4" stroke="currentColor" stroke-width="1.5"/></svg>`;
  }

  function renderNavigation() {
    const unread = data.threads.filter((thread, index) => thread.unread && !state.read.has(index)).length;
    const dock = ["whatup","calls","gps"];
    const shortcuts = Object.keys(apps).filter(key=>!dock.includes(key));
    const launch = key => `<button type="button" class="launch" data-app="${key}"><span class="launch-icon">${tile(key)}
      ${key === "whatup" && unread ? `<span class="badge" aria-label="${unread} cuộc trò chuyện chưa đọc">${unread}</span>` : ""}</span>
      <span class="launch-label">${apps[key].label}</span></button>`;
    launcher.innerHTML = `<div class="app-grid">${shortcuts.map(launch).join("")}</div>`;
    byId("dock").innerHTML = dock.map(launch).join("");
  }

  function renderWidgets() {
    const mission = data.missions.find(entry=>missionStatus(entry) === "active");
    const wanted = Number.isFinite(data.wanted) ? Math.round(Math.min(5,Math.max(0,data.wanted))) : 0;
    const widget = ({page,key,label,value,extra="",className="",suffix=""}) => {
      const tag = page ? "button" : "div";
      return `<${tag} class="widget ${className}"${page ? ` type="button" data-app="${page}"` : ""}>
        <span class="widget-icon">${icon(key)}</span><span class="widget-text"><span class="widget-label">${label}</span>
        <strong class="widget-value">${escapeText(value)}</strong>${extra ? `<span class="widget-extra">${escapeText(extra)}</span>` : ""}</span>
        ${suffix || (page ? icon("chevron","chevron") : "")}</${tag}>`;
    };
    const [location,...status] = [
      widget({page:"gps",key:"gps",label:"Vị trí hiện tại",value:data.location ?? "—",extra:"Mở bản đồ GPS"}),
      widget({page:"buckme",key:"cash",label:"Tiền mặt",value:dollars(data.cash),className:"money",suffix:`<span class="stars" aria-label="Mức truy nã ${wanted} trên 5">${"★".repeat(wanted)}${"☆".repeat(5-wanted)}</span>`}),
      widget({page:"missions",key:"quest",label:"Nhiệm vụ",value:mission?.title ?? "—",extra:mission ? [mission.deadline,Number.isFinite(mission.amount) ? dollars(mission.amount) : ""].filter(Boolean).join(" · ") : "",className:"quest"}),
      widget({key:"health",label:"Thể trạng",value:data.condition ?? "—"})
    ];
    byId("widgets").innerHTML = location + `<div class="widget-stack">${status.join("")}</div>`;
  }

  const rowLabel = (title,subtitle = "") => `<span><strong>${escapeText(title)}</strong>${subtitle ? `<small>${escapeText(subtitle)}</small>` : ""}</span>`;
  const choose = (key,index,active,body,style="row") =>
    `<button type="button" class="${style}" data-select="${key}" data-index="${index}" aria-pressed="${active}">${body}</button>`;
  const appLink = (page,label,index,extra="") =>
    `<button type="button" class="chip" data-app="${page}"${Number.isInteger(index) ? ` data-index="${index}"` : ""}${extra}>${label}</button>`;
  const headline = person => String(person?.name ?? "").trim();

  function messages() {
    const threads = data.threads;
    if (!threads.length) return `<div class="inset">${empty("Chưa có tin nhắn.")}</div>`;
    const selected = threads[state.thread] ?? threads[0];
    const rows = threads.map((thread,index) => {
      const snippet = last(list(thread.messages));
      const dot = thread.unread && !state.read.has(index) ? '<i class="unread-dot" aria-label="Chưa đọc"></i>' : "";
      return choose("thread",index,selected===thread,`${avatar(thread.name)}${rowLabel(thread.name,snippet.text)}<time>${escapeText(snippet.time)}${dot}</time>`);
    }).join("");
    const bubbles = list(selected.messages).map(msg =>
      `<div class="bubble${msg.mine || msg.sender === "pc" ? " me" : ""}">${escapeText(msg.text)}<time>${escapeText(msg.time)}</time></div>`).join("");
    return `<div class="panes"><div class="pane side-pane inset" data-scroll="threads">${rows}</div>
      <section class="pane chat-pane inset" aria-label="Cuộc trò chuyện"><div class="chat-head">${avatar(selected.name)}<strong>${escapeText(selected.name)}</strong></div>
      ${selected.date ? `<p class="chat-date">${escapeText(selected.date)}</p>` : ""}
      <div class="list">${bubbles || empty("Cuộc trò chuyện trống.")}</div></section></div>`;
  }

  function calls() {
    const records = list(data.calls);
    if (!records.length) return `<div class="inset">${empty("Chưa có cuộc gọi.")}</div>`;
    const current = records[state.call] ?? records[0];
    const people = records.filter((entry,index) => records.findIndex(call => call.name===entry.name) === index);
    const rows = records.map((record,index) => {
      const missed = record.kind === "missed" || /nhỡ/i.test(record.direction ?? "");
      const symbol = missed ? "!" : record.kind === "outgoing" || /đi/i.test(record.direction ?? "") ? "↗" : "↙";
      return choose("call",index,current===record,`<span class="call-kind${missed ? " missed" : ""}" aria-hidden="true">${symbol}</span>${rowLabel(record.name,record.direction)}<time>${escapeText(record.time)}</time>`);
    }).join("");
    return `<div class="inset"><div class="call-strip" aria-label="Liên hệ gần đây">${people.map(person =>
      choose("call",records.indexOf(person),current===person,`${avatar(person.name)}${escapeText(person.name)}`,"call-person")).join("")}</div>
      <div class="call-log"><section aria-label="Nhật ký cuộc gọi">${rows}</section>
      <section class="call-card"><h3>${escapeText(current.name)}</h3><p>${escapeText(current.direction)} · ${escapeText(current.time)}</p>
      ${current.duration ? `<p class="muted">Thời lượng ${escapeText(current.duration)}</p>` : ""}</section></div></div>`;
  }

  function contacts() {
    const records = list(data.contacts);
    if (!records.length) return `<div class="inset">${empty("Chưa có liên hệ.")}</div>`;
    const current = records[state.contact] ?? records[0];
    const rows = records.map((entry,index) => choose("contact",index,entry===current,`${avatar(entry.name)}${rowLabel(entry.name)}`)).join("");
    const chatIndex = data.threads.findIndex(thread=>headline(thread)===headline(current));
    const callIndex = list(data.calls).findIndex(call=>headline(call)===headline(current));
    return `<div class="panes"><div class="pane side-pane inset" data-scroll="contacts">
      <label class="search-label" for="contact-search">Tìm liên hệ</label><input class="contact-search" id="contact-search" type="search" autocomplete="off" value="${escapeText(state.contactQuery)}">
      <div id="contact-rows">${rows}</div><p class="muted" id="no-contacts" hidden>Không tìm thấy liên hệ.</p></div>
      <section class="pane contact-poster">${avatar(current.name)}<div><h3>${escapeText(current.name)}</h3><p class="muted">${escapeText(current.note)}</p>
      <div class="contact-actions">${chatIndex>=0 ? appLink("whatup","Tin nhắn",chatIndex) : ""}${callIndex>=0 ? appLink("calls","Nhật ký gọi",callIndex) : ""}</div></div></section></div>`;
  }

  function filterContacts() {
    const query = state.contactQuery.trim().toLocaleLowerCase("vi");
    const rows = [...app.querySelectorAll("#contact-rows button")];
    const contacts = list(data.contacts);
    for (const row of rows) row.hidden = !headline(contacts[Number(row.dataset.index)]).toLocaleLowerCase("vi").includes(query);
    const emptyState = app.querySelector("#no-contacts");
    if (emptyState) emptyState.hidden = rows.some(row => !row.hidden);
  }

  const missionStates = {active:"Đang tiến hành",available:"Chưa nhận",done:"Xong"};
  const missionStatus = mission => Object.hasOwn(missionStates,mission.status) ? mission.status : "active";

  function missionStatusBox(filter = "") {
    const missions = data.missions;
    return `<section class="mission-status-box" aria-label="Trạng thái nhiệm vụ">
      ${filter ? "" : "<h4>Trạng thái nhiệm vụ</h4>"}
      <div class="mission-status-list">${Object.entries(missionStates).map(([key,label]) => {
        const count = missions.filter(mission=>missionStatus(mission) === key).length;
        const action = filter ? `data-mission-filter="${key}" aria-pressed="${filter === key}"` :
          `data-app="missions" data-mission-filter="${key}"`;
        return `<button class="mission-status" data-status="${key}" type="button" ${action}><span>${label}</span><strong>${count}</strong></button>`;
      }).join("")}</div>
    </section>`;
  }

  function missions() {
    const entries = data.missions;
    const visible = entries.map((mission,index)=>({mission,index})).filter(({mission})=>missionStatus(mission) === state.missionFilter);
    const active = visible.find(entry=>entry.index === state.mission) ?? visible[0];
    const rows = visible.map(({mission,index}) => choose("mission",index,index === active.index,
      `<span class="widget-icon">${icon("quest")}</span>${rowLabel(mission.title,mission.location?.name ?? mission.deadline)}`)).join("");
    const selected = active?.mission;
    const markerIndex = selected ? gpsPlaces().findIndex(place=>place.missionIndex === active.index) : -1;
    const steps = listStrings(selected?.steps);
    const status = selected ? missionStatus(selected) : state.missionFilter;
    return `<div class="panes mission-panes"><section class="pane side-pane inset" data-scroll="missions" aria-label="Danh sách nhiệm vụ">
      ${missionStatusBox(state.missionFilter)}${rows || empty("Chưa có nhiệm vụ ở trạng thái này.")}</section>
      <section class="pane inset">${selected ? `<div class="deadline-ticket">
      <span class="mission-tag" data-status="${status}">${missionStates[status]}${selected.type === "main" ? " · Chính" : ""}</span>
      <h3>${escapeText(selected.title)}</h3><div class="ticket-figures">
      ${selected.deadline ? `<strong>${escapeText(selected.deadline)}</strong>` : ""}${Number.isFinite(selected.amount) ? `<strong>${dollars(selected.amount)}</strong>` : ""}</div></div>
      ${selected.description ? `<p class="mission-description">${escapeText(selected.description)}</p>` : ""}
      ${steps.length ? `<ol class="timeline">${steps.map(step=>`<li>${escapeText(step)}</li>`).join("")}</ol>` : ""}
      ${markerIndex >= 0 ? appLink("gps","Xem trên GPS",markerIndex) : ""}` : ""}</section></div>`;
  }

  function inventory() {
    const entries = list(data.inventory);
    if (!entries.length) return `<div class="inset">${empty("Túi đồ đang trống.")}</div>`;
    const selected = entries[state.item] ?? entries[0];
    const pictogram = entry => entry.kind === "receipt" ? "quest" : entry.kind === "key" ? "key" : "bag";
    const slots = entries.map((entry,index) => choose("item",index,entry===selected,
      `<span class="item-art">${icon(pictogram(entry))}</span><strong>${escapeText(entry.name)}</strong>${entry.quantity != null ? `<small>×${escapeText(entry.quantity)}</small>` : ""}`,"item-slot")).join("");
    return `<div class="panes items-panes"><section class="pane side-pane inset" data-scroll="items"><div class="item-grid">${slots}</div></section>
      <section class="pane inset"><div class="item-preview${selected.kind === "receipt" ? " receipt" : ""}">
      <span class="widget-icon">${icon(pictogram(selected))}</span><h3>${escapeText(selected.name)}</h3><p>${escapeText(selected.description)}</p></div></section></div>`;
  }

  function transactions() {
    const entries = list(data.transactions);
    const current = entries[state.transaction];
    const rows = entries.map((entry,index) => choose("transaction",index,entry===current,
      `<span class="widget-icon">${icon("cash")}</span>${rowLabel(entry.title,entry.time)}
      <span class="amount${entry.amount<0 ? " out" : ""}">${entry.amount>0 ? "+" : ""}${dollars(entry.amount)}</span>`)).join("");
    return `<div class="panes finance"><section class="pane side-pane inset"><div class="balance"><span>BuckMe · Tiền mặt</span><strong>${dollars(data.cash)}</strong></div></section>
      <section class="pane inset" data-scroll="transactions"><h3>Giao dịch</h3>${rows || empty("Chưa có giao dịch.")}
      ${current ? `<p class="detail-note">${escapeText(current.description ?? [current.title,current.time,dollars(current.amount)].filter(Boolean).join(" · "))}</p>` : ""}</section></div>`;
  }

  const scenes = {
    canal:`<svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="canal-sky" x2="0" y2="1"><stop stop-color="#303968"/><stop offset=".65" stop-color="#bc5c77"/><stop offset="1" stop-color="#ffc488"/></linearGradient><linearGradient id="canal-water" x2="0" y2="1"><stop stop-color="#487681"/><stop offset="1" stop-color="#222b48"/></linearGradient></defs><rect width="640" height="400" fill="url(#canal-sky)"/><circle cx="441" cy="145" r="53" fill="#ffd698"/><path d="M0 147q55-38 134 0t155 7q66-15 128 14 66-30 120-7 66-28 103-18v82H0Z" fill="#35394d"/><path d="M0 188q130 35 290 8t350 8v196H0Z" fill="url(#canal-water)"/><path d="M314 224h188m-127 18h192m-177 20h190m-245 16h81m-38 19h171m-152 22h115" stroke="#ffe2ad" stroke-opacity=".35" stroke-width="4"/><path d="M0 223q94-12 221-14L433 400H0Z" fill="#31303d"/><path d="M0 261q84-27 231-40l185 179h-21L223 228Q83 241 0 280Z" fill="#e7a375" opacity=".5"/><path d="M29 322q135-39 267 25l32 22q-163 18-299-47Z" fill="#657181"/><path d="M59 329q107-13 213 22m-185-9 95 16" fill="none" stroke="#df9a8e" stroke-width="3"/><g fill="#202939"><path d="M14 227q35-73 25-143l8-3q20 70-18 150ZM610 247q-16-83 3-154l-8-1q-25 72-10 154Z"/><path d="M39 90Q-1 47 0 79q25-6 39 11Q24 34 2 36q29 22 37 54Q66 29 103 56q-45 0-64 34Q83 63 111 89q-43-11-72 1ZM608 97q-41-39-75-20 46-3 75 20-15-43-47-57 33 31 47 57 9-52 32-58v11q-17 20-32 47 22-11 32-7v-13q-19 2-32 20Z"/></g><g transform="translate(106 232)"><ellipse cx="115" cy="67" rx="119" ry="12" fill="#1a1e2a" opacity=".75"/><path d="M0 26h66l27-28h54l28 23 54 8v36H0Z" fill="#d58a56"/><path d="M92 5h50l19 17H78Z" fill="#313749"/><path d="M0 37h228v13H0Z" fill="#e7a273"/><circle cx="44" cy="64" r="17" fill="#1c222f"/><circle cx="190" cy="64" r="17" fill="#1c222f"/><circle cx="44" cy="64" r="7" fill="#88919a"/><circle cx="190" cy="64" r="7" fill="#88919a"/><path d="M224 33h5v11h-5" fill="#fff1a5"/></g><path d="M516 219v106" stroke="#423840" stroke-width="7"/><rect x="473" y="208" width="85" height="39" rx="4" fill="#efad52" transform="rotate(-5 516 228)"/><text x="516" y="232" text-anchor="middle" fill="#432b32" font-size="11" font-family="system-ui" font-weight="850">ĐƯỜNG ĐANG SỬA</text><path d="M22 61V27h38m558 34V27h-38M22 344v33h38m558-33v33h-38" fill="none" stroke="#fff" opacity=".47" stroke-width="2"/></svg>`,
    bait:`<svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="bait-sky" x2="0" y2="1"><stop stop-color="#81c4cd"/><stop offset="1" stop-color="#ffd3a2"/></linearGradient><linearGradient id="bait-desk" x2="0" y2="1"><stop stop-color="#e7a373"/><stop offset="1" stop-color="#965b54"/></linearGradient></defs><rect width="640" height="400" fill="url(#bait-sky)"/><circle cx="492" cy="86" r="43" fill="#ffe7b1"/><path d="M0 163q92-21 215-2t184 4 241-13v124H0Z" fill="#55938e"/><path d="M0 200q85-18 210-3t244 2 186-15v92H0Z" fill="#6eaaa2"/><path d="M18 205h208m-152 15h101m268-16h144m-160 21h131" stroke="#f7e2a8" stroke-opacity=".51" stroke-width="3"/><path d="M0 15h640v41H0Z" fill="#edaa86"/><path d="M0 14h640v19H0Z" fill="#a95863"/><path d="M45 56h14v183H45Z" fill="#cf896f"/><path d="M579 56h14v187h-14Z" fill="#c67b66"/><path d="M0 254h640v146H0Z" fill="url(#bait-desk)"/><path d="M0 302h640m-640 33h640m-640 39h640" stroke="#713b46" stroke-opacity=".5" stroke-width="3"/><ellipse cx="212" cy="348" rx="126" ry="19" fill="#61404b" opacity=".59"/><rect x="95" y="253" width="227" height="88" rx="12" fill="#65888f"/><rect x="88" y="240" width="241" height="28" rx="8" fill="#b9d5cb"/><rect x="179" y="273" width="60" height="13" rx="3" fill="#344c64"/><path d="M171 157h67l-9 82h-49Z" fill="#8a584d"/><path d="M176 165h56l-5 33h-48Z" fill="#e4b483"/><rect x="168" y="150" width="73" height="13" rx="4" fill="#fcdfb4"/><path d="M183 177l4 48m37-46-3 33" stroke="#fff4d2" stroke-width="3" opacity=".6"/><rect x="397" y="205" width="143" height="82" rx="4" fill="#ffe2af"/><rect x="403" y="211" width="131" height="70" fill="none" stroke="#8e5d61" stroke-width="2"/><text x="468" y="249" text-anchor="middle" fill="#644550" font-family="system-ui" font-size="15" font-weight="800">CẤM CHO CHIM ĂN</text><path d="M430 205q8-31 31-33 12-3 17-14 3-11 16-7 10 2 10 12l16 3-16 6q-9 24-27 26Z" fill="#fff2dc"/><path d="M437 199q22-23 47-18-11 15-32 20Z" fill="#9da0a7"/><circle cx="495" cy="159" r="2" fill="#3d3b4d"/><path d="M492 195v10m-10-9v9" stroke="#de9255" stroke-width="3"/></svg>`
  };

  const snapTabs = [["following","Đang theo dõi"],["explore","Khám phá"],["liked","Đã thích"]];
  const username = entry => String(entry.author ?? entry.name ?? "Tài khoản Leonida");
  const playerName = () => String(data.player?.handle ?? data.player?.name ?? "Bạn");
  const snapAvatar = name => {
    const initials = name.replace(/^@/,"").split(/[._\s]+/).filter(Boolean).slice(0,2).map(part=>part[0]).join("").toUpperCase();
    const hue = [...name].reduce((sum,letter)=>(sum*31+letter.codePointAt(0))%360,0);
    return `<span class="snap-avatar" style="--avatar-hue:${hue}" aria-hidden="true">${escapeText(initials || "?")}</span>`;
  };

  function visiblePosts() {
    const following = (Array.isArray(data.following) ? data.following : []).map(name=>String(name).toLowerCase());
    return list(data.social).map((post,index)=>({post,index})).filter(({post,index}) => {
      if (state.snapTab === "liked") return state.liked.has(index);
      if (state.snapTab === "following") return post.following === true || following.includes(username(post).toLowerCase());
      return true;
    });
  }

  function snapMedia(post,index) {
    const description = String(post.imageDescription ?? post.mediaDescription ?? "").trim();
    const image = post.imageSvg ?? post.mediaSvg;
    const type = post.mediaType === "clip" ? "clip" : post.mediaType === "photo" || description || image ? "photo" : "text";
    if (type === "text" && !Object.hasOwn(scenes,post.scene)) return `<div class="snap-stage snap-poster">
      <span>${escapeText(post.posterLabel ?? "BÀI ĐĂNG")}</span><strong>${escapeText(post.headline ?? username(post))}</strong></div>`;
    const fallback = Object.hasOwn(scenes,post.scene) ? scenes[post.scene] : scenes[type === "clip" ? "canal" : "bait"];
    const media = cleanSvg(image);
    return `<div class="snap-stage">${media ? `<iframe sandbox="" title="Minh họa bài đăng" srcdoc="${escapeText(svgDocument(media))}"></iframe>` : fallback}
      <span class="snap-mark">${type === "clip" ? `<b>●</b> REC${post.duration ? " · "+escapeText(post.duration) : ""}` : "SNAPMATIC · ẢNH"}</span>
      ${description ? `<details class="snap-description" data-description="${index}"${state.hiddenDescriptions.has(index) ? "" : " open"}><summary>Mô tả cảnh</summary><p><em>${escapeText(description)}</em></p></details>` : ""}</div>`;
  }

  function social() {
    const entries = visiblePosts();
    const position = Math.max(0,entries.findIndex(entry=>entry.index===state.post));
    const tabs = snapTabs.map(([key,label])=>`<button type="button" data-snap-tab="${key}" aria-pressed="${state.snapTab===key}">${key==="explore" ? icon("eye") : ""}${label}</button>`).join("");
    const nav = `<nav class="snap-tabs" aria-label="Lọc bảng tin">${tabs}</nav>`;
    if (!entries.length) return `<div class="snap">${nav}<p class="snap-empty">${state.snapTab==="liked" ? "Chưa có bài nào được thích." : state.snapTab==="following" ? "Chưa có bài từ tài khoản đang theo dõi." : "Chưa có bài đăng."}</p></div>`;
    const {post,index} = entries[position];
    const name = username(post);
    const caption = post.caption ?? post.text ?? "";
    const liked = state.liked.has(index);
    const likes = Number.isFinite(post.likes) ? Math.max(0,post.likes) : 0;
    const comments = [...list(post.comments).filter(comment=>String(comment.text ?? "").trim()), ...(state.userComments.get(index) ?? [])];
    const canPin = Boolean(post.locationId && post.locationId === data.mapData?.locationId && gpsPoint(data.mapData.position));
    const location = post.locationLabel ?? (canPin ? data.mapData.location ?? data.location : "");
    const rows = comments.map((comment,i)=>{
      const author = username(comment);
      const isLiked = state.commentLikes.has(`${index}:${i}`);
      const count = Number.isFinite(comment.likes) ? Math.max(0,comment.likes) : 0;
      return `<li class="snap-comment">${snapAvatar(author)}<div><strong>${escapeText(author)}</strong>
        ${author===name ? " <small>Tác giả</small>" : ""} <time>${escapeText(comment.time)}</time><p>${escapeText(comment.text)}</p></div>
        <button type="button" class="snap-comment-like" data-comment-like="${i}" data-post="${index}" aria-label="Tim bình luận của ${escapeText(author)}" aria-pressed="${isLiked}">${isLiked ? "♥" : "♡"} ${count+Number(isLiked)}</button></li>`;
    }).join("");
    return `<div class="snap">${nav}<div class="snap-main">
      <section class="snap-media" aria-label="Khung hình bài đăng">${snapMedia(post,index)}
        <nav class="snap-nav" aria-label="Chuyển bài"><button type="button" data-snap-post="${entries[position-1]?.index ?? ""}"${position<=0 ? " disabled" : ""}>‹ Trước</button>
        <span aria-live="polite">${position+1} / ${entries.length}</span>
        <button type="button" data-snap-post="${entries[position+1]?.index ?? ""}"${position>=entries.length-1 ? " disabled" : ""}>Sau ›</button></nav></section>
      <article class="snap-detail" aria-label="Bài đăng và bình luận">
        <div class="snap-scroll" data-scroll="snap" tabindex="0">
          <header class="snap-author">${snapAvatar(name)}<strong>${escapeText(name)}</strong><time>${escapeText(post.time)}</time></header>
          ${location || canPin ? `<div class="snap-location">${icon("gps")} ${escapeText(location)} ${canPin ? appLink("gps","Ghim GPS",null,' data-origin="social"') : ""}</div>` : ""}
          <p class="snap-caption">${escapeText(caption)}</p>
          <button type="button" class="snap-like" data-snap-like="${index}" aria-pressed="${liked}">${liked ? "♥ Đã thích" : "♡ Thích"} · ${likes+Number(liked)}</button>
          <ul class="snap-comments" aria-label="Bình luận">${rows || '<li class="muted">Chưa có bình luận.</li>'}</ul>
        </div>
        <form class="snap-compose" data-post="${index}">
          <input name="comment" aria-label="Nhập bình luận" placeholder="Bình luận với tên ${escapeText(playerName())}" value="${escapeText(state.drafts.get(index) ?? "")}" maxlength="280" required>
          <button type="submit">Gửi</button>
        </form>
      </article></div></div>`;
  }

  function updateSnap(focusSelector,keepScroll=true) {
    const previous = app.querySelector(".snap-scroll")?.scrollTop ?? 0;
    renderApp();
    const scroll = app.querySelector(".snap-scroll");
    if (keepScroll && scroll) scroll.scrollTop = previous;
    app.querySelector(focusSelector)?.focus({preventScroll:true});
  }

  function snapClick(button) {
    const {snapTab,snapPost,snapLike,commentLike,post} = button.dataset;
    if (snapTab !== undefined) {
      state.snapTab = snapTab;
      state.post = visiblePosts()[0]?.index ?? 0;
      updateSnap(`[data-snap-tab="${snapTab}"]`,false);
    } else if (snapPost !== undefined) {
      if (!snapPost) return true;
      state.post = Number(snapPost);
      updateSnap('.snap-nav button:not(:disabled)',false);
    } else if (snapLike !== undefined) {
      const index = Number(snapLike);
      if (state.liked.has(index)) state.liked.delete(index);
      else state.liked.add(index);
      updateSnap(`[data-snap-like="${index}"]`);
    } else if (commentLike !== undefined) {
      const key = `${post}:${commentLike}`;
      if (state.commentLikes.has(key)) state.commentLikes.delete(key);
      else state.commentLikes.add(key);
      updateSnap(`[data-comment-like="${commentLike}"]`);
    } else {
      return false;
    }
    return true;
  }

  // GPS uses a 720 × 450 landscape scene. A wider viewport reveals more of the scene.
  const gpsWidth = 720;
  const gpsHeight = 450;
  const gpsPoint = point => Array.isArray(point) && point.length === 2 &&
    point.every((n, axis) => Number.isFinite(n) && n >= 0 && n <= [gpsWidth, gpsHeight][axis]);
  const extendedGpsPoint = point => Array.isArray(point) && point.length === 2 &&
    point.every((n, axis) => Number.isFinite(n) && Math.abs(n) <= 3 * [gpsWidth, gpsHeight][axis]);
  const gpsPoints = (points, min, check = gpsPoint) => Array.isArray(points) && points.length >= min &&
    points.length <= 100 && points.every(check) ? points.map(point => point.join(",")).join(" ") : "";

  const gpsKinds = {
    shop:{label:"Cửa hàng",art:'<path d="M3 9l2-5h14l2 5-2 3H5l-2-3Zm2 3v8h14v-8M9 20v-5h6v5"/>'},
    home:{label:"Nhà",art:'<path d="m3 11 9-7 9 7M5 10v10h5v-5h4v5h5V10"/>'},
    place:{label:"Địa điểm",art:'<path d="M19 10c0 5-7 10-7 10s-7-5-7-10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>'},
    mission:{label:"Nhiệm vụ",art:'<path d="M6 21V4m0 1h12l-3 4 3 4H6"/>'}
  };
  const gpsKind = kind => Object.hasOwn(gpsKinds,kind) ? kind : "place";
  const gpsGlyph = kind => `<g fill="none" stroke="#172023" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${gpsKinds[kind].art}</g>`;
  function edgePoint([x,y]) {
    const dx = x - gpsWidth / 2;
    const dy = y - gpsHeight / 2;
    const factor = Math.min((gpsWidth / 2 - 33) / Math.abs(dx), (gpsHeight / 2 - 35) / Math.abs(dy));
    return Number.isFinite(factor) ? [gpsWidth / 2 + dx * factor, gpsHeight / 2 + dy * factor] : [gpsWidth - 33,gpsHeight / 2];
  }

  function gpsPlaces() {
    const places = list(data.mapData?.pois).filter(place=>gpsPoint(place.point) && String(place.name ?? "").trim());
    const missions = data.missions.flatMap((mission,missionIndex) => {
      const location = mission.location;
      if (!extendedGpsPoint(location?.point)) return [];
      const offMap = location.offMap === true || !gpsPoint(location.point);
      return [{kind:"mission",name:mission.title,point:offMap ? edgePoint(location.point) : location.point,
        labelSide: location.labelSide,detail:[location.name,offMap ? "Ngoài khu vực bản đồ" : ""].filter(Boolean).join(" · "),
        offMap,status:missionStatus(mission),missionIndex}];
    });
    return [...places, ...missions];
  }

  function fitGpsMap() {
    const canvas = app.querySelector("[data-gps-canvas]");
    if (!canvas) return;
    const {clientWidth:width,clientHeight:height} = canvas.parentElement;
    if (!width || !height) return;
    const scale = Math.min(width / gpsWidth, height / gpsHeight);
    const sceneWidth = width / scale;
    const sceneHeight = height / scale;
    canvas.setAttribute("viewBox", `${(gpsWidth - sceneWidth) / 2} ${(gpsHeight - sceneHeight) / 2} ${sceneWidth} ${sceneHeight}`);
  }

  function gps() {
    const map = data.mapData ?? {};
    const fromPost = state.gpsOrigin === "social";
    const route = fromPost ? null : map.route;
    const routePoints = gpsPoints(route?.points, 2);
    const current = gpsPoint(map.position) ? map.position : null;
    const destination = route?.destination || (routePoints ? "Điểm đến" : "");
    const location = map.location ?? data.location;
    const stats = routePoints ? [route.distance, route.duration].filter(Boolean).map(escapeText).join(" · ") : "";
    const areas = list(map.areas).map(area => {
      const points = gpsPoints(area.points, 3, extendedGpsPoint);
      const kind = ["water","park","lot"].includes(area.kind) ? area.kind : "block";
      return points ? `<polygon class="gps-area-${kind}" points="${points}"/>` : "";
    }).join("");
    const roads = list(map.roads).map(road => {
      const points = gpsPoints(road.points, 2, extendedGpsPoint);
      if (!points) return "";
      const line = `points="${points}"`;
      if (road.kind === "shore") return `<polyline class="gps-shore" ${line}/>`;
      if (road.kind === "main") return `<polyline class="gps-road casing" ${line}/><polyline class="gps-road main-road" ${line}/>`;
      return `<polyline class="gps-road${road.kind === "minor" ? " minor" : ""}" ${line}/>`;
    }).join("");
    const labels = list(map.labels).map(label => gpsPoint(label.point) ?
      `<text class="gps-district-label${label.kind === "water" ? " water-label" : ""}" x="${label.point[0]}" y="${label.point[1]}" text-anchor="middle">${escapeText(label.text)}</text>` : "").join("");
    const places = gpsPlaces();
    const markers = places.map((place,index) => {
      const kind = gpsKind(place.kind);
      const below = place.labelSide === "bottom" || place.point[1] < 52;
      const status = place.status ? ` data-status="${place.status}"` : "";
      const anchor = place.point[0] < 75 ? "start" : place.point[0] > gpsWidth - 75 ? "end" : "middle";
      const accessibleName = [gpsKinds[kind].label,place.name,missionStates[place.status],place.offMap ? "Ngoài khu vực bản đồ" : ""].filter(Boolean).join(" · ");
      return `<g class="gps-poi" data-kind="${kind}" data-gps-poi="${index}"${status} data-off-map="${Boolean(place.offMap)}" transform="translate(${place.point.join(" ")})"
        role="button" tabindex="0" aria-pressed="${state.gpsPoi === index}" aria-label="${escapeText(accessibleName)}">
        <circle r="23" fill="#000" fill-opacity="0"/><circle class="gps-poi-badge" r="14"/>
        <g transform="translate(-9 -9) scale(.75)">${gpsGlyph(kind)}</g>
        <text class="gps-poi-label" y="${below ? 31 : -20}" text-anchor="${anchor}">${escapeText(place.name)}</text>
      </g>`;
    }).join("");
    const pin = routePoints ? route.points.at(-1) : fromPost && current ? current : null;
    const mapArt = current || pin || areas || roads || labels || markers ? `<svg data-gps-canvas viewBox="0 0 720 450" role="group" aria-labelledby="gps-map-title">
      <title id="gps-map-title">${escapeText(destination ? `GPS từ ${location ?? "vị trí hiện tại"} đến ${destination}` : `GPS · ${location ?? "Vị trí hiện tại"}`)}</title>
      ${areas}${roads}${labels}
      ${routePoints ? `<polyline class="gps-route shadow" points="${routePoints}"/><polyline class="gps-route" points="${routePoints}"/>` : ""}
      ${pin ? `<g aria-hidden="true" transform="translate(${pin.join(" ")})"><path d="M0-27a11 11 0 0 1 11 11C11-9 0 1 0 1S-11-9-11-16A11 11 0 0 1 0-27Z" fill="var(--gps-route)" stroke="#2f201e" stroke-width="2"/><circle cy="-16" r="3.5" fill="#2f201e"/></g>` : ""}
      ${current ? `<g aria-hidden="true" transform="translate(${current.join(" ")})"><circle r="15" fill="var(--gps-position)" opacity=".22"/><circle r="8" fill="var(--gps-position)" stroke="#172e33" stroke-width="3"/></g>` : ""}
      ${markers}
    </svg>` : empty("Chưa có sơ đồ cho khu vực này.");
    const legend = places.length ? `<ul class="gps-legend" aria-label="Chú thích bản đồ">${Object.entries(gpsKinds).map(([kind,style]) =>
      `<li class="gps-key" data-kind="${kind}"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${gpsGlyph(kind)}</svg><span>${style.label}</span></li>`).join("")}</ul>` : "";
    const selected = places[state.gpsPoi];
    const selectedKind = selected ? missionStates[selected.status] ?? gpsKinds[gpsKind(selected.kind)].label : "";
    const detail = routePoints ? route.detail : fromPost ? "Điểm ghim từ bài đăng." :
      destination ? "Chưa có dữ liệu tuyến đường." : current ? "Đang hiển thị vị trí hiện tại." : "Đang chờ dữ liệu vị trí.";
    return `<div class="gps-layout"><div class="gps-map">${mapArt}</div><section class="gps-info" aria-label="Thông tin GPS">
      <div aria-live="polite"><p class="gps-location"><span class="gps-dot" aria-hidden="true"></span>${location ? `Vị trí hiện tại · ${escapeText(location)}` : "Chưa rõ vị trí hiện tại"}</p>
      ${selected ? `<h3>${escapeText(selected.name)}</h3><p class="gps-detail">${escapeText([selectedKind,selected.detail].filter(Boolean).join(" · "))}</p>
        ${Number.isInteger(selected.missionIndex) ? appLink("missions","Xem nhiệm vụ",selected.missionIndex) : ""}
        <button type="button" class="chip" data-gps-reset>Về chỉ đường</button>` :
        `<h3>${escapeText(destination || (fromPost ? "Điểm ghim Snapmatic" : "Chưa có điểm đến"))}</h3>
        ${stats ? `<p class="gps-stats">${stats}</p>` : ""}${detail ? `<p class="gps-detail">${escapeText(detail)}</p>` : ""}`}
      </div>${missionStatusBox()}${legend}
    </section></div>`;
  }

  function cleanSvg(markup) {
    if (typeof markup !== "string" || markup.length > 120000) return null;
    const namespace = "http://www.w3.org/2000/svg";
    const tags = new Set("svg g path rect circle ellipse line polyline polygon text tspan title desc".split(" "));
    const attributes = new Set("viewBox preserveAspectRatio role aria-label x y x1 x2 y1 y2 cx cy r rx ry width height d points fill fill-opacity stroke stroke-width stroke-opacity stroke-linejoin stroke-linecap stroke-dasharray opacity transform font-family font-size font-weight text-anchor dominant-baseline".split(" "));
    const fragment = document.createElement("template");
    fragment.innerHTML = markup.trim();
    const source = fragment.content.querySelector("svg");
    function copyShape(original) {
      if (original.namespaceURI !== namespace || !tags.has(original.localName)) return null;
      const shape = document.createElementNS(namespace,original.localName);
      for (const {name,value} of original.attributes) {
        if (attributes.has(name) && !/url\s*\(/i.test(value)) shape.setAttribute(name,value);
      }
      for (const child of original.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) shape.append(child.textContent);
        if (child.nodeType === Node.ELEMENT_NODE) {
          const safeChild = copyShape(child);
          if (safeChild) shape.append(safeChild);
        }
      }
      return shape;
    }
    if (source && source.querySelectorAll("*").length > 500) return null;
    const map = source ? copyShape(source) : null;
    if (!map || !map.childElementCount) return null;
    map.setAttribute("xmlns",namespace);
    if (!map.hasAttribute("viewBox")) map.setAttribute("viewBox","0 0 570 230");
    map.setAttribute("width","100%");
    map.setAttribute("height","100%");
    return map.outerHTML;
  }

  function svgDocument(content) {
    return `<!doctype html><html lang="vi"><meta charset="utf-8">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
      <style>html,body{margin:0;height:100%;overflow:hidden;background:#181d2e}svg{display:block}</style>
      ${content}</html>`;
  }

  const views = {whatup:messages,calls,gps,missions,buckme:transactions,contacts,social,inventory};

  function renderApp() {
    const key = state.page;
    const previous = key === "gps" && state.gpsOrigin === "social" ? appLink("social","Về Snapmatic") : "";
    app.className = `app view-${key}`;
    app.innerHTML = `<header class="app-head">${tile(key)}<h2 id="app-title" tabindex="-1">${apps[key].label}</h2>
      <button type="button" class="back" data-app="home">${icon("home")} <span>Màn hình chính</span></button>${previous}</header>
      <div class="app-body" data-scroll="app">${views[key]()}</div>`;
    if (key === "contacts") filterContacts();
    if (key === "gps") fitGpsMap();
    const chat = app.querySelector(".chat-pane");
    if (chat) chat.scrollTop = chat.scrollHeight;
  }

  function open(page) {
    if (page !== "home" && !Object.hasOwn(apps,page)) return;
    const previous = state.page;
    const isHome = page === "home";
    state.page = page;
    if (page === "whatup" && data.threads[state.thread]) state.read.add(state.thread);
    byId("home").hidden = !isHome;
    byId("workspace").hidden = isHome;
    byId("main").classList.toggle("open",!isHome);
    renderNavigation();
    if (isHome) {
      byId("main").querySelector(`[data-app="${previous}"]`)?.focus({preventScroll:true});
    } else {
      renderApp();
      app.animate?.([{opacity:.68},{opacity:1}],{
        duration:matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 160
      });
      app.querySelector("h2")?.focus({preventScroll:true});
    }
  }

  const trackedScroll = () => [...app.querySelectorAll("[data-scroll]")];
  byId("main").addEventListener("click",event => {
    const marker = event.target.closest("[data-gps-poi]");
    if (marker) {
      const index = Number(marker.dataset.gpsPoi);
      state.gpsPoi = state.gpsPoi === index ? -1 : index;
      renderApp();
      app.querySelector(`[data-gps-poi="${index}"]`)?.focus({preventScroll:true});
      return;
    }
    const target = event.target.closest("button");
    if (!target) return;
    if (target.hasAttribute("data-gps-reset")) {
      const index = state.gpsPoi;
      state.gpsPoi = -1;
      renderApp();
      app.querySelector(`[data-gps-poi="${index}"]`)?.focus({preventScroll:true});
      return;
    }
    if (state.page === "social" && snapClick(target)) return;
    const {app:destination,select:selection,index:rawIndex,origin} = target.dataset;
    const index = Number(rawIndex);
    const filter = target.dataset.missionFilter;
    if (Object.hasOwn(missionStates,filter) && !destination) {
      state.missionFilter = filter;
      renderApp();
      app.querySelector(`[data-mission-filter="${filter}"]`)?.focus({preventScroll:true});
      return;
    }
    if (destination) {
      if (destination === "gps") {
        state.gpsOrigin = origin ?? "";
        state.gpsPoi = Number.isInteger(index) ? index : -1;
      }
      if (destination === "whatup" && Number.isInteger(index)) state.thread = index;
      if (destination === "calls" && Number.isInteger(index)) state.call = index;
      if (destination === "missions") {
        if (data.missions[index]) {
          state.mission = index;
          state.missionFilter = missionStatus(data.missions[index]);
        } else if (Object.hasOwn(missionStates,filter)) {
          state.missionFilter = filter;
        }
      }
      open(destination);
      return;
    }
    if (!selection || !Number.isInteger(index)) return;
    state[selection] = index;
    if (selection === "thread") {
      state.read.add(index);
      renderNavigation();
    }
    const scroll = new Map(trackedScroll().map(node=>[node.dataset.scroll,node.scrollTop]));
    renderApp();
    for (const node of trackedScroll()) node.scrollTop = scroll.get(node.dataset.scroll) ?? 0;
    app.querySelector(`[data-select="${selection}"][data-index="${index}"]`)?.focus({preventScroll:true});
  });

  app.addEventListener("keydown",event => {
    const marker = event.target.closest("[data-gps-poi]");
    if (!marker || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    marker.dispatchEvent(new MouseEvent("click",{bubbles:true}));
  });
  if (typeof ResizeObserver === "function") new ResizeObserver(fitGpsMap).observe(app);

  app.addEventListener("toggle",event => {
    const index = event.target.dataset.description;
    if (index === undefined) return;
    if (event.target.open) state.hiddenDescriptions.delete(Number(index));
    else state.hiddenDescriptions.add(Number(index));
  },true);

  app.addEventListener("submit",event => {
    if (!event.target.matches(".snap-compose")) return;
    event.preventDefault();
    const index = Number(event.target.dataset.post);
    const text = event.target.elements.comment.value.trim().slice(0,280);
    if (!text) return;
    const comments = state.userComments.get(index) ?? [];
    comments.push({author:playerName(),text,time:"Vừa xong",likes:0});
    state.userComments.set(index,comments);
    state.drafts.delete(index);
    updateSnap(".snap-compose input");
    const scroll = app.querySelector(".snap-scroll");
    scroll.scrollTop = scroll.scrollHeight;
  });

  app.addEventListener("input",event => {
    if (event.target.name === "comment" && event.target.form?.matches(".snap-compose")) {
      state.drafts.set(Number(event.target.form.dataset.post),event.target.value);
      return;
    }
    if (event.target.id !== "contact-search") return;
    state.contactQuery = event.target.value;
    filterContacts();
  });

  byId("home-button").addEventListener("click", () => open("home"));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && state.page !== "home") open("home");
  });

  byId("wallpaper-image").addEventListener("error", event => { event.currentTarget.hidden = true; });
  window.GTA_PHONE = Object.freeze({render: setData});
  setData(readJson("PHONE_DATA", {}));
})();
  } catch (error) {
    console.error(error);
    window.gtaPhoneLoadError?.();
  }
})();
