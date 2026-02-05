



import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// You can find this in your Firebase Console -> Project Settings -> General -> Your Apps
const firebaseConfig = {
  apiKey: "AIzaSyA2af2916gxI-3CS4OEEzcdyyjWzYqWc9Q",
  authDomain: "robota-app-4600c.firebaseapp.com",
  projectId: "robota-app-4600c",
  storageBucket: "robota-app-4600c.firebasestorage.app",
  messagingSenderId: "965542516318",
  appId: "1:965542516318:web:f5c383693015b7b11d86cf",
  measurementId: "G-2C07379Q5K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export it
export const db = getFirestore(app);

// ========== ROBOT DATA FUNCTIONS ==========

// Add a new robot to Firestore
export const addRobotToFirestore = async (robotData) => {
  try {
    const docRef = await addDoc(collection(db, "robots"), {
      ...robotData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding robot: ", error);
    throw error;
  }
};

// Get all robots from Firestore
export const getAllRobots = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "robots"));
    const robots = [];
    querySnapshot.forEach((doc) => {
      robots.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return robots;
  } catch (error) {
    console.error("Error getting robots: ", error);
    throw error;
  }
};

// Get a specific robot by name
export const getRobotByName = async (robotName) => {
  try {
    const q = query(collection(db, "robots"), where("name", "==", robotName));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting robot: ", error);
    throw error;
  }
};

// Update robot data in Firestore
export const updateRobotInFirestore = async (robotId, robotData) => {
  try {
    const robotRef = doc(db, "robots", robotId);
    await updateDoc(robotRef, {
      ...robotData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating robot: ", error);
    throw error;
  }
};

// Delete a robot from Firestore
export const deleteRobotFromFirestore = async (robotId) => {
  try {
    await deleteDoc(doc(db, "robots", robotId));
  } catch (error) {
    console.error("Error deleting robot: ", error);
    throw error;
  }
};

// Get robot data by name (for easier access in components)
export const getRobotData = async (robotName) => {
  try {
    const robot = await getRobotByName(robotName);
    if (robot) {
      return {
        customName: robot.customName || robotName,
        status: robot.status || "Broken"
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting robot data: ", error);
    throw error;
  }
};
// Delete all robots from Firestore
export const deleteAllRobotsFromFirestore = async () => {
  try {
    const robots = await getAllRobots()
    for (const robot of robots) {
      await deleteDoc(doc(db, "robots", robot.id))
    }
  } catch (error) {
    console.error("Error deleting all robots: ", error)
    throw error
  }
};