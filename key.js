"use strict";

document.addEventListener("DOMContentLoaded", () => {

const API_URL = "https://api-server-key.tranphat1357t.workers.dev";

// ===== DEVICE ID =====
function getDeviceId() {
  let id = localStorage.getItem("device_id");

  if (!id) {
    id = "DEV-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    localStorage.setItem("device_id", id);
  }

  return id;
}

// ===== TIME =====
function getTime() {
  return new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh"
  });
}

// ===== DEVICE INFO =====
function getDevice() {
  return navigator.platform + " | " + navigator.userAgent.slice(0, 40);
}

// ===== UI =====
const overlay = document.createElement("div");

overlay.innerHTML = `
<div id="eliteUI">
  <div class="box">
    <div class="title">⚡ ELITE TURBO</div>

    <div class="label">MÃ KÍCH HOẠT</div>

    <div class="row">
      <input id="keyInput" class="input" placeholder="VIP-XXX-XXX">
      <button id="pasteBtn" class="btn gray">DÁN</button>
      <button id="clearBtn" class="btn red">XÓA</button>
    </div>

    <div class="label">MÃ THIẾT BỊ</div>

    <div class="row">
      <input id="deviceId" class="input" readonly>
      <button id="copyBtn" class="btn gray">SAO CHÉP</button>
    </div>

    <div class="row">
      <button id="checkBtn" class="btn">CHECK</button>
      <button id="activeBtn" class="btn">MỞ</button>
    </div>

    <button id="resetBtn" class="btn gray" style="margin-top:8px;">
      RESET
    </button>

    <div class="info">
      UID: <span id="uid"></span><br>
      DEVICE: <span id="device"></span>
    </div>

    <div id="status" class="status">Đang chờ...</div>
    <div id="time" class="time"></div>
  </div>
</div>
`;

window.addEventListener("load", () => {
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
});

// ===== SET INFO =====
const deviceId = getDeviceId();

setTimeout(() => {

document.getElementById("deviceId").value = deviceId;
document.getElementById("uid").innerText = deviceId;
document.getElementById("device").innerText = getDevice();

}, 100);

// ===== TIME =====
setInterval(() => {

  const el = document.getElementById("time");

  if (el) {
    el.innerText = getTime();
  }

}, 1000);

// ===== API =====
async function verifyKey(key) {

  try {

    const res = await fetch(API_URL + "/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        key,
        deviceId
      })
    });

    return await res.json();

  } catch (e) {

    return {
      ok: false,
      error: "Không kết nối được server"
    };

  }
}

async function activateKey(key) {

  try {

    const res = await fetch(API_URL + "/api/activate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        key,
        deviceId
      })
    });

    return await res.json();

  } catch (e) {

    return {
      ok: false,
      error: "Server lỗi"
    };

  }
}

// ===== INIT BUTTON =====
setTimeout(() => {

const status = document.getElementById("status");

document.getElementById("pasteBtn").onclick = async () => {

  try {

    const text = await navigator.clipboard.readText();
    document.getElementById("keyInput").value = text;

  } catch {}

};

document.getElementById("clearBtn").onclick = () => {
  document.getElementById("keyInput").value = "";
};

document.getElementById("copyBtn").onclick = () => {

  navigator.clipboard.writeText(deviceId);

  status.innerText = "📋 Đã copy UID";
};

document.getElementById("resetBtn").onclick = () => {

  localStorage.removeItem("vip_key");
  location.reload();

};

document.getElementById("checkBtn").onclick = async () => {

  const key = document.getElementById("keyInput").value;

  status.innerText = "Đang check...";

  const res = await verifyKey(key);

  if (res.ok) {
    status.innerText = "✅ Key hợp lệ";
  } else {
    status.innerText = "❌ " + (res.error || "Key lỗi");
  }
};

document.getElementById("activeBtn").onclick = async () => {

  const key = document.getElementById("keyInput").value;

  status.innerText = "Đang kích hoạt...";

  const res = await activateKey(key);

  if (res.ok) {

    localStorage.setItem("vip_key", key);

    status.innerText = "✅ Thành công!";

    setTimeout(() => {

      const ui = document.getElementById("eliteUI");

      if (ui) ui.remove();

      document.body.style.overflow = "auto";

    }, 500);

  } else {

    status.innerText = "❌ " + (res.error || "Kích hoạt lỗi");

  }
};

// ===== AUTO LOGIN =====
(async () => {

  const key = localStorage.getItem("vip_key");

  if (!key) return;

  const res = await verifyKey(key);

  if (res.ok) {

    const ui = document.getElementById("eliteUI");

    if (ui) ui.remove();

    document.body.style.overflow = "auto";
  }

})();

}, 300);

});
