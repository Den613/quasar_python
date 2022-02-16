<template>
    <q-page class="q-pa-lg" style="min-width: 350px">
        {{get_data(data_text)}}
        <div >

            <q-card dark > <!-- Работа -->
                <q-card-section>
                    <div class="text-h6">Работа</div>
                </q-card-section>
                <q-separator/>
                
                <div v-if="user.privilege === 'admin'">
                    <q-card-section>
                        <q-editor
                            v-model="data.job"
                            style='background-color: #292828fa'
                            class="q_edit_bg_color"
                            :definitions="{
                                upload: {
                                    tip: 'Upload to cloud',
                                    icon: 'cloud_upload',
                                    label: 'загрузить фото',
                                    handler: insertImg
                                }
                            }"
                            :toolbar="[
                                ['bold', 'italic', 'strike', 'underline'],
                                ['upload']
                            ]"
                        />                        
                    </q-card-section>
                    </div>
                    <div v-else>
                        <q-card-section>
                            <q-card>
                                <q-card-section style=" color: black; background: white" v-html="data.job"/>                                
                            </q-card>
                            <br>                            
                            <!-- <comment
                                :user="user.full_name"
                                :data_id="data.id"
                            /> -->
                        </q-card-section>                        
                    </div>
                
            </q-card>                    

            <br>            

                <q-card dark class = "my-card"> <!-- Создано -->
                    <q-card-section>
                        <div class="text-h6">Создано</div>
                    </q-card-section>
                    <q-separator/>
                    
                        <div v-if="user.privilege === 'admin'">
                            <q-card-section>
                                <q-editor
                                    v-model="data.create"
                                    style='background-color: #292828fa'
                                    class="q_edit_bg_color"
                                    :definitions="{
                                        upload: {
                                            tip: 'Upload to cloud',
                                            icon: 'cloud_upload',
                                            label: 'загрузить фото',
                                            handler: insertImg
                                        }
                                    }"
                                    :toolbar="[
                                        ['bold', 'italic', 'strike', 'underline'],
                                        ['upload']
                                    ]"
                                />
                            </q-card-section>
                        </div>
                        <div v-else>
                            <q-card-section v-html="data.create"/>
                        </div>
                                                   
            </q-card>
            </div>            

            <br>

            <q-card dark class = "my-card" > <!-- Дата -->
                <q-card-section>
                    <div class="text-h6">Дата</div>
                    </q-card-section>
                    <q-separator/>
                    <q-card-section >
                        
                    <div v-if="user.privilege === 'admin'">                        
                        <q-date  dark first-day-of-week="1" v-model="data.date_month_year" mask="DD-MM-YYYY" class=" header_cald" />                        
                    </div>

                    <div v-else>
                        <p class="row">{{data.date_month_year}}</p>
                    </div>

                    <br>

                    Создано: 
                    <q-badge style="background-color: #009688">
                        {{ data.user_create}}
                    </q-badge>                                                                        

                </q-card-section>
            </q-card>

            <br>

            <q-card dark class = "my-card"> <!-- Группы -->
                <q-card-section>
                    <div class="text-h6">Группы</div>
                </q-card-section>
                <q-separator/>
                <q-card-section class="row">
                    
                    <div v-for="n_g in groups" v-bind:key="n_g">
                        <div v-if="user.group">
                            <div v-if="n_g === user.group.name">

                                <div v-if="groups_active(n_g, data)">

                                    <q-chip style="background: #21d428 !important; color:white">                                                  
                                        {{n_g}}                        
                                    </q-chip>
                                    
                                </div>

                                <div v-else>
                                    <div v-if="user.privilege === 'admin_user'">
                                        <q-chip clickable @click="confirm_group(n_g, data, user)" color="deep-orange" text-color="white">  <!--  -->                                                
                                            {{n_g}}                          
                                        </q-chip> 
                                    </div>
                                    <div v-else>
                                        <q-chip color="red" text-color="white">
                                            {{n_g}}
                                        </q-chip>
                                    </div>
                                    
                                </div>
                            </div>
                            <div v-else>
                               
                                <div v-if="groups_active(n_g, data)">                        
                                    <q-chip outline color="green" style="color:white">                                                  
                                        {{n_g}}
                                    </q-chip>
                                </div> 
                                <div v-else>                           
                                    <q-chip outline color="primary" style="color:white">                                                  
                                        {{n_g}}                          
                                    </q-chip>
                                </div>
                            </div>

                        </div>
                        <div v-else>
                            
                            <div v-if="groups_active(n_g, data)">
                                <q-chip outline color="green" style="color:white">
                                    <q-tooltip
                                        anchor="top middle"
                                        :offset="[50,50]"                                       
                                        class="bg-purple text-body2"
                                        transition-show="scale"
                                        transition-hide="scale"
                                    >
                                        {{get_responsible(n_g, data.responsible)}}
                                    </q-tooltip>
                                    {{n_g}}
                                </q-chip>
                            </div>
                            <div v-else>
                                <q-chip outline color="primary" style="color:white">
                                    {{n_g}}
                                </q-chip>
                            </div>

                        </div>

                    </div>                    

                </q-card-section>
                <q-card-section>
                    
                    <div v-if="user.privilege === 'admin'">
                        <q-select
                            class="select_color_bg"
                            filled
                            v-model="groups"
                            use-input
                            use-chips
                            multiple
                            input-debounce="0"
                      
                            :options="list_all_groups()"
                      
                            style="width: 40%"
                        />                       
                    </div>

                </q-card-section>
            </q-card>
            
            <br>
            
            <div class="row">
                
                <q-btn flat label="ok" color='primary' v-close-popup/>
                <q-btn v-if='user.privilege === "admin"' flat label='edit' color='primary' @click="evt => edit_value(evt, data, groups)"/>
                
                                
            </div>
    </q-page>

