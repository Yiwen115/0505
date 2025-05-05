// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY;
let circleRadius = 50; // Radius of the circle (half of width/height)
let isDragging = false; // Flag to track if the circle is being dragged
let previousX, previousY; // To store the previous position of the index finger
let trajectory = []; // Array to store the trajectory points

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

  // Draw the stored trajectory
  stroke(255, 0, 0); // Red color for the trajectory
  strokeWeight(10); // Set line thickness to 10
  noFill();
  beginShape();
  for (let point of trajectory) {
    vertex(point.x, point.y);
  }
  endShape();

  // Draw the circle
  fill(0, 255, 0);
  noStroke();
  circle(circleX, circleY, circleRadius * 2);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    let fingerMoved = false; // Track if the finger is moving the circle

    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Check if thumb (keypoint 4) touches the circle
        if (hand.keypoints.length > 8) {
          let thumb = hand.keypoints[4];
          let indexFinger = hand.keypoints[8];
          let distanceToCircle = dist(thumb.x, thumb.y, circleX, circleY);

          if (distanceToCircle < circleRadius) {
            // Move the circle to follow the index finger
            if (!isDragging) {
              // Start dragging
              isDragging = true;
              previousX = indexFinger.x;
              previousY = indexFinger.y;
            }

            // Add the current position to the trajectory
            trajectory.push({ x: indexFinger.x, y: indexFinger.y });

            // Update the circle position
            circleX = indexFinger.x;
            circleY = indexFinger.y;

            // Update the previous position
            previousX = indexFinger.x;
            previousY = indexFinger.y;

            fingerMoved = true;
          }
        }
      }
    }

    // If the thumb is no longer touching the circle, stop dragging
    if (!fingerMoved) {
      isDragging = false;
    }
  }
}

