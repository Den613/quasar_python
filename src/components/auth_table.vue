<template>

   
    <q-page  class="q-pa-lg">
        <div>
          
          
            <q-card class="q-pa-md" dark style='color: #ff9800'>
            <div v-if="String(user.privilege) === 'admin'">
                <h4>Admin</h4>
            </div>
            <div v-else>
                <div style='font-size: 40px'>User</div>
                <div class="row">
                  <h5>группа:</h5>
                  <div style="margin-left: 10px">

                    <h5>
                      <q-chip outline square color="deep-orange" text-color="white">
                        {{user.group.name}}
                      </q-chip>
                    </h5>

                  </div>
                </div>
                
            </div>
            <p style="font-weight: bold">name : {{user.full_name}}</p> 
            <p style="font-weight: bold">email : {{user.email}}</p>
            <q-btn style='background: #4caf50 !important;color : white; min-width: 300px' label="exit" @click="exit_a()"/>



            </q-card>

            <br>

            <q-table
              dark
              
              class="sticky-header"
              title=""              
              :columns="columns"
              :rows="rows"
              row-key="name"
             
              :virtual-scroll-sticky-size-start="48"
              :rows-per-page-options="[0]"
              virtual-scroll    
              v-model="pagination" 
              :filter="filter"             
            >

            <template v-slot:top-left>
              <q-input borderless dense class="color_text" debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon style ='color: #03a9f4' name="search"/>
                </template>
              </q-input>
            </template>
                    
            <template v-slot:body="props">
                                
                <q-tr :props="props" >
                    
                    <q-td key="job" :props="props"  @click="click_text(props.row), fixed = true">                    
                      <div v-if='props.row.job' >
                        <div v-if='props.row.job.length < 30'>
                          {{props.row.job}}
                        </div>
                        <div v-else class='row' >
                          {{show_more(props.row.job)}} 
                          <!-- <div style="margin-left: 10px; color: #2196f3">show more</div> -->
                        </div>                        
                      </div>
                    </q-td>           

                    <q-td key="create" :props="props" @click="click_text(props.row), fixed = true">                      
                        <div v-if='props.row.create'  >
                        <div v-if='props.row.create.length < 30'>
                          {{props.row.create}}
                        </div>
                        <div v-else class = 'flex row justify-start'>
                          {{show_more(props.row.create)}} 
                          <!-- <div style="margin-left: 10px; color: #2196f3" >show more</div>-->
                        </div>                        
                      </div>                        
                    </q-td> 
                    
                    <q-td key="date_month_year" :props="props" @click="click_text(props.row), fixed = true">                        
                        {{props.row.date_month_year}}                        
                    </q-td> 

                    <q-td key="user_create" :props="props" @click="click_text(props.row), fixed = true">
                        
                        <div v-if="String(user.privilege) === 'admin'">

                            <q-badge color="purple">
                                {{props.row.user_create}}
                            </q-badge>

                        </div>
                        <div v-else>

                            <q-badge style="background-color: #009688">
                                {{props.row.user_create}}
                            </q-badge>

                        </div>
                    </q-td> 
                    
                    <q-td key="curent_date" :props="props" @click="click_text(props.row), fixed = true">                        
                        {{props.row.curent_date}}                        
                    </q-td> 

                    <q-td key="group" :props="props">

                      <div v-for="name in groups_choose(props.row.group)" v-bind:key="name">
                        <div v-if="user.group">
                          <div v-if="name === user.group.name">
                            <div v-if='get_input_group(name, props.row.confirm)'>
                              <q-chip style="background: #21d428 !important; color:white">                                                  
                                  {{name}}                          
                              </q-chip>
                            </div>
                            <div v-else>
                              <div v-if="user.privilege === 'admin_user'">
                                <q-chip clickable @click="confirm_group(name, props.row, user)" color="deep-orange" text-color="white">                                                  
                                  {{name}}                          
                                </q-chip>
                              </div>
                              <div v-else>
                                <q-chip color="red" text-color="white">
                                  {{name}}
                                </q-chip>
                              </div>


                            </div>
                          
                          </div>
                          <div v-else>
    
                              <div v-if="get_input_group(name, props.row.confirm)">
                                <q-chip outline color="green">                                                  
                                  {{name}}                          
                                </q-chip>
                              </div>
                              <div v-else>
                                <q-chip outline color="primary" style="color:white">                                                  
                                  {{name}}                          
                                </q-chip>
                              </div>
                                                                                     
                          </div>                                                                 

                        </div>
                      
                        <div v-else>
                          
                          <div v-if="get_input_group(name, props.row.confirm)">
                                <q-chip outline color="green">                                                  
                                  <q-tooltip
                                    anchor="top middle"
                                    :offset="[50, 50]"
                                    class="bg-purple text-body2"
                                    transition-hide="scale"
                                    transition-show="scale"
                                  >
                                  {{get_responsible(name, props.row.responsible)}}
                                  </q-tooltip>
                                  {{name}}                       
                                </q-chip>
                              </div>
                              <div v-else>
                                <q-chip outline color="primary" style="color:white">                                                  
                                  {{name}}                                 
                                </q-chip>
                              </div>
                        </div>
                      </div>

                    </q-td>

                    <q-td key="status" :props="props">
                      
                      <dev v-if="user.privilege === 'admin'">
                          
                        <div class="q-gutter-sm row">                          
                          <q-checkbox dark v-model="props.row.status_perform"    label="Выполненно"  style="color:#2196f3" color="green" @click="status_job(props.row, 'perform')"/>
                          <q-checkbox dark v-model="props.row.status_cancel"     label="Отменена"    style="color:#2196f3" color="red"   @click="status_job(props.row, 'cancel')"/>
                        </div>

                      </dev>
                      <dev v-else> 
                        <div v-if='!props.row.status_perform && !props.row.status_cancel'>
                          <q-chip outline color="primary" text-color="white">
                            Выполняется
                          </q-chip>
                        </div>
                        <div v-if='!props.row.status_perform && props.row.status_cancel'>
                          <q-chip outline color="red" text-color="white">
                            Отменена
                          </q-chip>
                        </div>
                        <div v-if='props.row.status_perform && !props.row.status_cancel'>
                          <q-chip outline color="teal" text-color="white">
                            Выполненно
                          </q-chip>
                        </div>
                      </dev>

                    </q-td>
                      <q-dialog persistent full-width class='q_bg_color_dialog' v-model="fixed" >
                        <q-card  style="background: #292828;">
                          <q-card-section style="max-width: 100%" class="scroll">
                      
                            <modDialog
                              :fixed="fixed"
                              :data_text="data_text"                             
                              :user="user"
                            />

                          </q-card-section>
                        
                        </q-card>
                      </q-dialog>
                                    
                </q-tr>
            
            </template>
                    
            </q-table>
          
           <addvalue v-if="user.privilege === 'admin'"/>
                              
        </div>
    </q-page>    
    
