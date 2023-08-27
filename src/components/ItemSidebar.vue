<template>
  <div>
    <div
      v-if="item.type === 'button' && is_expanded"
      class="button logout"
      @click="logout()"
    >
      <span class="material-icons">logout</span>
      <span class="text">{{ item.name }}</span>
    </div>
    <div v-else>
      <router-link class="button" :to="item.route" v-if="is_expanded">
        <span class="material-icons">{{ item.icon }}</span>
        <span class="text">{{ item.name }}</span>
      </router-link>
    </div>

    <el-tooltip
      class="box-item"
      effect="dark"
      :content="item.name"
      placement="right-start"
      v-if="!is_expanded"
    >
      <div v-if="item.type === 'button'" class="button logout">
        <span class="material-icons" @click="logout()">logout</span>
        <span class="text">{{ item.name }}</span>
      </div>
      <div v-else>
        <router-link
          class="button"
          :to="item.route"
          v-if="!is_expanded || is_expanded"
        >
          <span class="material-icons">{{ item.icon }}</span>
          <span class="text">{{ item.name }}</span>
        </router-link>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    is_expanded: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
      return this.$router.replace("/login");
    },
  },
};
</script>

<style scoped lang="scss">
aside {
  h3,
  .button .text {
    opacity: 0;
    transition: 0.3s ease-out;
  }

  .button {
    display: flex;
    align-items: center;
    text-decoration: none;
    cursor: pointer;

    padding: 0.5rem 1rem;
    transition: 0.2s ease-out;

    .material-icons {
      font-size: 2rem;
      color: var(--light);
      transition: 0.2s ease-out;
    }

    .text {
      color: var(--light);
      transition: 0.2s ease-out;
    }

    &:hover,
    &.router-link-exact-active {
      background-color: var(--dark-alt);

      .material-icons,
      .text {
        color: var(--primary);
      }
    }

    &.router-link-exact-active {
      border-right: 5px solid var(--primary);
    }
  }

  &.is-expanded {
    width: var(--sidebar-width);

    .menu-toggle-wrap {
      top: -3rem;
      .menu-toggle {
        transform: rotate(-180deg);
      }
    }

    h3,
    .button .text {
      opacity: 1;
    }

    h3 {
      color: var(--grey);
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
    }

    .button {
      cursor: pointer;
      .material-icons {
        margin-right: 1rem;
      }
    }
  }
}
</style>