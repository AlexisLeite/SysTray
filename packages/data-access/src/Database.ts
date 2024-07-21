import { initializeApp } from "firebase/app";
import { Firestore, getFirestore, terminate } from "firebase/firestore";

export class Database {
  private _db: Firestore;

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyCxqOBc0QLhpXCw0T477VkYwKhLk6R1i_Q",
      authDomain: "timematters-1665d.firebaseapp.com",
      projectId: "timematters-1665d",
      storageBucket: "timematters-1665d.appspot.com",
      messagingSenderId: "746224065112",
      appId: "1:746224065112:web:be64a1775ed88b1c4c082d",
      measurementId: "G-PHHJR96N0B",
    };

    const app = initializeApp(firebaseConfig);
    this._db = getFirestore(app);
  }

  public get db(): Firestore {
    return this._db;
  }

  close() {
    terminate(this.db);
  }
}
