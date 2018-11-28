<template>
    <div class="map">
        <div class="google-map" id="map"></div> 
        <!-- <Chat class="cht"></Chat> -->
    </div>
</template>


<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import Chat from '@/components/Chat'

export default {
    components: {
        Chat
    },
    name: 'GMap',
    data () {
        return {
            lat: 55,
            lng: 37
        }
    },
    methods: {
        renderMap(){
            const map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: this.lat ,lng: this.lng },
                zoom: 3,
                maxZoom: 15,
                minZoom: 3,
                streetViewControl: false
            })

            db.collection('users').get().then(users => {
                users.docs.forEach(doc => {
                    let data = doc.data()
                    if (data.geolocation) {
                        let marker = new google.maps.Marker ({
                            position: {
                                lat: data.geolocation.lat,
                                lng: data.geolocation.lng
                            },
                            map
                        })
                        // add click event on a marker
                        marker.addListener('click', () => {
                            this.$router.push({ name: 'ViewProfile', params: { id: doc.id }})
                        })
                    }
                })
            })
        }
    },
    mounted() {
        // get current user
        let user = firebase.auth().currentUser
        // console.log (user)

        // get user geolocation
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(pos => {
                this.lat = pos.coords.latitude
                this.lng = pos.coords.longitude
                // find the user record and then update geocoords
                db.collection('users').where('user_id', '==', user.uid).get()
                .then(snapshot => {
                    snapshot.forEach((doc) => {
                        db.collection('users').doc(doc.id).update({
                            geolocation: {
                                lat: pos.coords.latitude,
                                lng: pos.coords.longitude
                            }
                        })
                    })
                }).then (() =>{
                    this.renderMap()
                })
            },  (err) => {
                    console.log(err)
                    this.renderMap()
            },  { maximumAge: 60000, timeout: 1000})
        } else {
            // position center by default values
            this.renderMap()
        }
    }
}
</script>


<style>

.google-map {
    height: 100%;
    width: 100%;
    margin: 0 auto;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
}
.cht {
    z-index: -2;
}

</style>
