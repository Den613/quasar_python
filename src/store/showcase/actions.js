import {api} from 'boot/axios'
import { Notify } from 'quasar'

export function authorize_google () {    
    window.location.href = api.defaults.baseURL + "/authorize/google"
}

export function authorize_yandex () {
    window.location.href = api.defaults.baseURL + "/authorize/yandex"
}

export function base_authorize({commit}, data) {

    const param = new URLSearchParams()

    param.append('grant_type','')
    param.append('username', data['email'])
    param.append('password', data['password'])
    param.append('scope','')
    param.append('client_id','')
    param.append('client_secret','')

    const config = {
        Headers: {
            'Content-Type' : 'application/x-www-form-urlencoded'
        }
    }
    
    api.post('/token', param, config)
    .then((response) => {
        localStorage.setItem('access_token', response.data.access_token)
        commit('USER', {user_data : response.data})

    })
    .catch((error) => {
        Notify.create({

            type:  'negative',
            color: 'negative',
            timeout: 1000,
            message: '401 Unauthorized'

        })
    })
}

export function addTable({},data) {
    
    const headers = {
            'Accept': 'application/json',
            'Authorization' : 'Bearer '+data.access_token        
    }

    console.log(data)
    api.post('/addTable',data,{headers:headers})
    .then((response) => {

        Notify.create({
            
            type: 'positive',
            color: 'positive',
            timeout: 1000,
            message: 'Запись добавлена'
            
        })
    })
    .catch((error) => {
        Notify.create({

            type:  'negative',
            color: 'negative',
            timeout: 1000,
            message: '401 Unauthorized'

        })
    })
}

export function addTableConfirm({},data){
    const headers = { 
        'Accept' : 'application/json',
        'Authorization' : 'Bearer '+data.access_token
    }
    api.post('/addTableConfirm',data, {headers:headers})
    .then((response) => {
        Notify.create({

            type: 'positive',                                        
            color: 'positive',
            timeout: 1000,
            message: 'Группа подтверждена'

        })  
    })
    .catch((error) => {
        Notify.create({

            type:  'negative',
            color: 'negative',
            timeout: 1000,
            message: 'Ошибка в подтверждение группы!'

        })
    })
}

export function getTable({commit}, token) {
    const headers = {
        'Accept' : 'application/json',
        'Authorization' : 'Bearer '+token
    }
    api.get('/getTable',{headers:headers})
    .then((response) => {
        commit('TABLE',{table : response.data})
    })

}

export function get_data_storage({commit}, token){
    function get_cookie (cookie_name){
        var results = document.cookie.match( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' )
        if(results)
            return (unescape(results[2]));
        else
            return null
    }
    if(document.cookie){
        var token = get_cookie('access_token').replace('Bearer','').replace('bearer','')

        localStorage.setItem('access_token', get_cookie('access_token').replace('Bearer ','').replace('bearer ',''))
    }
    if(localStorage.getItem('access_token')){
        var token = localStorage.getItem('access_token').replace('Bearer ','').replace('bearer ','')
    }
    if(token){

    
        const headers = {
            'Authorization' : 'Bearer '+token
        }
        api.get('/users/me',{headers:headers})
        .then((response) => {
            commit('USER', {user_data : response.data})
        })
    }
    
}

export function getGroup({commit}, token){
    const headers = {
        'Accept' : 'application/json',
        'Authorization' : 'Bearer '+token
    }
    api.get('/getGroup',{headers:headers})
    .then((response) => {
        commit('GROUPS',{groups: response.data})
    })
}

export function editData({commit},res){   
    const headers = {
        'Accept' : 'application/json',
        'Authorization' : 'Bearer '+res.token
    }
    var data = {
        'id' : res.id,
        'job' : res.job,
        'create' : res.create,
        'data' : res.data,
        'groups' : res.groups,
        'confirm' : res.confirm
    }
    console.log(data)
    api.post('/editData',data, {headers:headers})
    .then((response) => {
        Notify.create({
            
            type: 'positive',
            color: 'positive',
            timeout: 1000,
            message: 'Запись успешно изменена'
            
        })
    })
    .catch((error) => {
        Notify.create({

            type:  'negative',
            color: 'negative',
            timeout: 1000,
            message: 'Ошибка в редактировании'

        })
    })
}

export function statusJob({commit}, status){
    const headers = {
        'Accept' : 'application/json',
        'Authorization' : 'Bearer '+status.token
    }
    var data = {
        'id' : status.id,
        'status_perform' : status.status_perform,
        'status_cancel' : status.status_cancel
    }
    api.post('/statusJob',data,{headers:headers})
    .then((response) => {
        Notify.create({
            type: 'positive',
            color: 'positive',
            timeout: 1000,
            message: 'Статус изменен'
        })
    })
    .catch((error) => {
        Notify.create({
            type: 'negative',
            color: 'negative',
            timeout: 1000,
            message: 'Ошибка изменения статуса'
        })
    })

}

export function addComment({commit}, data){
    const headers = {
        'Accept' : 'application/json',
        'Authorization' : 'Bearer '+localStorage.getItem('access_token')
    }
    
    api.post('/addComment',data, {headers:headers})
    .then((response) => {

    })
    .catch((error) => {
        Notify.create({
            type: 'negative',
            color: 'negative',
            timeout: 1000,
            message: 'Ошибка в добавлении комментария'
        })
    })

}



