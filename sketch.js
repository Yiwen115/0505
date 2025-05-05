// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY;
let circleRadius = 50; // Radius of the circle (half of width/height)
let isDragging = false; // Flag to track if the circle is being dragged
let previousX, previousY; // To store the previous position of the index finger

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

// Initialize the circle position in the center of the canvas
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  circleX = width / 2;
  circleY = height / 2;

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // Draw the circle
  fill(0, 255, 0);
  noStroke();
  circle(circleX, circleY, circleRadius * 2);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    let fingerMoved = false; // Track if the finger is moving the circle

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

        // Check if index finger (keypoint 8) touches the circle
        if (hand.keypoints.length > 8) {
          let indexFinger = hand.keypoints[8];
          let distanceToCircle = dist(indexFinger.x, indexFinger.y, circleX, circleY);

          if (distanceToCircle < circleRadius) {
            // Move the circle to follow the index finger
            if (!isDragging) {
              // Start dragging
              isDragging = true;
              previousX = indexFinger.x;
              previousY = indexFinger.y;
            }

            // Draw the trajectory
            stroke(255, 0, 0); // Red color for the trajectory
            strokeWeight(2);
            line(previousX, previousY, indexFinger.x, indexFinger.y);

            // Update the circle position
            circleX = indexFinger.x;
            circleY = indexFinger.y;

            // Update the previous position
            previousX = indexFinger.x;
            previousY = indexFinger.y;

            fingerMoved = true;
          }
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

    // If the finger is no longer touching the circle, stop dragging
    if (!fingerMoved) {
      isDragging = false;
    }
  }
}
