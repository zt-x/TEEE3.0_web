<template>
  <v-card>
    <v-card-title
      >第{{ qid }} 题
      <v-spacer></v-spacer>
      <v-chip small @click="close()">
        <v-icon small>mdi-close</v-icon>
      </v-chip>
    </v-card-title>
    <v-card-text v-if="qtext != ''">
      <div v-html="qtext"></div>
    </v-card-text>
  </v-card>
</template>

<script>
import { _alert } from "@/plugins/myfun";
import { fun_getQueContent } from "@/api/work";
export default {
  props: ["wid", "qid"],
  data() {
    return {
      qtext: "",
      qtype: "",
      qscore: "",
    };
  },
  created() {
    this.getQue();
  },
  methods: {
    getQue() {
      let _this = this;
      fun_getQueContent(this.wid, this.qid).then((res) => {
        if (res.code > 0) {
          let data = res.data;
          _this.qtext = data.qtext;
          _this.qtype = data.qtype;
          _this.qscore = data.qscore;
          console.log(data);
        } else {
          _this.close();
        }
      });
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style></style>
