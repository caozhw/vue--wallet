<template>
  <div>
   
    <p>{{title}}</p>
    <p>434</p>
    <p>{{count}}</p>
    <p>{{msg}}</p>
    <button @click="add">增加数值</button>
    <button @click="requestAction">java</button>
    <button @click="testAction">php</button>
  </div>
</template>
<script>
  import util from '../../common/js/util';
  //import {getRequest,getJavaRequest} from '@/axios/axios'
  export default {
  name: 'test',
  data(){
    return {
      title: 'base'
    }
  },
  mounted(){
    //util.getQueryStringByString('ZH');
  },
  computed:{
    count() {
      return this.$store.state.demo.count;
    },
    msg(){
      return this.$store.state.demo.res.msg;
    },
    res(){
      return this.$store.state.demo.res;
    }
  },
  methods:{
    add() {
      this.$store.dispatch('actionIncrease');
    },
    requestAction(){
      let params = {
        api_type:"WEB_API",
        api_method:"AppTrans_Banner",
        site_type:1
      }
      this.$store.dispatch('requestAction',params);
    },
    testAction(){
      let params = {
        api_type:"WEB_API",
        api_method:"AppTrans_Banner",
        username:1
      }
      getRequest(params).then((res) => {
        console.log('res',res);
        if(res.status != 200){

        }else{
          
        }
      }).catch(() => {
      });
    }
   
  }
}
</script>
