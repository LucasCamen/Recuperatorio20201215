<template>

  <section class="src-components-formulario">

    <div class="jumbotron">
      <h2>Gastos</h2>
      <hr />
      <br>

      <form novalidate autocomplete="off" @submit.prevent="enviar()">
          <div class="form-group">
                <label for="nombre">Nombre</label>
                <input 
                    type="text"
                    id="nombre"
                    class="form-control"
                    v-model="v.f.nombre.$model"
                >
                <div v-if="v.f.nombre.$error && v.f.nombre.$dirty" class="alert alert-danger mt-1">
                    <div v-if="v.f.nombre.required.$invalid">Este campo es requerido</div>
                </div>
          </div>

          <div class="form-group">
                <label for="descripcion">Descripción</label>
                <input 
                    type="text"
                    id="descripcion"
                    class="form-control"
                    v-model="v.f.descripcion.$model"
                >
                <div v-if="v.f.descripcion.$error && v.f.descripcion.$dirty" class="alert alert-danger mt-1">
                    <div v-if="v.f.descripcion.required.$invalid">Este campo es requerido</div>
                </div>
          </div>
          <div class="form-group">
              <label for="importe">Importe</label>
              <input 
                  type="text"
                  id="importe"
                  class="form-control"
                  v-model="v.f.importe.$model"
              >
              <div v-if="v.f.importe.$error && v.f.importe.$dirty" class="alert alert-danger mt-1">
                  <div v-if="v.f.importe.required.$invalid">Este campo es requerido</div>
                  <div v-if="v.f.importe.numeric.$invalid">Este campo debe ser numérico</div>
              </div>
          </div>

          <div class="form-group">
                <input 
                    type="submit"
                    :disabled="v.$invalid"
                    class="btn btn-success mt-4"
                    value="Enviar"
                >
          </div>
      </form>
    </div> 
    <div class="table-responsive">
        <table class="table table-dark">
          <tr :style="{color:'cornflowerblue'}">
            <th>NOMBRE</th>
            <th>DESCRIPCIÓN</th>
            <th>IMPORTE</th>
            <th>FECHA</th>
          </tr>
<tr v-for="(gasto,key) in gastos" :key="key">
            <td>{{gasto.nombre}}</td>
            <td>{{gasto.descripcion}}</td>
            <td>{{ponerSignoPesos(gasto.importe)}}</td>
            <td>{{fyhLocal(gasto.createdAt)}}</td>
          </tr>
          <tr :style="{color:'yellow'}">
            <th>TOTAL</th>
            <th></th>
            <th :style="{'color': totalGastos.color}">{{ponerSignoPesos(totalGastos.monto)}}</th>
            <th></th>
          </tr>
    </table>
      </div>
      <p>Respuestas: 1 - B, 2 - B, 3 - C, 4 - C, 5 - (B y C).... </p>        
  </section>
</template>

<script>
  import { required, numeric } from '@vuelidate/validators'
  import { useVuelidate } from '@vuelidate/core'
  import filters from '../filters.js'

  export default  {
    name: 'src-components-formularioVue',
    props: [],
    created () {
        const rules = {
          f: {
            nombre: { 
              required
            },
            descripcion: { 
              required
            },
            importe: { 
              required,
              numeric
            }
          }
        }
        const f = this.f
        this.v = useVuelidate(rules, { f } )
    },
    mixins : [filters],
    mounted () {
        this.getDatosFormAxios()
    },   
    data () {
      return {
          url : 'https://5fd93a617e05f000170d362d.mockapi.io/gastos',
          f : {
            nombre : '',
            descripcion : '',
            importe : ''
          },
          v : null,
          pidiendo: true,
          gastos: [],
      }
    },
    methods: {
        /* Envio de datos del formularioVue al backend */
        async sendDatosFormAxios(datos) {
            try {
              let res = await this.axios.post(this.url, datos, {'content-type': 'application/json'})
              console.log(res.data)
            }
            catch(error) {
              console.log('HTTP POST ERROR', error)
            }
        },

        async enviar() {
            this.v.$touch()
            if(!this.v.$invalid) {
              let form = this.f
              await this.sendDatosFormAxios(form)
              this.resetForm()
              this.v.$reset()
            }
        },
        resetForm() {
            this.v.f.nombre.$model = ''
            this.v.f.descripcion.$model = ''
            this.v.f.importe.$model = ''
        },
        async getDatosFormAxios() {
            try {
              let res = await this.axios(this.url)
              console.log(res.data)
              this.gastos = res.data
            }
            catch(error) {
              console.log('HTTP GET ERROR', error)
            }
            finally {
              this.pidiendo = false
            }
        },
    },
    computed: {
      totalGastos() {
        let monto = 0
        this.gastos.forEach(gasto => {
          monto += Number(gasto.importe)
        });
        return {
          monto
        }
      },
    }
}


</script>

<style scoped lang="css">
  .src-components-formularioVue {

  }

  .jumbotron {
    background-color: rgb(179, 28, 209);
    color: white;
  }

  hr {
    background-color: #ddd;
  }

  pre {
    color: white;
  }

</style>
