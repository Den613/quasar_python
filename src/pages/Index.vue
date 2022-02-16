<template>

  <q-page  style="background: rgb(47 46 46)" class="q-pa-lg">

     <div v-if="!user"  >
      <authorization/>
    </div> 

    <div v-else>      
      <tables :user="user"/>      
    </div>   

  </q-page>

</template>

<script>


import authorization from 'components/start_auth.vue'
import tables        from 'components/auth_table.vue'

export default ({
  components: {
    authorization,
    tables
  },

  computed: {
    user: {
      get () {
      
        if(!this.$store.state.showcase.user_data){
          this.$store.dispatch('showcase/get_data_storage') 
        
          
                
        }
        return this.$store.state.showcase.user_data
      }
    }
  },

  mounted() {
    
  
      var token = localStorage.getItem('access_token')
      if(token){
      
        this.$store.dispatch('showcase/getGroup',token)
        this.$store.dispatch('showcase/getTable', token)
                     
    
  }
  }
})
</script>
