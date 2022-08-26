import{_ as g,E as T,r,o as _,c as v,a as o,w as t,g as p,d as x,e as C,f as k,b as d,F as S,t as z}from"./index.a8db798b.js";const E={data(){return{impedirClose:!1,form:{nombre:null}}},methods:{abrir(){this.form.nombre=null,this.$refs.modal.abrir()},cerrar(){this.$refs.modal.cerrar()},onSubmit(){let e={nombre:this.form.nombre};this.axios.post(this.base_url+"/unidad-medida/crear",e).then(a=>{T({type:"success",message:"\xA1Unidad de medida a\xF1adida con \xE9xito!"}),this.$emit("actualizarTabla"),this.cerrar()})},deshabilitarBtnGuardar(){return this.form.nombre==null||this.form.nombre==""}}},V=p(" Guardar");function B(e,a,$,y,l,i){const n=r("el-input"),s=r("el-form-item"),m=r("el-form"),f=r("el-button"),b=r("modal");return _(),v("div",null,[o(b,{ref:"modal",titulo:"Nueva unidad de medida","impedir-close":l.impedirClose},{footer:t(()=>[o(f,{type:"primary",onClick:a[1]||(a[1]=c=>i.onSubmit()),disabled:i.deshabilitarBtnGuardar()},{default:t(()=>[V]),_:1},8,["disabled"])]),default:t(()=>[o(m,{"label-width":"120px",rules:e.formRules},{default:t(()=>[o(s,{label:"Nombre",prop:"nombre"},{default:t(()=>[o(n,{modelValue:l.form.nombre,"onUpdate:modelValue":a[0]||(a[0]=c=>l.form.nombre=c)},null,8,["modelValue"])]),_:1})]),_:1},8,["rules"])]),_:1},8,["impedir-close"])])}var M=g(E,[["render",B]]);const A={data(){return{form:{nombre:null},id:null,categorias:[],loading:!1}},methods:{abrir(e){this.loading=!0,this.id=null,this.id=e,this.$refs.modal.abrir(),this.form.nombre=null,this.getDatos()},cerrar(){this.$refs.modal.cerrar()},async getDatos(){await this.axios.get(this.base_url+"/unidad-medida/obtenerDatos/"+this.id).then(e=>{const a=e.data;console.log(a),a!=null?(this.form.nombre=a.nombre,this.loading=!1):this.cerrar()})},onSubmit(){let e={id:this.id,nombre:this.form.nombre};this.axios.put(this.base_url+"/unidad-medida/actualizar/"+this.id,e).then(a=>{T({type:"success",message:"\xA1Unidad de medida modificada con \xE9xito!"}),this.$emit("actualizarTabla"),this.cerrar()}).catch(a=>{console.log(a)})},deshabilitarBtnGuardar(){return this.form.nombre==null||this.form.nombre==""}}},D=p("Guardar");function G(e,a,$,y,l,i){const n=r("el-input"),s=r("el-form-item"),m=r("el-form"),f=r("el-button"),b=r("modal"),c=x("loading");return _(),v("div",null,[o(b,{ref:"modal",titulo:"Modificar unidad de medida","impedir-close":e.impedirClose},{footer:t(()=>[o(f,{type:"primary",onClick:a[1]||(a[1]=h=>i.onSubmit()),disabled:i.deshabilitarBtnGuardar()},{default:t(()=>[D]),_:1},8,["disabled"])]),default:t(()=>[C((_(),k(m,{"label-width":"120px",rules:e.formRules},{default:t(()=>[o(s,{label:"Nombre",prop:"nombre"},{default:t(()=>[o(n,{modelValue:l.form.nombre,"onUpdate:modelValue":a[0]||(a[0]=h=>l.form.nombre=h)},null,8,["modelValue"])]),_:1})]),_:1},8,["rules"])),[[c,l.loading]])]),_:1},8,["impedir-close"])])}var U=g(A,[["render",G]]);const F={data(){return{id:null}},methods:{abrir(e){this.id=null,this.$refs.modal.abrir(),this.id=e},cerrar(){this.$refs.modal.cerrar()},async eliminar(){await this.axios.delete(this.base_url+"/unidad-medida/eliminar/"+this.id).then(e=>{T({message:"\xA1Unidad de medida eliminada con \xE9xito!",type:"success"}),this.$emit("actualizarTabla"),this.cerrar()})}}},R=d("h3",null,"\xBFDesea eliminar la unidad de medida?",-1),L={style:{float:"right"}},j=p(" Cancelar "),q=p(" Confirmar ");function H(e,a,$,y,l,i){const n=r("el-button"),s=r("modal");return _(),v("div",null,[o(s,{ref:"modal",titulo:"Eliminar unidad de medida","impedir-close":e.impedirClose},{default:t(()=>[d("div",null,[R,d("div",L,[o(n,{type:"danger",onClick:a[0]||(a[0]=m=>i.cerrar())},{default:t(()=>[j]),_:1}),o(n,{type:"primary",onClick:a[1]||(a[1]=m=>i.eliminar())},{default:t(()=>[q]),_:1})])])]),_:1},8,["impedir-close"])])}var I=g(F,[["render",H]]);const J={components:{ModalNuevo:M,ModalModificar:U,ModalEliminar:I},data(){return{categorias:[],categoriasSelect:[],loading:!1,value:null}},mounted(){this.obtenerTodos()},methods:{async obtenerTodos(){this.loading=!0,await this.axios.get(this.base_url+"/unidad-medida/obtenerTodos").then(e=>{this.categorias=e.data,console.log(this.categorias)}),this.loading=!1,this.obtenerTodosSelect()},async obtenerTodosSelect(){await this.axios.get(this.base_url+"/unidad-medida/obtenerTodosSelect").then(e=>{this.categoriasSelect=e.data,console.log(this.categoriasSelect)})},mostrar(){console.log(this.value.id)},obtenerLabel(e){console.log(e)}}},K=d("h1",null,"Unidades de medida",-1),O=p(" Nuevo "),P={class:"contenedor-tabla"},Q=d("span",{class:"material-icons"},"edit",-1),W=d("span",{class:"material-icons"},"delete",-1);function X(e,a,$,y,l,i){const n=r("el-button"),s=r("el-table-column"),m=r("el-table"),f=r("el-card"),b=r("modal-nuevo"),c=r("modal-modificar"),h=r("modal-eliminar"),w=x("loading");return _(),v(S,null,[d("main",null,[o(f,null,{header:t(()=>[K]),default:t(()=>[o(n,{type:"primary",onClick:a[0]||(a[0]=u=>e.$refs.modalNuevo.abrir()),class:"btnElement",style:{"margin-left":"10px"}},{default:t(()=>[O]),_:1}),d("div",P,[C((_(),k(m,{data:l.categorias,fixed:""},{default:t(()=>[o(s,{label:"Nombre",prop:"descripcion"},{default:t(u=>[d("span",null,z(u.row.nombre),1)]),_:1}),o(s,{label:"Editar",prop:"editar","header-align":"right",align:"right"},{default:t(u=>[o(n,{type:"primary",circle:"",onClick:N=>e.$refs.modalModificar.abrir(u.row.id)},{default:t(()=>[Q]),_:2},1032,["onClick"])]),_:1}),o(s,{label:"Eliminar",prop:"eliminar","header-align":"right",align:"right"},{default:t(u=>[o(n,{type:"danger",circle:"",onClick:N=>e.$refs.modalEliminar.abrir(u.row.id)},{default:t(()=>[W]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"])),[[w,l.loading]])])]),_:1})]),o(b,{ref:"modalNuevo",onActualizarTabla:i.obtenerTodos},null,8,["onActualizarTabla"]),o(c,{ref:"modalModificar",onActualizarTabla:i.obtenerTodos},null,8,["onActualizarTabla"]),o(h,{ref:"modalEliminar",onActualizarTabla:i.obtenerTodos},null,8,["onActualizarTabla"])],64)}var Z=g(J,[["render",X]]);export{Z as default};