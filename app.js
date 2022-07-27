// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D 사용
const canvas = document.getElementById("jsCanvas"); // 캔버스 불러오기
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange"); // 선 굵기
const mode = document.getElementById("jsMode"); // 버튼
const saveBtn = document.getElementById("jsSave"); // save 버튼 기능 만들기

// 텍스트 입력 정의
const font = "14px sans-serif"; // 폰트 정의 <<<<<<<<<<<<<<<<<< 0721
// let rangeValue;
// let color;
// let mouse = false;

const INITIAL_COLOR = "#2c2c2c"; // 디폴트 값
const CANVAS_SIZE = 700;

// canvas element는 2개의 사이즈를 가져야함(css와 이것) css로 캔버스를 그리고 있으나, 픽셀을 다루는 엘리먼트로 그리고 있으니까 엘리멘트에도 canvas의 사이즈를 지정해줘야 선을 그릴 수 있음
// pixel modifier에 사이즈를 줌
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.fillStyle = "white"; //fill과 stroke을 검은색 디폴트로 하기 전에 캔버스 배경색 설정
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

ctx.strokeStyle = INITIAL_COLOR; // 선 색의 디폴트값
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = "2.5"; // 그리는 선의 굵기

let painting = false; // 클릭 이벤트에 대해서 페인팅 추가
let filling = false;

function stopPainting() {
  painting = false;
}

function startPainting() {
  painting = true;
}

function onMouseMove(event) {
  // 마우스 이벤트 주기
  const x = event.offsetX; // 캔버스 위 마우스 좌표 정보 가져오기
  const y = event.offsetY;
  if (!painting) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
  // console.log(x, y); // x와 y의 값을 브라우저 콘솔 로그에 찍어줌
}

function handleColorClick(event) {
  const color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

function handleRangeChange(event) {
  const size = event.target.value;
  ctx.lineWidth = size;
}

function handleModeClick() {
  if (filling === true) {
    filling = false;
    mode.innerHTML = "Fill"; // paint 동작 시 버튼 노출
  } else {
    filling = true;
    mode.innerText = "Paint"; // fill 동작 시 버튼 노출
    ctx.fillStyle = ctx.strokeStyle; // 색채우기와 색상버튼의 색이 같도록
  }
}

function handleModeClick() {
  if (filling === true) {
    filling = false;
    mode.innerText = "Fill";
  } else {
    filling = true;
    mode.innerText = "Paint";
  }
}

function handleCanvasClick() {
  if (filling) {
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); // FILL 모드가 아닐 경우, 페인팅 되도록
  }
}

function handleCM(event) {
  event.preventDefault(); // 마우스 오른쪽 이미지 저장 키이벤트 불가
}

function handleSaveClick() {
  const image = canvas.toDataURL(); // 이미지 저장 타입을 만듬, 기본 png
  const link = document.createElement("a"); // 이미지 링크를 만듬
  link.href = image; // href는 image(url)가 되어야 하고
  link.download = "PaintJS[EXPORT]"; // 다운로드는 이름을 가지고 있어야 저장 네임이 설정됨
  link.click();
}

if (canvas) {
  // 캔버스가 있는지 찾기
  canvas.addEventListener("mousemove", onMouseMove); // 마우스가 움직였을때 설정
  canvas.addEventListener("mousedown", startPainting); // 마우스 클릭했을때 발생하는 설정
  canvas.addEventListener("mouseup", stopPainting); //마우스 클릭 후 땠을때 발생하는 설정
  canvas.addEventListener("mouseleave", stopPainting); // 마우스가 캔버스 벗어나면 발생하는 설정, stopPainting을 직접 입력
  canvas.addEventListener("click", handleCanvasClick); // 색채워넣기 fill
  canvas.addEventListener("contextmenu", handleCM); // 마우스 오른쪽 금지
}

Array.from(colors).forEach((color) =>
  color.addEventListener("click", handleColorClick)
);
// object로 부터 array 만드는 array.form 메소드 호출
// color네임은 array안에 있는 각 아이템들을 대표하는 것 아무거나 넣어줘도 됨

if (range) {
  range.addEventListener("input", handleRangeChange);
}

if (mode) {
  mode.addEventListener("click", handleModeClick);
}

if (saveBtn) {
  saveBtn.addEventListener("click", handleSaveClick);
}

/* 기능 추가 */

/* 이미지 불러오기 추가 < 0715 */
document.getElementById("img1").addEventListener("click", imageLoadCanvas); // 클릭 이벤트
const img = new Image();

img.src = "img/owl-937740_640.jpg";
function imageLoadCanvas() {
  console.log("click buntton");
  const ptrn = ctx.createPattern(img, "repeat"); // Create a pattern with this image, and set it to "repeat".
  ctx.fillStyle = ptrn;
  ctx.fillRect(0, 0, canvas.width, canvas.height); // context.fillRect(x, y, width, height);
}

/* 텍스트 입력 기능 추가 <<<<< 0722 */
// 텍스트 입력

let hasInput = false;
let txtBox = document.getElementById("txtTest");
txtBox.style.display = "none";

canvas.ondblclick = function (e) {
  if (hasInput) return;
  addInput(e.offsetX, e.offsetY);
  console.log(e.offsetX);
  console.log(e.offsetY);
};

function addInput(x, y) {
  const input = document.createElement("input");
  txtBox.style.display = "block";

  input.type = "text";
  input.style.position = "absolute";
  input.style.left = x + "px";
  input.style.top = y + "px";

  input.onkeydown = handleEnter;

  txtBox.appendChild(input);

  input.focus();

  hasInput = true;
}

//Key handler for input box:
function handleEnter(e) {
  let keyCode = e.keyCode;
  if (keyCode === 13) {
    drawText(this.value, parseInt(this.style.left), parseInt(this.style.top));
    txtBox.removeChild(this);
    hasInput = false;
  }
}

// Draw the text onto canvas:
function drawText(txt, x, y) {
  ctx.font = font;
  ctx.fillStyle = "#000";
  ctx.fillText(txt, x, y);
  txtBox.style.display = "none";

  console.log(hasInput);
}

function getImageFiles(e) {
  const file = e.target.files[0];
  console.log(file);
  const reader = new FileReader();
  const img = new Image();

  reader.readAsDataURL(file);
  reader.onload = (e) => {
    img.src = e.target.result;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  };

  res.appendChild(canvas);
}

const input = document.querySelector("#real-input");
const upBtn = document.querySelector("#jsUpload");

upBtn.addEventListener("click", () => input.click());

if (input) {
  input.addEventListener("change", getImageFiles);
}

// 글자 입력 참고1 : https://developer.mozilla.org/ko/docs/Web/API/Canvas_API/Tutorial/Drawing_text
// 글자 입력 참고2 : https://stackoverflow.com/questions/21011931/how-to-embed-an-input-or-textarea-in-a-canvas-element
// 글자 입력 참고3 : https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=websearch&logNo=221571168786 // 한국블로그

// 이미지 업로드 참고 : https://juni-official.tistory.com/209
