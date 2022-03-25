import { Chance } from "chance";
import html2canvas from "html2canvas";

const CANVAS_COUNT = 40;

const chance = new Chance();

export async function applySnapEffect(originalElement: HTMLElement) {
  const canvas = await html2canvas(originalElement, {
    backgroundColor: null, //transparent
    width: parseInt(getComputedStyle(originalElement).width),
    height: parseInt(getComputedStyle(originalElement).height),
  });
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // create more no. of empty imageData equal to this ImageData Length based on Canvas Count
  const imageDataArray = createBlankImageDataArray(imageData);

  // put pixel info to imageDataArray (Weighted Distributed)
  const rawPixelArr = imageData.data;
  for (let i = 0; i < rawPixelArr.length; i += 4) {
    //find the highest probability canvas the pixel should be in
    const p = Math.floor((i / rawPixelArr.length) * CANVAS_COUNT);
    const a = imageDataArray[weightedRandom(p)];
    a[i] = rawPixelArr[i];
    a[i + 1] = rawPixelArr[i + 1];
    a[i + 2] = rawPixelArr[i + 2];
    a[i + 3] = rawPixelArr[i + 3];
  }

  // Create a new canvas with the imageDataArray based on canvas count
  for (let i = 0; i < CANVAS_COUNT; i++) {
    const newCanvas = newCanvasFromImageData(
      imageDataArray[i],
      canvas.width,
      canvas.height
    );
    newCanvas.classList.add("dust");

    //TODO: is offset the right property?
    newCanvas.style.position = "absolute";
    newCanvas.style.left = `${originalElement.offsetLeft}px`;
    newCanvas.style.top = `${originalElement.offsetTop}px`;
    newCanvas.style.width = canvas.style.width;
    newCanvas.style.height = canvas.style.height;
    newCanvas.style.zIndex = "1";
    document.body.appendChild(newCanvas);
  }

  // hide original element before starting animation
  originalElement.style.visibility = "hidden";

  //apply animation
  const dusts = document.querySelectorAll<HTMLElement>(".dust");
  dusts.forEach((dust, index) => {
    setTimeout(() => {
      animateTransform(
        dust,
        100,
        -100,
        chance.integer({ min: -25, max: 25 }),
        800 + 110 * index, //TODO: adjust duration
        20 * index //TODO: adjust fade out delay
      );
    }, 60 * index); //TODO: adjust delay for each dust animation
  });
}

// create empty imageData equal to original ImageData Length
function createBlankImageDataArray(imageData: ImageData) {
  const array: Uint8ClampedArray[] = [];

  for (let i = 0; i < CANVAS_COUNT; i++) {
    let arr = new Uint8ClampedArray(imageData.data);
    for (let j = 0; j < arr.length; j++) {
      arr[j] = 0;
    }
    array.push(arr);
  }

  return array;
}

function weightedRandom(peak: number) {
  const prob = [];
  const seq = [];

  for (let i = 0; i < CANVAS_COUNT; i++) {
    prob.push(Math.pow(CANVAS_COUNT - Math.abs(peak - i), 3));
    seq.push(i);
  }
  return chance.weighted(seq, prob);
}

function animateTransform(
  element: HTMLElement,
  translateX: number,
  translateY: number,
  rotate: number,
  duration: number,
  fadeOutDelay: number
) {
  element.addEventListener("transitionend", (e) => {
    element.remove();
  });

  // initial state
  element.style.transform = `rotate(0deg) translate(0px, 0px)`;
  element.style.opacity = "1";
  element.style.transition = `transform ${duration}ms, opacity ${duration}ms ${fadeOutDelay}ms`;

  // transitioned state
  element.style.transform = `rotate(${rotate}deg) translate(${translateX}px, ${translateY}px)`;
  element.style.opacity = "0";
}

// Create a new canvas with the imageDataArray
function newCanvasFromImageData(
  imageDataArray: Uint8ClampedArray,
  w: number,
  h: number
) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const tempCtx = canvas.getContext("2d");
  const tempImageData = new ImageData(imageDataArray, w, h);

  tempCtx?.putImageData(tempImageData, 0, 0);

  return canvas;
}
