<template>
  <div>
    <v-navigation-drawer
      app
      :mini-variant="!mini"
      :expand-on-hover="!mini"
      v-model="drawerDisplay"
      :temporary="temp"
    >
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="text-h5 font-weight-black">
            <v-icon>mdi-account</v-icon>
            <v-btn icon> </v-btn>

            <v-btn text>
              <div class="d-flex align-center">
                <v-avatar size="32">
                  <img
                    src="https://cdn.pixabay.com/photo/2020/11/08/10/25/dog-5723334_1280.jpg"
                    alt="avatar"
                  />
                </v-avatar>
                <div class="ml-1 subtitle-2">Admin</div>
              </div>
            </v-btn>

            <v-btn icon>
              <!-- <v-icon> mdi-apps-box </v-icon> -->
            </v-btn>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item
          v-for="item in drawer"
          :key="item.title"
          :to="item.to"
          :href="item.href"
          :target="item.target"
          exact
          color="primary"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- <v-app-bar app flat color="white">
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.lgAndDown"
        @click="drawerDisplay = !drawerDisplay"
      />

      <v-toolbar-items class="d-flex align-center">
        <v-text-field
          hide-details
          flat
          dense
          outlined
          solo
          label="Search"
          prepend-inner-icon="mdi-magnify"
        />
      </v-toolbar-items>

      <v-spacer />

      <v-btn icon>
        <v-icon>
          mdi-bell-outline
        </v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>
          mdi-apps-box
        </v-icon>
      </v-btn>

      <v-btn text>
        <div class="d-flex align-center">
          <v-avatar size="32">
            <img
              src="https://cdn.pixabay.com/photo/2020/11/08/10/25/dog-5723334_1280.jpg"
              alt="avatar"
            />
          </v-avatar>

          <div class="ml-1 subtitle-2">
            Admin
          </div>
        </div>
      </v-btn>
    </v-app-bar> -->

    <v-main>
      <div style="height: 30px"></div>
      <router-view />
      <v-btn
        v-show="$vuetify.breakpoint.mdAndDown"
        color="pink"
        dark
        fixed
        top
        left
        fab
        @click.stop="drawerDisplay = !drawerDisplay"
      >
        <v-icon>mdi-more</v-icon>
      </v-btn>
      <v-footer>
        {{ new Date().getFullYear() }}
        <span class="ml-2"> FOOTER </span>
      </v-footer>
    </v-main>
  </div>
</template>

<script>
export default {
  data: () => ({
    temp: false,
    drawerDisplay: null,
    drawer: [
      { title: "Back to front", icon: "mdi-arrow-left", to: "/" },
      {
        title: "Free Download",
        icon: "mdi-download",
        href: "https://github.com/AGDholo/shock",
        target: "_black",
      },
      {
        title: "Dashboard",
        icon: "mdi-home",
        to: "/dashboard/pages/dashboards/dashboard",
      },
      {
        title: "Profile",
        icon: "mdi-face-profile",
        to: "/dashboard/pages/examples/profile",
      },
      {
        title: "Sign-in",
        icon: "mdi-login",
        to: "/dashboard/pages/examples/sign-in",
      },
    ],
  }),
  computed: {
    mini() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  mounted() {
    this.drawerDisplay = this.$vuetify.breakpoint.smAndDown ? false : true;
  },
};
</script>
