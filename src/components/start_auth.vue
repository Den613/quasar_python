<template>
    <q-page class="flex flex-center">
        <div class="q-pa-md q-gutter-sm">
            <q-card class="my-card color_icon color_text_label color_button" dark style="height: 450px; width: 100% ">
                <q-card-section>
                <h4>Вход</h4>
                
                <q-input outlined type='email' ref="nameRef" label='Имя'     v-model="email"    :rules="nameRules">
                    <template v-slot:prepend>
                        <q-icon name="fas fa-user-tie"></q-icon>
                    </template>
                </q-input>
                <br>
                
                <q-input outlined type='password' ref="passRef" label="Пароль"  v-model="password" :rules="passRules">
                    <template v-slot:prepend>
                        <q-icon name="fas fa-unlock-alt"></q-icon>
                    </template>
                </q-input>                      
                <br>
                <q-btn color="primary" label="войти" style="width: 100%;" @click="authorize_base(email, password)"/>
                <br> 
                <br>
                <div class="row justify-start">
                    <q-btn icon = "fab fa-google" style= 'width: 45%; background: #343230 !important' @click="authorize_google()"/>                    
                    <q-btn icon = "fab fa-yandex" style=" width: 50%; margin-left: 10px; background: #343230 !important" @click="authorize_yandex()"/>
                    <!-- <q-btn icon = "fab fa-facebook-f" style="margin-left: 10px; background: #343230 !important"/>
                    <q-btn icon = "fab fa-twitter" style="margin-left: 10px; background: #343230 !important"/> -->
                </div>                
                </q-card-section>
            </q-card>
        </div>
    </q-page>   
</template>

<script>

import {defineComponent} from 'vue'
import { Notify } from 'quasar'
import { ref } from 'vue'
export default defineComponent({ 
  name: 'authorization',
  setup (){

    const nameRef = ref(null)
    const passRef = ref(null)

    return {
        email: ref(null),
        password: ref(null),
        nameRef,
        passRef,
        nameRules: [
            val => (val && val.length > 0) || 'Введите имя'
        ],
        passRules: [
            val => (val && val.length > 0) || 'Введите пароль'
        ],
        onSubmit(){
            nameRef.value.validate()
            passRef.value.validate()
        }
    }
  },
  methods: {
    authorize_google(){
       this.$store.dispatch('showcase/authorize_google')
       localStorage.setItem('auth','google')     
    },

    authorize_yandex(){
        this.$store.dispatch('showcase/authorize_yandex')
        localStorage.setItem('auth', 'yandex')
    },

    authorize_base(email, password){
      
      if(email && password){
        email = email.split('@')[0]
        var data = {'email' : email, 'password' : password}
        this.$store.dispatch('showcase/base_authorize', data)                
      }
      else{

        Notify.create({

            type:  'negative',
            color: 'negative',
            timeout: 1000,
            message: 'Введите имя и пароль!'

        })
      }

      setTimeout(() =>{

        this.email = null
        this.password = null
        var token = localStorage.getItem('access_token')
        this.$store.dispatch('showcase/getTable', token)
      }, 500)
                          
    }
  }
  
})
</script>

<style lang="sass">
    .color_icon
        .q-icon:before, .q-icon:after
            color: #9E9E9E

    .color_text_label
        .q-field__label, .q-field__native
            color: #9e9e9e

    .color_button
        .bg-primary
            background: #FF9800 !important

</style>