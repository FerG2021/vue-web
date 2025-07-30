<script>
import Configuration from './home.configuration';

export default {
	name: 'HomeIndex',
	data() {
		return { Configuration };
	},
	methods: {
		isSectionVisibleForUser(allowedRoles) {
			return allowedRoles.includes(this.$store.state.user.tipo_usuario);
		}
	}
};
</script>

<template>
	<main class="home-page">
		<el-card class="main-container">
			<h1> Home </h1>
			<div
				:gutter="10"
				class="sections-container"
			>
				<template
					v-for="section in Configuration.sections"
					:key="section.route"
				>
					<div
						v-if="isSectionVisibleForUser(section.allowedRoles)"
						class="section-col"
					>
						<el-card
							class="item-card"
							@click="$router.replace(section.route)"
						>
							<h3 class="card-title">
								{{ section.name }}
							</h3>
							<div class="icon-container">
								<span class="material-icons card-icon">
									{{ section.icon }}
								</span>
							</div>
						</el-card>
					</div>
				</template>
			</div>
		</el-card>
	</main>
</template>

<style lang="scss" scoped>
.home-page {
	.main-container {
		height: 100%;
		.sections-container {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
			justify-content: flex-start;
			padding: 10px;
			.section-col {
				flex: 1 1 calc(25% - 20px);
				min-width: 250px;
				max-width: calc(25% - 20px);
				box-sizing: border-box;
				.item-card {
					.card-title {
						text-align: center;
					}
					.icon-container {
						display: flex;
						justify-content: center;
						align-items: center;
						.card-icon {
							font-size: 16vh;
							margin-top: 20px;
							color: var(--dark-alt);
						}
					}
					&:hover {
						transform: translateY(-2px);
						box-shadow: 0px 2px 5px #0000002a !important;
						cursor: pointer;
						background-color: #cccccc;
					}
				}

			}

			@media (max-width: 1200px) {
				.section-col {
					flex: 1 1 calc(33.33% - 20px);
				}
			}

			@media (max-width: 800px) {
				.section-col {
					flex: 1 1 calc(50% - 20px);
				}
			}

			@media (max-width: 500px) {
				.section-col {
					flex: 1 1 100%;
				}
			}
		}
	}
}

</style>