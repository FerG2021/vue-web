<script setup>
import { ref } from 'vue';

const is_expanded = ref(false);
const tipoUsuario = localStorage.getItem("tipoUsuario");

const toggleMenu = () => {
	is_expanded.value = !is_expanded.value;
};
</script>

<script>
import { routes } from '../router/index.js';

export default {
	name: 'SidebarComponent',
	data() {
		return { routes };
	},
	methods: {
		async logout() {
			await this.$store.dispatch("logout");

			return this.$router.replace("/login");
		},
		isSectionVisibleForUser(item) {
			return item.includes(this.$store.state.user.tipo_usuario);
		},
		isTitleVisible(name) {
			return !this.is_expanded ? name : '';
		}
	}
};
</script>

<template>
	<aside :class="`${is_expanded && 'is-expanded' }`">
		<div class="logo">
			<img
				src="../assets/modular_logo.jpg"
				alt="Vue"
			>
		</div>

		<div
			v-if="tipoUsuario != 2"
			class="menu-toggle-wrap"
		>
			<button class="menu-toggle">
				<span
					class="material-icons"
					@click="toggleMenu()"
				>
					keyboard_double_arrow_right
				</span>
			</button>
		</div>

		<h3>MENU</h3>
		<div class="menu">
			<template
				v-for="itemRoute in routes"
				:key="itemRoute.path"
			>
				<template v-if="itemRoute.isVisibleInSidebar !== false">
					<div v-if="isSectionVisibleForUser(itemRoute.allowedRoles)">
						<router-link
							class="button"
							:to="itemRoute.path"
							:title="isTitleVisible(itemRoute.name)"
						>
							<span class="material-icons">
								{{ itemRoute.icon }}
							</span>
							<span class="text">
								{{ itemRoute.name }}
							</span>
						</router-link>
					</div>
				</template>
			</template>
		</div>

		<div class="flex" />

		<div
			v-if="tipoUsuario != 2"
			class="menu"
		>
			<div>
				<router-link
					class="button"
					to="/mi-cuenta"
					:title="isTitleVisible('Mi cuenta')"
				>
					<span class="material-icons">account_circle</span>
					<span class="text">{{ $store.state.user.name }}</span>
				</router-link>
			</div>

			<div class="button logout">
				<span
					class="material-icons"
					:title="isTitleVisible('Salir')"
					@click="logout()"
				>
					logout
				</span>
				<span class="text">
					Salir
				</span>
			</div>
		</div>
	</aside>
</template>

<style lang="scss" scoped>
  aside{
    display: flex;
    top: 0;
    flex-direction: column;
    width: calc(2rem + 32px);
    min-height: 100vh;
    overflow: hidden;
    padding: 1rem;

    background-color: var(--dark);
    color: var(--light);

    transition: 0.2s ease-out;

    .flex{
      flex: 1 1 0;
    }

    .logo{
      margin-bottom: 1rem;
      img{
        width: 2rem;
        height: 2rem;
      }
    }

    .menu-toggle-wrap{
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1rem;

      position: relative;
      top: 0;
      transition: 0.2s ease-out;

      .menu-toggle{
        transition: 0.2s ease-out;

        .material-icons{
          font-size: 2rem;
          color: var(--light);
          transition: 0.2s ease-out;
        }

        &:hover{
          .material-icons{
            color: var(--primary);
            transform: translateX(0.5rem);
          }
        }
      }
    }

    h3, .button .text{
      opacity: 0;
      transition: 0.3s ease-out;
    }

    .menu{
      margin: 0 -1rem;

      .button{
        display: flex;
        align-items: center;
        text-decoration: none;

        padding: 0.5rem 1rem;
        transition: 0.2s ease-out;

        .material-icons{
          font-size: 2rem;
          color: var(--light);
          transition: 0.2s ease-out;
        }

        .text{
          color: var(--light);
          transition: 0.2s ease-out;
        }

        &:hover, &.router-link-exact-active{
          background-color: var(--dark-alt);

          .material-icons, .text{
            color: var(--primary);
          }
        }

        &.router-link-exact-active{
          border-right: 5px solid var(--primary);
        }

      }
    }

    &.is-expanded{
      width: var(--sidebar-width);

      .menu-toggle-wrap{
        top: -3rem;
        .menu-toggle{
          transform: rotate(-180deg);
        }
      }

      h3, .button .text{
        opacity: 1;
      }

      h3{
        color: var(--grey);
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
      }

      .button{
        .material-icons{
          margin-right: 1rem;
        }
      }
    }

    @media(max-width: 768px){
      position: fixed;
      z-index: 99;
    }

    .logout{
      cursor: pointer;
    }
  }
</style>