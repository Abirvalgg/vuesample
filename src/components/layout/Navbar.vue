<template>
    <div class="navbar">
        <nav class="blue lighten-2">
            <div class="container">
                <router-link :to="{ name: 'GMap' }" class="brand-logo left">Geo</router-link>
                <ul class="right">
                    <li v-if="user" ><router-link :to="{ name: 'Chat2', params: { name: username } }"> chat </router-link></li>
                    <li v-if="!user"><router-link :to="{ name: 'Signup' }">Signup</router-link></li>
                    <li v-if="!user"><router-link :to="{ name: 'Login' }">Login</router-link></li>
                    <li v-if="user"> {{ user.email }} </li>
                    <li v-if="user"><a @click="logout">Logout</a></li>
                </ul>
            </div>
        </nav>
    </div>
</template>


<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'Navbar',
    data (){
        return {
            profile: null,
            user: null,
            username: null
        }
    },
    methods: {
        logout(){
            firebase.auth().signOut().then(() => {
                this.$router.push({name: 'Login'})
            })
        }
    },
    created() {
        let qq = firebase.auth().currentUser


        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                this.user = user
            } else {
                this.user = null
            }
        }),
        // db.collection('users').where('user_id', '==', user.uid).get()
        //         .then(snapshot => {
            db.collection('users').where('user_id', '==', qq.uid).get()
                .then(users => {
            users.docs.forEach(doc => {
                let data = doc.data()
                if (data.alias) {
                    this.username = data.alias
                    // add click event on a marker
                }
            })
        })
    }
}
</script>


<style>

</style>
