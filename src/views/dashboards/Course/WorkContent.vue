<template>
  <div class="px-4">
    <v-dialog persistent width="600px" v-model="showCard">
      <StuAns
        @closeSubmitCard="closeSubmitCard($event)"
        v-if="showCard"
        :SUBMIT="submit_chose"
        :qscores="qscores"
      />
    </v-dialog>
    <v-container fluid>
      <v-row>
        <!-- Submitted WorkPlace -->

        <v-col cols="12" lg="8">
          <v-sheet
            class="py-6 transparent"
            :class="{
              'pl-10':
                $vuetify.breakpoint.lgAndUp || $vuetify.breakpoint.lgOnly,
              'px-10': !(
                $vuetify.breakpoint.lgAndUp || $vuetify.breakpoint.lgOnly
              ),
            }"
          >
            <!-- Header -->
            <div class="text--secondary">
              <span class="text-h3">LIST </span>
              <span class="text-h5">| 作业提交列表</span>
              <span></span>
            </div>
            <!-- Body -->

            <v-card class="mt-5">
              <v-tabs
                v-model="tab"
                background-color="transparent"
                color="basil"
              >
                <v-tab>
                  <v-chip color="warning" small>{{ numOfUnFihish }}</v-chip>
                  <span class="pl-2">未批改</span>
                </v-tab>
                <v-tab>
                  <v-chip small color="success">{{ numOfFinish }}</v-chip>
                  <span class="pl-2">已批改</span>
                </v-tab>
                <v-tab>
                  <span class="pl-2">打包下载附件</span>
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <!-- 未批改的作业 -->
                <v-tab-item>
                  <v-card color="basil" flat class="pt-3 pb-3">
                    <!-- TODO 尝试Submit换成普通的Table -->
                    <v-data-table
                      class="rounded-0"
                      :loading="!finishGetSubmtis"
                      loading-text="正在努力加载课程学生信息 ..."
                      :headers="submit_tab_headers"
                      :items="submit_unfinish"
                      :search="search_submits"
                      :items-per-page="10"
                      :page.sync="pageOfSubmtis_fin"
                      @page-count="pageCountOfSubmit_fin = $event"
                      hide-default-footer
                    >
                      <!-- 学生姓名 -->
                      <template v-slot:item.uname="{ item }">
                        <v-chip outlined>
                          <v-avatar left size="30">
                            <v-img :src="item.avatar"></v-img>
                          </v-avatar>
                          {{ item.uname }}</v-chip
                        >
                      </template>
                      <!-- 学生分数 -->
                      <template v-slot:item.score="{ item }">
                        <v-chip
                          :color="
                            item.score > 60
                              ? item.score > 75
                                ? item.score > 90
                                  ? 'success'
                                  : 'info'
                                : 'warning'
                              : 'error'
                          "
                          small
                          >{{ item.score.toFixed(1) }}</v-chip
                        >
                      </template>
                      <!-- 批改选项 -->
                      <template v-slot:item.func="{ item }">
                        <v-chip
                          small
                          color="primary"
                          class="mr-2"
                          @click="showSubmitCard(item)"
                          >批改</v-chip
                        >
                        <span color="grey">|</span>
                        <v-chip small color="error" class="ml-2">打回</v-chip>
                      </template>
                    </v-data-table>
                    <div class="text-center pt-2">
                      <v-pagination
                        v-model="pageOfSubmtis_fin"
                        :length="pageCountOfSubmit_fin"
                      ></v-pagination>
                    </div>
                  </v-card>
                </v-tab-item>
                <!-- 已经批改的作业 -->

                <v-tab-item>
                  <v-card color="basil" flat class="pt-3 pb-3">
                    <!-- <SubmitWork
                      transition="scroll-y-transition"
                      v-for="(submit, index) in submit_finish"
                      :key="index"
                      :SUBMIT="submit"
                      @flushSubmit="flushSubmit"
                      :qscores="qscores"
                      class="mb-1"
                    /> -->
                    <v-data-table
                      class="rounded-0"
                      :loading="!finishGetSubmtis"
                      loading-text="正在努力加载课程学生信息 ..."
                      :headers="submit_tab_headers"
                      :items="submit_finish"
                      :items-per-page="10"
                      :page.sync="pageOfSubmtis"
                      @page-count="pageCountOfSubmit = $event"
                      hide-default-footer
                    >
                      <!-- 学生姓名 -->
                      <template v-slot:item.uname="{ item }">
                        <v-chip outlined>
                          <v-avatar left size="30">
                            <v-img :src="item.avatar"></v-img>
                          </v-avatar>
                          {{ item.uname }}</v-chip
                        >
                      </template>
                      <!-- 学生分数 -->
                      <template v-slot:item.score="{ item }">
                        <v-chip
                          :color="
                            item.score > 60
                              ? item.score > 75
                                ? item.score > 90
                                  ? 'success'
                                  : 'info'
                                : 'warning'
                              : 'error'
                          "
                          small
                          >{{ item.score.toFixed(1) }}</v-chip
                        >
                      </template>
                      <!-- 批改选项 -->
                      <template v-slot:item.func="{ item }">
                        <v-chip
                          small
                          color="primary"
                          class="mr-2"
                          @click="showSubmitCard(item)"
                          >批改</v-chip
                        >
                        <span color="grey">|</span>
                        <v-chip small color="error" class="ml-2">打回</v-chip>
                      </template>
                    </v-data-table>
                    <div class="text-center pt-2">
                      <v-pagination
                        v-model="pageOfSubmtis"
                        :length="pageCountOfSubmit"
                      ></v-pagination>
                    </div>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card class="mx-auto">
                    <div class="mx-auto">
                      <v-btn class="my-5 mx-auto" @click="downloadFiles"
                        >打包下载</v-btn
                      >
                    </div>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
              <div style="height: 10px"></div>
            </v-card>
          </v-sheet>
        </v-col>
        <!-- Statistic -->
        <v-col cols="12" lg="4" v-show="!$vuetify.breakpoint.mdAndDown">
          <v-sheet
            class="py-6 transparent"
            :class="{
              'pr-10':
                $vuetify.breakpoint.lgAndUp || $vuetify.breakpoint.lgOnly,
              'px-10': !(
                $vuetify.breakpoint.lgAndUp || $vuetify.breakpoint.lgOnly
              ),
            }"
          >
            <div class="text--secondary">
              <!-- <span class="text-h3">_</span> -->

              <span class="text-h5 px-5">统计</span>
              <span class="text-h3" style="color: #f1efed"> (*/ω＼*) </span>
              <span></span>
            </div>
            <v-card class="mt-5">
              <v-card-title>
                {{ statistic_content.workname }}
                <v-spacer></v-spacer>
                <v-icon small @click="getStatistics()">fas fa-redo</v-icon>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <div style="margin: 0 auto; width: 400px; height: 400px">
                        <Chart_score_statistics :statistic="sta" />
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-sheet>
        </v-col>
      </v-row>
      <v-snackbar
        v-model="snackbar"
        top
        :color="snackbar_color"
        dense
        timeout="2000"
      >
        {{ snackbar_msg }}
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import SubmitWork from "@/components/CourseContentChildren/work/submitWork.vue";
import StuAns from "@/components/CourseContentChildren/stuAns.vue";

