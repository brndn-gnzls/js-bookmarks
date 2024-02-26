import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc , doc, query, where, serverTimestamp } from "firebase/firestore";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth"

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_API_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const colRef = collection(db, "bookmarks")

function deleteEvent() {
    const deleteButtons = document.querySelectorAll('i.delete')
    deleteButtons.forEach(button => {
        button.addEventListener("click", event => {
            const deleteRef = doc(db, "bookmarks", button.dataset.id)
            deleteDoc(deleteRef)
                .then(() => {
                    button.parentElement.parentElement.parentElement.remove()
                })
        })
    })
}

function generateTemplate(response, id) {
    return `<div class="card">
        <p class="title">${response.title}</p>
        <div class="sub-information">
            <p class="">
                <span class="category ${response.category}">${response.category[0].toUpperCase()}${response.category.slice(1)}</span>
            </p>
            <a href="${response.link}" target="_blank"><i class="bi bi-box-arrow-up-right website"></i></a>
            <a href="https://www.google.com/search?q=${response.title}" target="_blank"><i class="bit bi-google search"></i></a>
            <span><i class="bi bi-trash delete" data-id="${id}"></i></span>
        </div>
    </div>`
}

const cards = document.querySelector(".cards")
function showCard() {
    cards.innerHTML = ""
    getDocs(colRef)
        .then(data => {
            data.docs.forEach(document => {
                cards.innerHTML += generateTemplate(document.data(), document.id)
            })
            deleteEvent()
        })
        .catch(err => {
            console.log(err)
        })
}
showCard()

const addForm = document.querySelector(".add")
addForm.addEventListener("submit", event => {
    event.preventDefault()

    addDoc(colRef, {
        link: addForm.link.value,
        title: addForm.title.value,
        category: addForm.category.value,
        createdAt:  serverTimestamp()
    })
    .then(() => {
        addForm.reset()
        showCard()
    })
})

function filteredCards(category) {
    if(category === "all") {
        showCard()
    } else {
        const qRef = query(colRef, where("category", "==", category))
        cards.innerHTML = ""
    
        getDocs(qRef)
            .then(data => {
                data.docs.forEach(document => {
                    cards.innerHTML += generateTemplate(document.data(), document.id)
                })
                deleteEvent()
            })
            .catch(error => {
                console.log(error)
            })
    }
}

const categoryList = document.querySelector('.category-list')
const categorySpan = document.querySelectorAll('.category-list span')
categoryList.addEventListener("click", event => {
    if(event.target.tagName === "SPAN") {
       filteredCards(event.target.innerText.toLowerCase())
        categorySpan.forEach(span => span.classList.remove("active"))
        event.target.classList.add("active")
    }
})

const auth = getAuth()

function registerUser(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
            console.log('User created: ', user)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message
            console.error(errorCode, errorMessage)
        })
}

function loginUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
            console.log('User logged in: ', user)
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message

            console.error(errorCode, errorMessage)
        })
}

function logoutUser() {
    signOut(auth).then(() => {
        console.log('User signed out')
    }).catch((error) => {
        console.error('Sign out error', error)
    })
}