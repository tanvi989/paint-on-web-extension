if (document.getElementById("paint-canvas")) {
  document.getElementById("paint-canvas").remove();
  const menu = document.getElementById("custom-context-menu");
  if (menu) menu.remove();
} else {
  // Global state
  window.currentColor = "#ffbb00";
  window.currentLineWidth = 8;
  window.erasing = false;

  const canvas = document.createElement("canvas");
  canvas.id = "paint-canvas";
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.zIndex = 10000;
  canvas.style.pointerEvents = "auto";
  canvas.style.backgroundColor = "transparent"; // Make canvas see-through
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  ctx.lineCap = "round";

  // No white fill here — canvas is transparent

  let drawing = false;

  function startDrawing(x, y) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(x, y) {
    if (!drawing) return;
    ctx.strokeStyle = window.erasing ? "rgba(0,0,0,0)" : window.currentColor;
    ctx.lineWidth = window.currentLineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function stopDrawing() {
    drawing = false;
    ctx.beginPath();
  }

  // Mouse events
  canvas.addEventListener("mousedown", (e) => {
    if (e.button === 2) return;
    startDrawing(e.clientX, e.clientY);
  });

  canvas.addEventListener("mousemove", (e) => draw(e.clientX, e.clientY));
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseleave", stopDrawing);

  // Touch support
  canvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startDrawing(touch.clientX, touch.clientY);
  });

  canvas.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    draw(touch.clientX, touch.clientY);
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener("touchend", stopDrawing);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      canvas.remove();
      const menu = document.getElementById("custom-context-menu");
      if (menu) menu.remove();
    }
  });

  // === Tools ===
  const menu = document.createElement("div");
  menu.id = "custom-context-menu";
  menu.style.position = "fixed";
  menu.style.display = "none";
  menu.style.background = "#fff";
  menu.style.border = "1px solid #ccc";
  menu.style.padding = "10px";
  menu.style.zIndex = 10001;

  // 👉 Add your name as a title
const title = document.createElement("div");
title.textContent = "🎨 Tanvi's Paint";
title.style.fontWeight = "bold";
title.style.marginBottom = "8px";
title.style.fontFamily = "sans-serif";
title.style.color = "#000"; // ← set text color to black

menu.appendChild(title);  // ⬅️ Append title to menu

  // Buttons and inputs
  const eraseBtn = document.createElement("button");
  eraseBtn.textContent = "Toggle Erase";
  eraseBtn.addEventListener("click", () => window.erasing = !window.erasing);
eraseBtn.style.color = "#000"; // ← set text color to black


  const sizeLabel = document.createElement("label");
  sizeLabel.textContent = "Size: ";
  const sizeInput = document.createElement("input");
  sizeInput.type = "range";
  sizeInput.min = 1;
  sizeInput.max = 30;
  sizeInput.value = window.currentLineWidth;
  sizeInput.addEventListener("input", () => window.currentLineWidth = parseInt(sizeInput.value));
  sizeLabel.appendChild(sizeInput);

  const colorLabel = document.createElement("label");
  colorLabel.textContent = " Color: ";
  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.value = window.currentColor;
  colorInput.addEventListener("change", () => {
    window.currentColor = colorInput.value;
    window.erasing = false;
  });
  colorLabel.appendChild(colorInput);

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save Drawing";
  saveBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  // Add to menu
  menu.appendChild(eraseBtn);
  menu.appendChild(document.createElement("br"));
  menu.appendChild(sizeLabel);
  menu.appendChild(document.createElement("br"));
  menu.appendChild(colorLabel);
  menu.appendChild(document.createElement("br"));
  menu.appendChild(saveBtn);

  document.body.appendChild(menu);

  canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    menu.style.display = "block";
    menu.style.left = e.pageX + "px";
    menu.style.top = e.pageY + "px";
  });

  document.addEventListener("click", () => {
    menu.style.display = "none";
  });
}
