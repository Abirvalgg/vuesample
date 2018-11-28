<template>
    <div>
        <div class="index">
            <div class="card" v-for="card in cards" :key="card.id">
                <div class="card-content">
                    <i v-if="ci" class="material-icons delete" @click="deleteCard(card.id)">delete</i>
                    <h2 class="blue-text"> {{ card.title }} </h2>
                    <ul class="points">
                        <li v-for="(point, index) in card.points" :key="index">
                            <span class="chip">{{ point }}</span>
                        </li>
                    </ul>
                    <router-link :to="{ name: 'EditCard', params: {card_slug: card.slug}}">
                        <i v-if="ci" class="material-icons edit">edit</i>
                    </router-link>
                </div>
                <!-- <span class="btn-floating btn halfway-fab pink">
                    <router-link :to="{ name: 'EditCard', params: {card_slug: card.slug}}">
                        <i v-if="ci" class="material-icons edit">edit</i>
                    </router-link>
                </span> -->
            </div>
            <div v-if="ci" class="AddButton">
            <a v-on:click.prevent href="" class="btn-floating btn blue">
                <router-link :to=" { name: 'AddCard' } ">
                    <i class="material-icons">add</i>
                </router-link>
            </a>
        </div>
        </div>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
    name: 'Card',
    data(){
        return {
            cards: [],
            user: null,
            profile: null,
            ci: false,
            userAdress: null,
        }
    },
    methods: {
        deleteCard(id) {
            // delete doc from firestore
            db.collection('users').doc(this.profile.alias.replace(/[^a-z]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()).collection('cards').doc(id).delete()
            .then(() => {
                this.cards = this.cards.filter(card => {
                    return card.id != id
                })
            })
        }
    },
    created(){
        //fetch data from firestore
        // let x = ("/users/"+(this.user.id)+"/cards")
        // console.log(x)

        // db.collection('/users/userfromberlin/cards').get()
        

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
            db.collection('users').doc(this.profile.alias.replace(/[^a-z]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()).collection('cards').get()
                .then(snapshot => {
                snapshot.forEach(doc => {
                let card = doc.data()
                card.id = doc.id
                this.cards.push(card)
                // console.log(this.profile)
                })
            })
        })
    }
}
</script>


<style>
.index {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 7px;
}
.index .AddButton {
    margin-inline-start: 40%;
    margin-top: 15%;
}
.index i {
    font-size: 2em;
    text-align: center;
}
.index h2 {
    font-size: 1.4em;
    text-align: center;
    margin-top: 0px;
}
.index .points {
    margin: 15px auto;
}
.index .points li {
    display: inline-block;
}
.index .delete {
    position: absolute;
    top: 4px;
    right: 4px;
    cursor: pointer;
    color: #aaa;
    font-size: 1.5em;
}
.index .edit {
    position: absolute;
    bottom: 4px;
    right: 4px;
    cursor: pointer;
    color: #aaa;
    font-size: 1.5em;
}
</style>
