<template>
    <div class="add-card container">
        <h2 class="center-align blue-text">Add new task</h2>
        <form @submit.prevent="AddCard">
            <div class="field title">
                <label for="title"> Task title: </label>
                <input type="text" name="title" v-model="title">
            </div>
            <div v-for="(p, index) in points" :key="index" class="field">
                <label for="point">point: </label>
                <input type="text" name="point" v-model="points[index]">
                <i class="material-icons delete" @click="deleteIng(p)">delete</i>
            </div>
            <div class="field add-task">
                <label for="add-task"> Add point: </label>
                <input type="text" name="add-task" @keydown.tab.prevent="addIng" v-model="another">
            </div>
            <div class="field center-align">
                <p v-if="feedback" class="red-text"> {{feedback}} </p>
                <button v-if='ci' class="btn pink">Add Task</button>
            </div>
        </form>
    </div>
</template>


<script>
import db from '@/firebase/init'
import firebase from 'firebase'


export default {
    name: "AddCard",
    data(){
        return {
            title: null,
            another: null,
            points: [],
            feedback: null,
            user: null,
            profile: null,
            ci: false,
            slug: null
        }
    },
    methods: {
        AddCard(){
            if(this.title) {
                this.feedback = null
                this.slug = this.title.replace(/[^a-z]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()
                db.collection('users').doc(this.$route.params.id).collection('cards').add({
                    title: this.title,
                    points: this.points,
                    slug: this.slug
                }).then(() => {
                    this.$router.push({ name: 'ViewProfile' })
                }).catch(err => {
                    console.log(err)
                })
            } else {
                this.feedback = 'You must enter a title'
            }
        },
        addIng(){
            if(this.another){
                this.points.push(this.another)
                this.another = null
                this.feedback = null
            } else {
                this.feedback = "You must add some points"
            }
        },
        deleteIng(p){
            this.points = this.points.filter(point => {
                return point != p
            })
        }
    },
    created(){
        let ref = db.collection('users')

        //get current user

        ref.where('user_id', '==', firebase.auth().currentUser.uid).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                this.user = doc.data(),
                this.user.id = doc.id
                // console.log(this.user)
            })
        })

        //profile data
        ref.doc(this.$route.params.id).get()
        .then(user => {
            this.profile = user.data()
            this.ci = (this.profile.user_id == this.user.user_id)
            // console.log(this.ci)
        })
    },
}
</script>


<style>


.add-card {
    margin-top: 60px;
    padding: 20px;
    max-width: 500px;
}
.add-card h2 {
    font-size: 2em;
    margin: 20px auto;
}
.add-card .field {
    margin: 20px auto;
    position: relative;
}
.add-card .delete {
    position: absolute;
    right: 0;
    bottom: 16px;
    color: #aaa;
    font-size: 1.4em;
    cursor: pointer;
}
</style>
