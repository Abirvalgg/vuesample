<template>
    <div v-if="card" class="edit-card container">
        <h2>Edit {{ card.title }} card </h2>
        <form @submit.prevent="EditCard">
            <div class="field title">
                <label for="title"> Task title: </label>
                <input type="text" name="title" v-model="card.title">
            </div>
            <div v-for="(p, index) in card.points" :key="index" class="field">
                <label for="point">point: </label>
                <input type="text" name="point" v-model="card.points[index]">
                <i class="material-icons delete" @click="deleteIng(p)">delete</i>
            </div>
            <div class="field add-task">
                <label for="add-task"> Add task: </label>
                <input type="text" name="add-task" @keydown.tab.prevent="addIng" v-model="another">
            </div>
            <div class="field center-align">
                <p v-if="feedback" class="red-text"> {{feedback}} </p>
                <button v-if='guardPass' class="btn pink">Update Task</button>
            </div>
        </form>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'


export default {
    name: 'EditCard',
    data(){
        return {
            card: null,
            another: null,
            feedback: null,
            guardPass: null,
            profile: null,
            user: null
        }
    },
    methods: {
        EditCard(){
            if(this.card.title) {
                this.feedback = null
                this.card.slug = this.card.title.replace(/[^a-z]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()
                db.collection('users').doc(this.$route.params.id).collection('cards').doc(this.card.id).update({
                    title: this.card.title,
                    points: this.card.points,
                    slug: this.card.slug
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
                this.card.points.push(this.another)
                this.another = null
                this.feedback = null
            } else {
                this.feedback = "You must add some points"
            }
        },
        deleteIng(p){
            this.card.points = this.card.points.filter(point => {
                return point != p
            })
        }
    },
    created(){
        let ref = db.collection('users').doc(this.$route.params.id).collection('cards').where('slug', '==', this.$route.params.card_slug)
        ref.get().then(snapshot => {
            snapshot.forEach(doc => {
                this.card = doc.data()
                this.card.id = doc.id
            })
        })
        
        let UMref = db.collection('users')

        //get current user

        UMref.where('user_id', '==', firebase.auth().currentUser.uid).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                this.user = doc.data(),
                this.user.id = doc.id
                // console.log(this.user)
            })
        })

        //profile data
        UMref.doc(this.$route.params.id).get()
        .then(user => {
            this.profile = user.data()
            this.guardPass = (this.profile.user_id == this.user.user_id)
            console.log("guard passed: " + this.guardPass)
        })
    }
}
</script>

<style>
.edit-card {
    margin-top: 60px;
    padding: 20px;
    max-width: 500px;
}
.edit-card h2 {
    font-size: 2em;
    margin: 20px auto;
}
.edit-card .field {
    margin: 20px auto;
    position: relative;
}
.edit-card .delete {
    position: absolute;
    right: 0;
    bottom: 16px;
    color: #aaa;
    font-size: 1.4em;
    cursor: pointer;
}
</style>
