<template>
    <q-page>
        <q-page-sticky :offset="fabPos">

              <div 
                direction="up"
                :disable="draggingFab"
                v-touch-pan.prevent.mouse="moveFab"
              >
                <q-btn round  icon="add" id="add_btn" @click="addPopup = true" style="position: absolute; bottom: 50px; right: 50px; background: #9C27B0 !important; color: white"/>
              </div>

        </q-page-sticky>

        <q-dialog target="#add_btn" v-model="addPopup" >
              
              <div class="q-pa-md">
                <q-stepper
                  v-model="step"
                  ref="stepper"
                  dark
                  class="bg-grey-10"
                  active-color="deep-orange"
                  done-color="secondary"
                  animated
                >
                  <q-step
                    :name="1"
                    title="Работа"
                    icon="settings"
                    :done="step > 1"
                  >
                    <q-editor
                      v-model="job"
                      style="background-color: #292828fa"
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
                  </q-step>

                  <q-step
                    :name="2"
                    title="Создано"
                    icon="fas fa-tools"
                    :done="step > 2"
                  >
                    <q-editor
                      v-model="create"
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

                  </q-step>
                  
                  <q-step
                    :name="3"
                    title="Дата"
                    icon="far fa-calendar-alt"
                    :done="step > 3"
                  >
                    <q-date  dark first-day-of-week="1" v-model="date_month_year" mask="DD-MM-YYYY" class=" header_cald" />
                  </q-step>

                  <q-step
                    :name="4"
                    title="Группы"
                    icon="fas fa-users"
                  >
                    
                    <p style="color:#2196f3">Выберите группы</p>
                    <q-select
                      class="select_color_bg"
                      filled
                      v-model="group"
                      use-input
                      use-chips
                      multiple
                      input-debounce="0"
                      
                      :options="list_groups()"
                      
                      style="width: 250px"
                    />
                  </q-step>

                  <template v-slot:navigation>
                    <q-stepper-navigation>
                        
                      <div v-if="step < 4">
                        <q-btn @click="$refs.stepper.next()" color="deep-orange" label="далее" />                                            
                        <q-btn v-if="step > 1" flat color="deep-orange" @click="$refs.stepper.previous()" label="назад" class="q-ml-sm" />
                      </div>

                      <div v-else>                        
                        <q-btn :disable='group&&date_month_year ? false : true' @click="add_n" color="deep-orange" label="добавить" />
                        <q-btn v-if="step > 1" flat color="deep-orange" @click="$refs.stepper.previous()" label="назад" class="q-ml-sm" />
                      </div>                                            

                    </q-stepper-navigation>
                  </template>

                </q-stepper>
              </div>              
            </q-dialog>

    </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'


export default defineComponent({
    name: 'addvalue',
    setup() {

        var addPopup = ref(false)
        const fabPos = ref([18, 18])
        const draggingFab = ref(false)
        var step = ref(1)

        var job = ref(null)
        var create = ref(null)
        var date_month_year = ref(null)
        var user_create = ref(null)
        var group = ref(null)

        return {
            addPopup,
            fabPos, 
            draggingFab,
            moveFab(ev){
                draggingFab.value = ev.isFirst !== true && ev.isFirst !== true
                fabPos.value = [
                    fabPos.value[0] - ev.delta.x,
                    fabPos.value[1] - ev.delta.y
                ]
            },

            step,
            job,
            create,
            date_month_year,
            user_create,
            group
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

            list_groups(){
                var len_groups =  this.$store.state.showcase.groups
                var list_n_g = []
                console.log('groups: ',len_groups)
                for(var i = 0; i<len_groups.length; i++)
                    list_n_g.push(len_groups[i].name)
                console.log('list: ',len_groups)
                return list_n_g
            },
            add_n: function(){
                console.log('run...')
                var today = new Date()
                var dd = String(today.getDate()).padStart(2, '0')
                var mm = String(today.getMonth() + 1).padStart(2, '0')
                var yyyy = today.getFullYear()

                var res = {
                    'user_create':     this.$store.state.showcase.user_data.full_name, // ""text""
                    'email':           this.$store.state.showcase.user_data.email,     // ""text""
                    'job':             this.job,
                    'create':          this.create,
                    'date_month_year': this.date_month_year,
                    'access_token':    localStorage.getItem('access_token'),
                    'curent_date' :    mm+'-'+dd+'-'+yyyy,
                    'group' :          this.group
                }
                console.log(res)
                this.$store.dispatch('showcase/addTable', res)
                setTimeout(() => {
                    this.$store.dispatch('showcase/getTable', localStorage.getItem('access_token'))
                },200)
    
                this.job = ''
                this.create = ''
                this.date_month_year = ''
                this.addPopup = false
                this.step = 1
            }
        }
    
})
</script>
