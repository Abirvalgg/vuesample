<template>
    <div class="view-profile container">
        <Card/>
        <div v-if="profile" class="card">
            <h2 class="blue-text center"> {{ profile.alias }}'s wall</h2> 
            <ul class="comments collection" v-chat-scroll>
                <li class="vp" v-for="(comment, index) in comments" :key="index">
                    <div class="blue-text"> {{ comment.from }} </div>
                    <div class="grey-text"> {{ comment.content }} </div>
                </li>
            </ul>
            <form @submit.prevent="addComment">
                <div class="field">
                    <label for="comment">Add a comment</label>
                    <input type="text" name="comment" v-model="newComment">
                    <p v-if="feedback" class="red-text center"> {{ feedback }} </p>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
// import AddButton from '@/components/recepies/AddButton'
import Card from '@/components/recepies/Card'


export default {
    name: 'ViewProfile',
    data(){
        return {
            profile: null,
            newComment: null,
            feedback: null,
            user: null,
            comments: [

            ]
        }
    },
    components: {
        // AddButton
        Card
    },
    created(){
        let ref = db.collection('users')

        //get current user

        ref.where('user_id', '==', firebase.auth().currentUser.uid).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                this.user = doc.data(),
                this.user.id = doc.id
            })
        })

        //profile data
        ref.doc(this.$route.params.id).get()
        .then(user => {
            this.profile = user.data()
        })
        //comments
        db.collection('comments').where('to', '==', this.$route.params.id)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(change => {
                if(change.type == 'added') {
                    this.comments.unshift({
                        from: change.doc.data().from,
                        content: change.doc.data().content 
                    })
                }
            })
        })

    },
    methods: {
        addComment(){
            if(this.newComment){
                this.feedback = null
                db.collection('comments').add({
                    to: this.$route.params.id,
                    from: this.user.alias,
                    content: this.newComment,
                    time: Date.now()
                }).then(() =>{
                    this.newComment = null
                })
            } else {
                this.feedback = 'type smth'
            }
        }
    }
}
</script>


<style>
.view-profile{
    max-height: 300px;
}
.view-profile .card {
    padding: 10px;
    margin-top: 10px;
}
.view-profile h2 {
    font-size: 2em;
    margin-top: 0;
}
.view-profile .vp {
    padding: 10px;
    border-bottom: 1px solid #eee;
}
.view-profile a {
    margin-top: 15px;
    margin-bottom: -40px;
}
.messages::-webkit-scrollbar {
    width: 3px;
}
.messages::-webkit-scrollbar-track {
    background: #ddd;
}
.messages::-webkit-scrollbar-thumb {
    background: #aaa;
}
</style>
