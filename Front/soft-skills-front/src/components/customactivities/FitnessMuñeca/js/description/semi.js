import {Finger, FingerCurl, FingerDirection, GestureDescription} from 'fingerpose'; 

// Define Gesture Description
export const semiDescription = new GestureDescription('semi'); 



for(let finger of [Finger.Middle, Finger.Ring, Finger.Index ,Finger.Pinky,Finger.Thumb]){
    semiDescription.addCurl(finger, FingerCurl.HalfCurl, 1.0);
    semiDescription.addDirection(finger, FingerDirection.VerticalUp, 1.0);
    semiDescription.addDirection(finger, FingerDirection.DiagonalUpLeft, 1.0);
    semiDescription.addDirection(finger, FingerDirection.DiagonalUpRight, 1.0);
    semiDescription.addDirection(finger, FingerDirection.HorizontalLeft, 1.0);
    semiDescription.addDirection(finger, FingerDirection.HorizontalRight, 1.0);
}