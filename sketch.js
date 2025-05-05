// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // Connect keypoints 0 to 4 with lines
        if (hand.keypoints.length > 4) {
          strokeWeight(2);
          if (hand.handedness == "Left") {
            stroke(255, 0, 255); // Left hand color
          } else {
            stroke(255, 255, 0); // Right hand color
          }

          for (let i = 0; i < 4; i++) {
            let kp1 = hand.keypoints[i];
            let kp2 = hand.keypoints[i + 1];
            line(kp1.x, kp1.y, kp2.x, kp2.y);
          }
        }
      }
    }
  }
}
