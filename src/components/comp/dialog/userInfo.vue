<template>
  <v-dialog persistent v-model="showDialog" width="550px">
    <v-card>
      <v-img src="/img/info_bak.png" class="white--text" height="150px">
        <v-card-title>
          <v-spacer></v-spacer>
          <v-chip
            small
            @click="$emit('update:showDialog', false)"
            color="red"
          ></v-chip>
        </v-card-title>
      </v-img>
      <v-card height="300px" tile>
        <v-btn
          absolute
          fab
          top
          right
          style="height: 125px; width: 125px; left: 38.9%; top: -62.5px"
        >
          <v-avatar size="115">
            <v-img :src="user.avatar"></v-img>
          </v-avatar>
        </v-btn>
        <v-card-title>{{ user.uname }}</v-card-title>
        <v-card-text>
          <v-chip color="primary" style="border-radius: 2px">333</v-chip>
        </v-card-text>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["showDialog"],
  data() {
    return {
      user: {
        avatar:
          "https://www.bing.com/th?id=OIP._J04pCmHCUfm4hf-ikRBhAAAAA&w=150&h=150&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2",
        uname: "王倩",
      },
    };
  },
};
</script>