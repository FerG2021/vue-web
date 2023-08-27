<template>
  <div
    @click="$router.replace(`${item.route}`)"
    class="botonHome"
  >
    <h3 class="item-name">{{ item.name }}</h3>
    <div class="container-img">
      <div class="img">
        <span class="material-icons iconoTarjeta">{{ item.icon }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.botonHome {
  border: 1px solid #cccccc;
  margin: auto;
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0px 2px 5px #0000002a;
  .item-name {
    text-align: center;
  }
  .container-img {
    display: flex;
    .img {
      margin: auto;
      .iconoTarjeta {
        font-size: 16vh;
        color: var(--dark);
      }
    }
  }
}

.botonHome:hover {
  transform: translateY(-2px);
  box-shadow: 0px 2px 5px #0000002a;
  cursor: pointer;
  background-color: #cccccc;
}
</style>