</template>

<script>

import {defineComponent, ref} from 'vue'
import modDialog from 'components/module_dialog.vue'
import addvalue from 'components/add_data.vue'
import { GROUPS } from 'src/store/showcase/mutations'

export default defineComponent({ 
  components:{
    modDialog,
    addvalue
  },
  name: 'tables',
  setup(){

    var fixed = ref(false)
    var data_text = ref(null)
    var filter = ref('')
 
                    
    return {
        filter,

        data_text,
        fixed,       

        pagination: {
            sortBy: 'last_name',
            descending: false,
            rowsPerPage: 0
        }               
    }
  },
  methods: {
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
    },
    status_job(row, action){

      var status = {}
      var s_p = false
      var s_c = false
      var token = ''

      s_p = row.status_perform ? true : false
      s_c = row.status_cancel ? true : false
      token = localStorage.getItem('access_token')     

      if(s_p && action ==='perform'){      
        s_c = false
      }

      if(s_c && action === 'cancel'){
        s_p = false
      }

      status = {
        'id' : String(row.id),
        'status_perform' : s_p,
        'status_cancel' : s_c,
        'token' : token
      }
      
      this.$store.dispatch('showcase/statusJob', status)

      setTimeout(() => {        
        this.$store.dispatch('showcase/getTable', localStorage.getItem('access_token'))
      },200)
      
    },
    
    get_input_group(name_group, groups){
      if (typeof groups === 'string')
        groups = this.groups_choose(groups)
      if(groups){
        for(var i=0; i < groups.length; i++){
          if(name_group === groups[i]){
            return true
          }
        }
      }else{
        return false
      }
    },

    confirm_group(data, row, user){

      var res = {
        "id" : row.id,
        "responsible" : user.full_name+":"+data,
        "confirm" : data,
        'access_token': localStorage.getItem('access_token'),

      }

      this.$store.dispatch('showcase/addTableConfirm', res)
      setTimeout(() => {
        this.$store.dispatch('showcase/getTable', localStorage.getItem('access_token'))
      },200)

    },

    groups_choose(data){
      if(data){
        var re = /\s*,\s*/;
        var nameList = data.split(re);
      }
      return nameList
    },
    

    click_text(data){
      this.data_text = data
    },
    
    show_more(text){
      if(text){
          var word = ''
          for(var idx = 0; idx < text.length; idx++){
            if(idx < 30){
              word += text[idx]            
            }          
          }
          return word+' ...'              
      }
    },

    exit_a(){      
        location.reload()
        localStorage.clear()
        document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); })    
    }
  },

  computed: {
    
    columns(){
      return [
        {name: 'job',             align: 'left', label: 'работа',      field: 'job', sortable: true},
        {name: 'create',          align: 'left', label: 'создано',     field: 'create', sortable: true},
        {name: 'date_month_year', align: 'left', label: 'дата',        field: 'date_month_year', sortable: true},
        {name: 'user_create',     align: 'left', label: 'кем создано', field: 'user_create', sortable: true},
        {name: 'curent_date',     align: 'left', label: 'дата создания',            field: 'curent_date', sortable: true},
        {name: 'group',           align: 'left', label: 'группы',      field: 'group'},
        {name: 'status',          align: 'left', label: 'статус',      field: 'status', style: 'width: 25%'}
      ]
    },

    rows: {
      get(){        

        if(this.$store.state.showcase.table){
          
          var id = Object.keys(this.$store.state.showcase.table) //id 
          var res = []
        
          for(var i = 0; i < id.length; i++){
            
            res.push({
              id :             this.$store.state.showcase.table[id[i]].id,
              job :            this.$store.state.showcase.table[id[i]].job,
              create :         this.$store.state.showcase.table[id[i]].create,
              date_month_year: this.$store.state.showcase.table[id[i]].date_mounth_year,
              user_create:     this.$store.state.showcase.table[id[i]].user_create,
              curent_date:     this.$store.state.showcase.table[id[i]].curent_date,
              group:           this.$store.state.showcase.table[id[i]].group,
              confirm:         this.groups_choose(this.$store.state.showcase.table[id[i]].confirm),
              status_perform : this.$store.state.showcase.table[id[i]].status_perform,
              status_cancel :  this.$store.state.showcase.table[id[i]].status_cancel,
              status:          null,
              responsible:     this.$store.state.showcase.table[id[i]].responsible
            })

          }
          
          return res
        }
        else {      
          return  [
                    {
                      job : null,
                      create : null,
                      date_month_year: null,
                      user_create: null 
                    }        
          ]
        }
      }
    }
  },
   mounted() {
     var token = localStorage.getItem('access_token')
     this.$store.dispatch('showcase/getTable', token)
     this.$store.dispatch('showcase/getGroup',token)
   },

  props: {
    user: {
      type: String
    }
  }

})
</script>
<style lang="sass">

    .q-table--no-wrap th, .q-table--no-wrap td
        white-space: nowrap

    .sticky-header  
        max-height: 700px
        .q-table__top,
        .q-table__bottom,
        thead tr:first-child th   
            background-color: #1d1d1d
            color: #e91e63
        thead tr th
            position: sticky
            z-index: 1
        thead tr:first-child th
            top: 0
        &.q-table--loading thead tr:last-child th
            top: 48px
    
    .label_input
        .q-field__label
            color: #f44336
        .q-field__native
            color: rgb(252 252 252)
    
    .header_cald
        .q-date__header
            color: #F44336
            background-color: #191919
    .q_bg_color_dialog
        .q-dialog__backdrop
            background: #00000008
    .q_edit_bg_color
      .q-editor
            background-color: #292828fa
    .select_color_bg
      .q-field--auto-height, .q-field__control
          background: #2196f31c

    .color_text
      .q-field__native, .q-field__prefix, .q-field__suffix, .q-field__input
        color: #2196f3
    .color_search
      .q-field__marginal
        color: #2196f3
    
</style>