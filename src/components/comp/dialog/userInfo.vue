<template>
  <v-dialog v-model="showDialog" width="550px">
    <v-card>
      <v-card-title
        >个人信息页
        <v-spacer></v-spacer>
        <v-chip
          small
          @click="$emit('update:showDialog', false)"
          color="red"
        ></v-chip>
      </v-card-title>
      <v-card tile>666</v-card>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["showDialog"],
};
</script>