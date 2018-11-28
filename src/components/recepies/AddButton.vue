<template>
    <div class="AddButton">
        <a href="" class="btn-floating btn-large">
            <router-link :to=" { name: 'AddCard' } ">
                <i class="material-icons">add</i>
            </router-link>
        </a>
        <Card/>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import Card from '@/components/recepies/Card'

export default {
    name: 'AddButton',
    components: {
        Card
    },
    data(){
        return {
            
        }
    }
}
</script>


<style>

</style>
