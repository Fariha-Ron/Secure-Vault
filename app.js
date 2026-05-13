let MASTER = localStorage.getItem("master") || "1234";
let vault = JSON.parse(localStorage.getItem("vault")) || [];

/* 🔐 LOGIN */
function unlock() {
  const input = document.getElementById("masterKey");

  if (input.value === MASTER) {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").classList.remove("hidden");
    render();
  } else {
    alert("Wrong Master Password");
  }
}

/* ⚠️ RESET */
function resetMaster() {
  if (!confirm("This will DELETE ALL saved passwords")) return;

  localStorage.clear();
  vault = [];

  const newPass = prompt("Set new Master Password:");
  if (!newPass) return;

  MASTER = newPass;
  localStorage.setItem("master", MASTER);

  alert("Vault reset successful");
  location.reload();
}

/* 📏 LENGTH */
function updateLen() {
  const len = document.getElementById("length");
  const val = document.getElementById("lenVal");

  val.innerText = len.value;
}

/* 🎲 GENERATE PASSWORD (FIXED) */
function gen() {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const nums  = "0123456789";
  const syms  = "@#$%&*!?";

  let chars = "";

  if (document.getElementById("upper").checked) chars += upper;
  if (document.getElementById("lower").checked) chars += lower;
  if (document.getElementById("num").checked) chars += nums;
  if (document.getElementById("sym").checked) chars += syms;

  if (chars === "") {
    alert("Select at least one option!");
    return;
  }

  const len = parseInt(document.getElementById("length").value);

  let password = "";
  for (let i = 0; i < len; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  document.getElementById("pass").value = password;
  checkStrength();
}

/* 🔐 STRENGTH */
function checkStrength() {
  const p = document.getElementById("pass").value;
  const s = document.getElementById("strength");

  if (!p) {
    s.textContent = "Strength: -";
    s.className = "strength";
    return;
  }

  let score = 0;

  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[@#$%&*!?]/.test(p)) score++;

  if (score <= 1) {
    s.textContent = "Strength: Weak";
    s.className = "strength weak";
  } else if (score <= 3) {
    s.textContent = "Strength: Medium";
    s.className = "strength medium";
  } else {
    s.textContent = "Strength: Strong";
    s.className = "strength strong";
  }
}

/* 📋 COPY */
function copyPass(text) {
  const val = text || document.getElementById("pass").value;
  navigator.clipboard.writeText(val);
}

/* 💾 SAVE */
function save() {
  const site = document.getElementById("site").value;
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  if (!site || !user || !pass) return;

  vault.push({ site, user, pass, show: false });
  localStorage.setItem("vault", JSON.stringify(vault));

  render();
}

/* 🗑 DELETE */
function del(i) {
  vault.splice(i, 1);
  localStorage.setItem("vault", JSON.stringify(vault));
  render();
}

/* 👁 TOGGLE */
function toggle(i) {
  vault[i].show = !vault[i].show;
  localStorage.setItem("vault", JSON.stringify(vault));
  render();
}

/* 🔍 RENDER */
function render() {
  const search = document.getElementById("search").value.toLowerCase();
  const list = document.getElementById("list");

  list.innerHTML = "";

  vault
    .filter(v =>
      v.site.toLowerCase().includes(search) ||
      v.user.toLowerCase().includes(search)
    )
    .forEach((v, i) => {
      list.innerHTML += `
        <div class="item">
          <div>
            🌐 ${v.site}<br>
            👤 ${v.user}<br>
            🔐 ${v.show ? v.pass : "••••••••"}
          </div>

          <div class="actions">
            <button onclick="copyPass('${v.pass}')">Copy</button>
            <button onclick="toggle(${i})">Show</button>
            <button onclick="del(${i})">Delete</button>
          </div>
        </div>
      `;
    });
}

/* 🌌 BACKGROUND */
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let dots = Array.from({ length: 80 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 2,
  dx: (Math.random() - 0.5),
  dy: (Math.random() - 0.5)
}));

function animate() {
  ctx.fillStyle = "#05060a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  dots.forEach(d => {
    d.x += d.dx;
    d.y += d.dy;

    if (d.x < 0 || d.x > canvas.width) d.dx *= -1;
    if (d.y < 0 || d.y > canvas.height) d.dy *= -1;

    ctx.beginPath();
    ctx.fillStyle = "#00c6ff";
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#00c6ff";
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();