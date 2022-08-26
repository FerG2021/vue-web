import{_ as V,E as b,r as l,o as p,c as w,a as o,w as a,g as C,d as T,e as x,f as y,b as f,F as N,t as $,i as E}from"./index.b93ec07f.js";const M={data(){return{form:{nombre:null,email:null,contrasena:null,repetirContrasena:null},rules:{nombre:[{required:!0,message:"Por favor ingrese un nombre.",trigger:"change"}],email:[{required:!0,message:"Por favor ingrese un email.",trigger:"change"}],contrasena:[{required:!0,message:"Por favor ingrese una contrase\xF1a.",trigger:"change"}],repetirContrasena:[{required:!0,message:"Por favor repita la contrase\xF1a.",trigger:"change"}]}}},methods:{abrir(){this.form.nombre=null,this.form.email=null,this.form.contrasena=null,this.form.repetirContrasena=null,this.$refs.form&&this.$refs.form.resetFields(),this.$refs.modal.abrir()},cerrar(){this.$refs.modal.cerrar()},onSubmit(){let r={nombre:this.form.nombre,email:this.form.email,contrasena:this.form.contrasena,repetirContrasena:this.form.repetirContrasena};this.axios.post("api/usuario/crear",r).then(e=>{if(e.data.code==400){let i="// ";Object.values(e.data.data).forEach(t=>{i=i+" "+t+" //"}),b({type:"error",grouping:!0,message:i,duration:5e3})}else b({type:"success",message:"\xA1Usuario a\xF1adido con \xE9xito!"}),this.$emit("actualizarTabla"),this.cerrar()})},deshabilitarBtnGuardar(){return this.form.nombre==null||this.form.nombre==""||this.form.email==null||this.form.email==""||this.form.nombre==null||this.form.nombre==""||this.form.contrasena==null||this.form.contrasena==""||this.form.repetirContrasena==null||this.form.repetirContrasena==""}}},z=C(" Guardar");function A(r,e,i,h,t,m){const s=l("el-input"),n=l("el-form-item"),_=l("el-form"),g=l("el-button"),v=l("modal");return p(),w("div",null,[o(v,{ref:"modal",titulo:"Nuevo usuario","impedir-close":r.impedirClose},{footer:a(()=>[o(g,{type:"primary",onClick:e[4]||(e[4]=u=>m.onSubmit()),disabled:m.deshabilitarBtnGuardar()},{default:a(()=>[z]),_:1},8,["disabled"])]),default:a(()=>[o(_,{"label-width":"150px",ref:"form",model:t.form,rules:t.rules,"status-icon":""},{default:a(()=>[o(n,{label:"Nombre",prop:"nombre"},{default:a(()=>[o(s,{modelValue:t.form.nombre,"onUpdate:modelValue":e[0]||(e[0]=u=>t.form.nombre=u),placeholder:"Ingrese su nombre y apellido"},null,8,["modelValue"])]),_:1}),o(n,{label:"Email",prop:"email"},{default:a(()=>[o(s,{modelValue:t.form.email,"onUpdate:modelValue":e[1]||(e[1]=u=>t.form.email=u),placeholder:"Ingrese su mail"},null,8,["modelValue"])]),_:1}),o(n,{label:"Contrase\xF1a",prop:"contrasena"},{default:a(()=>[o(s,{modelValue:t.form.contrasena,"onUpdate:modelValue":e[2]||(e[2]=u=>t.form.contrasena=u),type:"password",placeholder:"Ingrese la contrase\xF1a (m\xEDnimo 8 caracteres)"},null,8,["modelValue"])]),_:1}),o(n,{label:"Confirmar contrase\xF1a",prop:"repetirContrasena"},{default:a(()=>[o(s,{modelValue:t.form.repetirContrasena,"onUpdate:modelValue":e[3]||(e[3]=u=>t.form.repetirContrasena=u),type:"password",placeholder:"Confirme la contrase\xF1a ingresada (m\xEDnimo 8 caracteres)"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["impedir-close"])])}var P=V(M,[["render",A]]);const B={data(){return{form:{nombre:null,email:null,contrasena:null,repetirContrasena:null},id:null,articulos:[],loading:!1}},methods:{abrir(r){this.loading=!0,this.id=null,this.id=r,this.form.nombre=null,this.form.email=null,this.form.contrasena=null,this.form.repetirContrasena=null,this.$refs.modal.abrir(),this.form.nombre=null,this.getDatos()},cerrar(){this.$refs.modal.cerrar()},async getDatos(){await this.axios.get("/api/usuario/obtenerDatos/"+this.id).then(r=>{const e=r.data;e.code==200?(this.form.nombre=e.data.nombre,this.form.email=e.data.email,this.loading=!1):this.cerrar()})},async onSubmit(){let r={id:this.id,nombre:this.form.nombre,email:this.form.email};this.form.contrasena!=null?r.contrasena=this.form.contrasena:r.contrasena=null,this.form.repetirContrasena!=null?r.repetirContrasena=this.form.repetirContrasena:r.repetirContrasena=null,console.log(r);const e=await this.axios.put("/api/usuario/actualizar/"+this.id,r);if(console.log(e),e.data.code==200)b({type:"success",message:"\xA1Usuario modificado con \xE9xito!"}),this.$emit("actualizarTabla"),this.cerrar();else if(e.data.code==400){let i="// ";Object.values(e.data.data).forEach(t=>{i=i+" "+t+" //"}),b({type:"error",grouping:!0,message:i,duration:5e3})}},deshabilitarBtnGuardar(){return this.form.nombre==null||this.form.nombre==""}}},S=C("Guardar");function D(r,e,i,h,t,m){const s=l("el-input"),n=l("el-form-item"),_=l("el-form"),g=l("el-button"),v=l("modal"),u=T("loading");return p(),w("div",null,[o(v,{ref:"modal",titulo:"Modificar usuario","impedir-close":r.impedirClose},{footer:a(()=>[o(g,{type:"primary",onClick:e[4]||(e[4]=d=>m.onSubmit()),disabled:m.deshabilitarBtnGuardar()},{default:a(()=>[S]),_:1},8,["disabled"])]),default:a(()=>[x((p(),y(_,{"label-width":"170px",rules:r.formRules},{default:a(()=>[o(n,{label:"Nombre",prop:"nombre"},{default:a(()=>[o(s,{modelValue:t.form.nombre,"onUpdate:modelValue":e[0]||(e[0]=d=>t.form.nombre=d)},null,8,["modelValue"])]),_:1}),o(n,{label:"Email",prop:"email"},{default:a(()=>[o(s,{modelValue:t.form.email,"onUpdate:modelValue":e[1]||(e[1]=d=>t.form.email=d)},null,8,["modelValue"])]),_:1}),o(n,{label:"Contrase\xF1a",prop:"contrasena"},{default:a(()=>[o(s,{modelValue:t.form.contrasena,"onUpdate:modelValue":e[2]||(e[2]=d=>t.form.contrasena=d),type:"password"},null,8,["modelValue"])]),_:1}),o(n,{label:"Repet. contrase\xF1a",prop:"repetirContrasena"},{default:a(()=>[o(s,{modelValue:t.form.repetirContrasena,"onUpdate:modelValue":e[3]||(e[3]=d=>t.form.repetirContrasena=d),type:"password"},null,8,["modelValue"])]),_:1})]),_:1},8,["rules"])),[[u,t.loading]])]),_:1},8,["impedir-close"])])}var G=V(B,[["render",D]]);const q={data(){return{form:{nombre:null,precio:null,stock:null},id:null,articulos:[]}},methods:{abrir(r){this.id=null,this.$refs.modal.abrir(),this.id=r},cerrar(){this.$refs.modal.cerrar()},async eliminar(){const r=await this.axios.delete("/api/usuario/eliminar/"+this.id);if(r.data.code==200)b({type:"success",message:"\xA1Usuario eliminado con \xE9xito!"}),this.$emit("actualizarTabla"),this.cerrar();else if(r.data.code==400){let e="// ";Object.values(r.data.data).forEach(h=>{e=e+" "+h+" //"}),b({type:"error",grouping:!0,message:e,duration:5e3})}}}},j=f("h3",null,"\xBFDesea eliminar el usuario?",-1),F={style:{float:"right"}},I=C(" Cancelar "),O=C(" Confirmar ");function R(r,e,i,h,t,m){const s=l("el-button"),n=l("modal");return p(),w("div",null,[o(n,{ref:"modal",titulo:"Eliminar usuario","impedir-close":r.impedirClose},{default:a(()=>[f("div",null,[j,f("div",F,[o(s,{type:"danger",onClick:e[0]||(e[0]=_=>m.cerrar())},{default:a(()=>[I]),_:1}),o(s,{type:"primary",onClick:e[1]||(e[1]=_=>m.eliminar())},{default:a(()=>[O]),_:1})])])]),_:1},8,["impedir-close"])])}var H=V(q,[["render",R]]);const J={components:{ModalNuevo:P,ModalModificar:G,ModalEliminar:H},data(){return{usuarios:[],usuariosSinProveedores:[],loading:!1}},mounted(){this.obtenerTodos()},methods:{async obtenerTodos(){this.loading=!0,await this.axios.get("/api/usuario/obtenerTodos").then(r=>{this.usuarios=r.data,console.log(this.usuarios),console.log("this.usuarios"),console.log(this.usuarios),this.usuarios.forEach(e=>{e.tipo_usuario==1&&this.usuariosSinProveedores.push(e)})}),this.loading=!1},async generarUsuariosProveedores(){console.log("usuarios proveedores"),this.axios.post("api/usuario/crearUsuarioProveedor").then(r=>{b({type:"success",message:"\xA1Usuarios proveedores a\xF1adidos con \xE9xito!"}),this.obtenerTodos()})}}},K={class:"about-page"},L=f("h1",null,"Usuarios",-1),Q=C(" Nuevo "),W={class:"contenedor-tabla"},X=f("span",{class:"material-icons"},"edit",-1),Y=f("span",{class:"material-icons"},"delete",-1);function Z(r,e,i,h,t,m){const s=l("el-button"),n=l("el-table-column"),_=l("el-table"),g=l("el-card"),v=l("modal-nuevo"),u=l("modal-modificar"),d=l("modal-eliminar"),k=T("loading");return p(),w(N,null,[f("main",K,[o(g,null,{header:a(()=>[L]),default:a(()=>[o(s,{type:"primary",onClick:e[0]||(e[0]=c=>r.$refs.modalNuevo.abrir()),class:"btnElement",style:{"margin-left":"10px"}},{default:a(()=>[Q]),_:1}),f("div",W,[x((p(),y(_,{data:t.usuariosSinProveedores,fixed:""},{default:a(()=>[o(n,{label:"Nombre",prop:"nombre"},{default:a(c=>[f("span",null,$(c.row.name),1)]),_:1}),o(n,{label:"Email",prop:"email"},{default:a(c=>[f("span",null,$(c.row.email),1)]),_:1}),o(n,{label:"Editar",prop:"editar","header-align":"right",align:"right",width:"90px"},{default:a(c=>[c.row.id!=r.$store.state.user.id?(p(),y(s,{key:0,type:"primary",circle:"",onClick:U=>r.$refs.modalModificar.abrir(c.row.id)},{default:a(()=>[X]),_:2},1032,["onClick"])):E("",!0)]),_:1}),o(n,{label:"Eliminar",prop:"eliminar","header-align":"right",align:"right",width:"90px"},{default:a(c=>[c.row.id!=r.$store.state.user.id?(p(),y(s,{key:0,type:"danger",circle:"",onClick:U=>r.$refs.modalEliminar.abrir(c.row.id)},{default:a(()=>[Y]),_:2},1032,["onClick"])):E("",!0)]),_:1})]),_:1},8,["data"])),[[k,t.loading]])])]),_:1})]),o(v,{ref:"modalNuevo",onActualizarTabla:m.obtenerTodos},null,8,["onActualizarTabla"]),o(u,{ref:"modalModificar",onActualizarTabla:m.obtenerTodos},null,8,["onActualizarTabla"]),o(d,{ref:"modalEliminar",onActualizarTabla:m.obtenerTodos},null,8,["onActualizarTabla"])],64)}var re=V(J,[["render",Z]]);export{re as default};