import Chart_score_statistics from "@/components/CourseContentChildren/charts/SubmitStatic/chart_score_statistics.vue";
import { fun_getWorkContent } from "@/api/work";
import { fun_getAllSubmitsByWid, fun_getSubmitSummary } from "@/api/submit";
import { download } from "@/api/download";

const streamSaver = require("streamsaver");

export default {
  components: { StuAns, SubmitWork, Chart_score_statistics },
  computed: {
    wid() {
      if (this.$route.params.wid == null) {
        //测试环境
        return 29;
      } else {
        return this.$route.params.wid;
      }
    },
    numOfFinish() {
      return this.submit_finish.length;
    },
    numOfUnFihish() {
      return this.submit_unfinish.length;
    },
  },
  data() {
    return {
      tab: null,
      items: ["未批改", "已批改"],
      showCard: false,
      submits: [],
      sta: [
        // { value: 2, name: "不及格" },
      ],
      finishGetSubmtis: false,
      submit_finish: [],
      submit_unfinish: [],
      submit_tab_headers: [
        {
          text: "学生姓名",
          align: "start",
          sortable: false,
          value: "uname",
        },
        {
          text: "学号",
          align: "start",
          value: "uid",
        },
        {
          text: "分数",
          align: "center",
          value: "score",
        },
        {
          text: "操作",
          align: "center",
          value: "func",
          sortable: false,
        },
      ],
      submit_chose: null,
      search_submits: "",
      pageOfSubmtis: 1,
      pageCountOfSubmit: 0,
      pageOfSubmtis_fin: 1,
      pageCountOfSubmit_fin: 0,

      pageCount: 0,
      statistic_content: {},
      sid: 0,
      submitCard: false,
      qs: [],
      qscores: [],
      snackbar_msg: "",
      snackbar: false,
      snackbar_color: "primary",
    };
  },
  methods: {
    showSubmitCard(item) {
      this.submit_chose = Object.assign({}, item);
      this.showCard = true;
    },
    closeSubmitCard(val) {
      this.showCard = false;
      this.flushSubmit();
    },
    async flushSubmit(val) {
      this.getAllSubmits();
    },
    async getWork() {
      let _this = this;
      fun_getWorkContent(this.wid)
        .then((res) => {
          let questions = res.data.questions;
          _this.qs = eval(questions);
          _this.qs.forEach((val, i) => {
            _this.qscores[i] = val.qscore;
          });
        })
        .catch((err) => {});
    },
    async getAllSubmits() {
      let _this = this;
      fun_getAllSubmitsByWid(this.wid)
        .then((res) => {
          let submits = res.data;
          _this.submits = eval(submits);
          _this.submits.sort((a, b) => {
            return b.score - a.score;
          });
          //分离已完成批改和未完成批改的
          _this.submit_finish = _this.submits.filter((item) => {
            return item.finishReadOver == 1;
          });
          _this.submit_unfinish = _this.submits.filter((item) => {
            return (
              item.finishReadOver == 0 ||
              item.finishReadOver == undefined ||
              item.finishReadOver == null
            );
          });
          _this.finishGetSubmtis = true;
        })
        .catch((err) => {});
    },
    async getStatistics() {
      this.sta = [];
      let _this = this;
      fun_getSubmitSummary(this.wid)
        .then((res) => {
          let Statistic = {};
          Statistic = JSON.parse(res.data);
          _this.setStatisticsPanel(Statistic);
        })
        .catch((err) => {});
    },
    setStatisticsPanel(statistic) {
      this.statistic_content = statistic;
      this.sta = [];
      this.sta.push({ value: statistic.NOP_excellent, name: "优秀(分数>90%)" });
      this.sta.push({ value: statistic.NOP_good, name: "良好(分数在90%~75%)" });
      this.sta.push({ value: statistic.NOP_NTB, name: "及格(分数在60%~75%)" });
      this.sta.push({ value: statistic.NOP_fail, name: "不及格(分数<60%)" });
    },
    downloadFiles() {
      this.snackbar_msg =
        "后台正在整理文件并进行打包中, 打包完成后会自动唤醒下载😀 ... ";
      this.snackbar = true;
      let form = new FormData();
      form.append("wid", this.wid);
      download("/api/works/teacher/downloadAll", form);
    },
  },
  mounted() {
    let _this = this;
    this.getAllSubmits().then(() => {
      _this.getStatistics().then(() => {
        _this.getWork();
      });
    });
  },
};
</script>

<style scoped></style>
