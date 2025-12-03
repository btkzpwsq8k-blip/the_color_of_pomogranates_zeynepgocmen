{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 let jetlabHeavy, jetlabLight;\
let img;\
let song;\
\
let overlayAlpha = 255;\
let overlayColor;\
let overlayFadeSpeed = 2.5;\
\
let puddleAnimating = false;\
let puddleProgress = 0;\
let puddleDuration = 5*60;\
let puddleFrozen = false;\
\
let puddleCenters = [];\
let puddleOffsets = [];\
let maxPuddleRadius;\
let puddleColor;\
\
let textOpacity = 255;\
let textColor;\
\
let state = "overlay";\
\
let size1, size2, sizeLight;\
let xCenter, yHeavy, yPome, yBottom;\
\
let soundStartTime;\
let fadeStartTime = 35000; // ms\
let fadeDuration = 2000;\
let maxSoundDuration = 37000;\
\
let bordo, krem;\
\
function preload() \{\
  // Replace these URLs with your GitHub-hosted files\
  img = loadImage("https://raw.githubusercontent.com/username/repo/main/pomegranates.png");\
  song = loadSound("https://raw.githubusercontent.com/username/repo/main/YouWereAlwaysWise.mp3");\
  jetlabHeavy = loadFont("https://raw.githubusercontent.com/username/repo/main/JetlabHeavy.otf");\
  jetlabLight = loadFont("https://raw.githubusercontent.com/username/repo/main/JetlabLight.otf");\
\}\
\
function setup() \{\
  createCanvas(500, 707);\
  noStroke();\
  imageMode(CENTER);\
\
  overlayColor = color(80, 0, 0);\
  bordo = color(128, 0, 0);\
  krem = color(235, 226, 212);\
  puddleColor = bordo;\
  textColor = bordo;\
\
  puddleCenters = [\
    createVector(width/2 - 120, height/2 + 60),\
    createVector(width/2, height/2 + 80),\
    createVector(width/2 + 120, height/2 + 60)\
  ];\
\
  maxPuddleRadius = sqrt(sq(width) + sq(height));\
\
  puddleOffsets = [];\
  for(let i=0; i<3; i++)\{\
    puddleOffsets.push(random(0, 0.15));\
  \}\
\
  size2 = 100;\
  textFont(jetlabHeavy);\
  textSize(size2);\
  let w2 = textWidth("POMEGRANATES");\
\
  size1 = 10;\
  textFont(jetlabHeavy);\
  while (textWidth("THE COLOR OF") < w2) \{ size1++; textSize(size1); \}\
\
  sizeLight = 25;\
  xCenter = width / 2;\
  yHeavy = height/2 - size2/1.2 - 150;\
  yPome = height/2 + size2/4 - 150 - 5;\
  yBottom = height - 30;\
\
  song.play();\
  soundStartTime = millis();\
\}\
\
function draw() \{\
  background(krem);\
\
  let elapsed = millis() - soundStartTime;\
  if(elapsed >= fadeStartTime && elapsed < maxSoundDuration)\{\
    let fadeProgress = (elapsed - fadeStartTime) / fadeDuration;\
    fadeProgress = constrain(fadeProgress, 0, 1);\
    song.setVolume(1 - fadeProgress);\
  \}\
\
  if(elapsed >= maxSoundDuration)\{\
    song.stop();\
    song.play();\
    soundStartTime = millis();\
  \}\
\
  if(puddleAnimating && state === "puddle")\{\
    puddleProgress += 1.0 / puddleDuration;\
    puddleProgress = constrain(puddleProgress,0,1);\
    if(puddleProgress >= 0.95)\{\
      puddleFrozen = true;\
      state = "waitReset";\
      noLoop();\
    \}\
  \}\
\
  for(let i=0; i<3; i++)\{\
    let r = maxPuddleRadius * constrain(puddleProgress - puddleOffsets[i],0,1);\
    drawOrganicPuddle(puddleCenters[i].x, puddleCenters[i].y, r);\
  \}\
\
  textColor = lerpColor(bordo, krem, constrain(puddleProgress*1.5,0,1));\
\
  image(img, width/2, height/2 + 80);\
\
  textAlign(CENTER, BASELINE);\
  textFont(jetlabHeavy);\
  textSize(size1);\
  fill(textColor, textOpacity);\
  text("THE COLOR OF", xCenter, yHeavy);\
\
  textFont(jetlabHeavy);\
  textSize(size2);\
  text("POMEGRANATES", xCenter, yPome);\
\
  textFont(jetlabLight);\
  textSize(sizeLight);\
  textAlign(LEFT, BASELINE);\
  text("SERGEI PARAJANOV", 30, yBottom);\
  textAlign(RIGHT, BASELINE);\
  text("1969", width-30, yBottom);\
\
  if(state === "overlay")\{\
    fill(overlayColor, overlayAlpha);\
    rect(0,0,width,height);\
    overlayAlpha -= overlayFadeSpeed;\
    overlayAlpha = max(overlayAlpha,0);\
    if(overlayAlpha <= 0)\{\
      state = "waitClick";\
    \}\
  \}\
  else if(state === "fadeIn")\{\
    fill(overlayColor, overlayAlpha);\
    rect(0,0,width,height);\
    overlayAlpha += overlayFadeSpeed*1.5;\
    overlayAlpha = min(overlayAlpha,255);\
    if(overlayAlpha >= 255)\{\
      puddleProgress = 0;\
      puddleFrozen = false;\
      overlayAlpha = 255;\
      state = "overlay";\
      loop();\
    \}\
  \}\
\}\
\
function drawOrganicPuddle(cx, cy, r)\{\
  let steps = 100;\
  let radiusX = r;\
  let radiusY = r * (height/width);\
  fill(puddleColor);\
  beginShape();\
  for(let i=0;i<steps;i++)\{\
    let angle = map(i,0,steps,0,TWO_PI);\
    let radiusOffset;\
    if(!puddleFrozen)\{\
      radiusOffset = map(noise(i*0.1,frameCount*0.02),0,1,-r*0.35,r*0.35);\
    \} else \{\
      radiusOffset = map(noise(i*0.1,1),0,1,-r*0.35,r*0.35);\
    \}\
    let x = cx + cos(angle)*(radiusX + radiusOffset);\
    let y = cy + sin(angle)*(radiusY + radiusOffset);\
    vertex(x,y);\
  \}\
  endShape(CLOSE);\
\}\
\
function mousePressed()\{\
  if(state === "waitClick")\{\
    puddleAnimating = true;\
    state = "puddle";\
    loop();\
  \}\
  else if(state === "waitReset")\{\
    state = "fadeIn";\
    loop();\
  \}\
\}\
}