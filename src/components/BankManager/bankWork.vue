<template>
  <v-card>
    <v-dialog width="650px" v-model="dialog_editWorkBank" v-if="dialog_editWorkBank">
      <BankEdit :isEdit="isEdit" :bid="bid" @close="closeDialog()" />
    </v-dialog>
    <v-card-title>
      <v-chip
        small
        outlined
        dark
        :color="Number(content.isPrivate) == 0 ? 'success' : 'warning'"
        class="mr-2"
        >{{ Number(content.isPrivate) == 0 ? "公开" : "私有" }}</v-chip
      >
      {{ content.BankName }}
      <v-card-subtitle>
        作者:{{ content.author }} | 被使用次数:{{ content.usedTimes }}
      </v-card-subtitle>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text v-if="finishGetData">
      <!-- TAGS -->
      <div class="my-2" style="width: 90%; overflow: hidden">
        标签：
        <v-chip
          small
          label
          color="purple"
          dark
          class="mx-1"
          v-for="(item, i) in tags"
          :key="i"
          >{{ item }}</v-chip
        >
      </div>
      <!-- 题目统计 -->
      <div class="my-3">题目统计:</div>
      <div class="pl-2 my-3">选择题: {{ numOfQue[0] }}道</div>
      <div class="pl-2 my-3">填空题: {{ numOfQue[1] }}道</div>
      <div class="pl-2 my-3">简答题: {{ numOfQue[2] }}道</div>
    </v-card-text>
    <v-card-actions v-if="finishGetData">
      <v-btn color="orange" text @click="showBankQuestion()">
        查看{{ Number(content.isMine) == 1 ? "/编辑" : "" }}作业库内容
      </v-btn>

      <v-btn
        color="orange"
        text
        v-if="Number(content.isMine) == 1 || Number(content.isPrivate) != 1"
      >
        生成分享码
      </v-btn>
    </v-card-actions>
    <v-skeleton-loader
      v-if="!finishGetData"
      class="mx-auto"
      max-width="100%"
      type="card"
    ></v-skeleton-loader>
  </v-card>
</template>

<script>
import { fun_getWorkBankContent } from "../../api/bank";
import { _alert } from "@/plugins/myfun";
import BankEdit from "../../components/BankManager/bankEdit.vue";
export default {
  components: { BankEdit },

  props: ["bid"],
  data() {
    return {
      finishGetData: false,
      content: {},
      tags: [],
      numOfQue: [],
      dialog_editWorkBank: false,
      isEdit: false,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    closeDialog() {
      this.dialog_editWorkBank = false;
    },
    getData() {
      let _this = this;
      _this.finishGetData = false;
      _this.content = {};
      _this.tags = [];
      _this.numOfQue = [];
      fun_getWorkBankContent(this.bid).then((res) => {
        if (Number(res.code) > 0) {
          _this.tags = eval(res.data.tags);
          _this.numOfQue = eval(res.data.numOfQue);
          _this.finishGetData = true;
        } else {
          _alert(res.msg);
        }
        _this.content = res.data;
      });
    },
    showBankQuestion() {
      if (Number(this.content.isMine) == 1) {
        this.isEdit = true;
      }
      this.dialog_editWorkBank = true;
    },
  },
};
</script>

<style scoped></style>
