import { addDoc, collection, getDocs, limit, query, where } from "firebase/firestore/lite";
import { db } from "../FirebaseConfig";

//Function that creates user in the database, if he logs in with google account
async function createUserWithGoogleData(userData) {
    const findUserQuery = query(
        collection(db, "Users"),
        where("email", "==", userData.email),
        limit(1),
    )

    const querySnapshot = await getDocs(findUserQuery);

    if (querySnapshot.empty) {
        const insertResult = {};
        const names = userData.displayName.split(" ");
        insertResult.firstName = names[0];
        insertResult.lastName = names[1];
        insertResult.email = userData.email;
        insertResult.dateOfCreation = new Date();
        insertResult.dateOfBirth = new Date();
        insertResult.gender = "undefined";
        insertResult.haveParticipated = [];
        insertResult.organizedEvents = [];
        insertResult.wiiParticipate = [];

        const usersCollection = collection(db, "Users");
        const dataResult = await addDoc(usersCollection, insertResult);
        console.log(dataResult);
    }
}

export default createUserWithGoogleData;