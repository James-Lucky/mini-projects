const uploadBox = document.querySelector(".upload-box"),
  previewImg = uploadBox.querySelector("img"),
  fileInput = uploadBox.querySelector("input"),
  widthInput = document.querySelector(".width input"),
  heightInput = document.querySelector(".height input"),
  ratioInput = document.querySelector(".ratio input"),
  qualityInput = document.querySelector(".quality input"),
  downloadBtn = document.querySelector(".download-btn"),
  wrapper = document.querySelector(".wrapper");

let ogImageRatio;

// Function to handle loading selected or dropped image file
const loadFile = (file) => {
  if (!file || !file.type.startsWith("image/")) return;

  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    widthInput.value = previewImg.naturalWidth;
    heightInput.value = previewImg.naturalHeight;
    ogImageRatio = previewImg.naturalWidth / previewImg.naturalHeight;
    wrapper.classList.add("active");
  });
};

// Input file change event
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  loadFile(file);
});

// Update height dynamically when width changes if ratio is locked
widthInput.addEventListener("keyup", () => {
  const height = ratioInput.checked
    ? widthInput.value / ogImageRatio
    : heightInput.value;
  heightInput.value = Math.floor(height) || "";
});

// Update width dynamically when height changes if ratio is locked
heightInput.addEventListener("keyup", () => {
  const width = ratioInput.checked
    ? heightInput.value * ogImageRatio
    : widthInput.value;
  widthInput.value = Math.floor(width) || "";
});

// Canvas Resize, Compress & Download Image
const resizeAndDownload = () => {
  const canvas = document.createElement("canvas");
  const a = document.createElement("a");
  const ctx = canvas.getContext("2d");

  // If quality checkbox is checked, compress by 50% (0.5), else 100% (1.0)
  const imgQuality = qualityInput.checked ? 0.5 : 1.0;

  // Set canvas dimensions according to user inputs
  canvas.width = parseInt(widthInput.value) || previewImg.naturalWidth;
  canvas.height = parseInt(heightInput.value) || previewImg.naturalHeight;

  // Draw image on canvas
  ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);

  // Convert canvas to Data URL and trigger download
  a.href = canvas.toDataURL("image/jpeg", imgQuality);
  a.download = `image-${new Date().getTime()}.jpg`;
  a.click();
};

downloadBtn.addEventListener("click", resizeAndDownload);

// Open file dialog when clicking upload box
uploadBox.addEventListener("click", () => fileInput.click());

// Drag and drop support
uploadBox.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadBox.style.borderColor = "#927dfc";
});

uploadBox.addEventListener("dragleave", () => {
  uploadBox.style.borderColor = "#afafaf";
});

uploadBox.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadBox.style.borderColor = "#afafaf";
  const file = e.dataTransfer.files[0];
  loadFile(file);
});
