<template>
    <q-card dark>
        <q-card-section>

            <q-input outlined v-model="comment" bg-color="white" label="текст"/>
            <br>
            <q-btn :disabled="comment !== null && comment !== ''? false : true" color="secondary" label="добавить комментарий" @click="add_comment(comment, user, data_id)"/>

        </q-card-section>
    </q-card>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'comment',

    setup() {
        var comment = ref(null)        
        return{
            comment
        }
    },
    methods:{
        add_comment(com, user, id){
            console.log('com: ' + com + ' user: ' + user + ' id: ' + id)

            // var today = new Date()
            // var dd = String(today.getDate()).padStart(2, '0')
            // var mm = String(today.getMonth() + 1).padStart(2, '0')
            // var yyyy = today.getFullYear()
            var date = Date.now()
            // var y = new Date(test)

            // console.log(dd + ' : '+ mm + ' : ' +yyyy+ ' : '+today.getHours()+':'+today.getMinutes()+'|'+y.getHours())

            var data = {          

                'name' : user,
                'comment' : com,
                'data' : date,
                'id' : id
            }
            this.$store.dispatch('showcase/addComment', data)

            this.comment = ''
        }
    },
    props:{
        data_id: {
            type: String
        },
        user: {
            type: String
        }
    }
})
</script>