</template>

<script>
import { defineComponent, ref } from 'vue'
// import comment from 'components/comment.vue'

export default defineComponent({
    // components: {
    //     comment
    // },
    
    name: 'modDialog',

    setup() {
        var data = ref('null')
        var groups = ref('null')
        return {
            data,
            groups
        }
    },
    methods:{

        insertImg() {
      
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = '.png, .jpg, .svg'
            let file
            input.onchange = _=> {
                const files = Array.from(input.files)
                file = files[0]
                const reader = new FileReader()
                let dataUrl = ''
                reader.onloadend = function() {
                    dataUrl = reader.result
                    // post.body += '<div><img src="' + dataUrl + '"/></div>'
                    document.execCommand('insertHTML', true, '<div><img src="' + dataUrl + '" width=400 hight=400/></div>')  //warning                  
          
                }
                reader.readAsDataURL(file)
            }
            input.click()
        },
        
        get_data(data){
            this.data = data  
            this.groups = this.groups_choose(data.group)
        },
        groups_choose(data){
            if(data){
               var re = /\s*,\s*/;
               var nameList = data.split(re);
            }
            
            return nameList
        },
        
        groups_active(name_group, all_group){

            if(all_group.confirm){    
                return all_group.confirm.includes(name_group)
            }else{
                return false
            }
        },

        confirm_group(name_group, row, user){
            console.log(user.full_name+':'+name_group)
            var data_user = {
                'id' : row.id,
                'responsible': user.full_name+':'+name_group,
                'confirm': name_group,
                'access_token' : localStorage.getItem('access_token')
            }

            if(row.confirm){
                if(!row.confirm.includes(name_group)){
                    row.confirm.push(name_group)
                    
                }
            }
            else {
                row.confirm = name_group
            }
            console.log('data user: ', data_user)
            console.log('row : ',row.confirm)
            
            var list_confirm = []
            if(typeof row.confirm === 'object'){
                var str_confirm = ''
                for(var key = 0; key < row.confirm.length; key++){
                    str_confirm += row.confirm[key]+','
                }
                str_confirm = str_confirm.substring(0, str_confirm.length -1)
                list_confirm = this.groups_choose(str_confirm)
            }
            else{
                list_confirm.push(row.confirm)
            }

            row.confirm = list_confirm
            this.$store.dispatch('showcase/addTableConfirm', data_user)                       
        },

        list_all_groups(){
            var groups = this.$store.state.showcase.groups
            var list_name_all_groups = [] 
            for(var i = 0; i < groups.length; i++){
                list_name_all_groups.push(groups[i].name)
            }
            return list_name_all_groups
        },

        convert_array_in_str(arr){
            var str = ''
            for(var cell = 0; cell < arr.length; cell++)
                str = str + arr[cell] + ','
            str = str.substring(0, str.length -1)
            return str
        },

        edit_value(evt, data, groups){
            var list_groups = []
            var list_confirm = []
            console.log('evt: ',evt)

            for(name in groups){
                list_groups.push(groups[name])                
            }
            if(typeof data.confirm === 'string'){
                
                var groups_array = this.groups_choose(data.confirm)
                
                if(groups_array){

                    for(var group_name = 0; group_name < groups_array.length; group_name++){
                        if(list_groups.includes(groups_array[group_name]))
                            list_confirm.push(groups_array[group_name])
                    }                    
                }
                else
                {  
                    if(list_groups.includes(data.confirm))
                        list_confirm.push(data.confirm)
                }
            }else{
            
                for(name in data.confirm){

                    if(list_groups.includes(data.confirm[name]))
                        list_confirm.push(data.confirm[name])                    
                }
            }
            
            var res = {
                'id' : String(data.id),
                'job' : data.job,
                'create' : data.create,
                'data' : data.date_month_year,
                'groups' : list_groups,
                'confirm' : list_confirm,
                'token' : localStorage.getItem('access_token')
            }

                                   
            data.group = list_groups.length === 1 ? list_groups[0] : this.convert_array_in_str(list_groups)
            data.confirm = list_confirm.length === 1 ? list_confirm[0] : this.convert_array_in_str(list_confirm)

            this.$store.dispatch('showcase/editData', res)                    
        },
        
        get_responsible(group_name, responsible){
            
            var list_respon = this.groups_choose(responsible)
            if(list_respon){
                for(var idx = 0; idx < list_respon.length; idx++){
                    var re = /\s*:\s*/;
                    var nUser_nGroup = list_respon[idx].split(re)
                    var nUser = nUser_nGroup[0]
                    var nGroup = nUser_nGroup[1]
                    if(nGroup === group_name)
                        return nUser
                }
            }                            
        }
    },  
    props: {
        fixed: {
            type: Boolean
        },
        data_text: {
            type: String
        },
        user: {
            type: String
        }
    }

})
</script>
<style lang="sass">
    .q-separator
        background: #f44336

 
</style>