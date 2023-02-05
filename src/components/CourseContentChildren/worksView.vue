<template>
  <v-container>
    <div v-for="work in works" v-bind:key="work.id">
      <v-card style="min-width: 100%" hover ripple="" @click="doWork(work)">
        <v-card-title>
          <v-chip
            :color="work.status == -1 ? 'grey' : 'success'"
            label
            small
            class="mr-2"
            dark
          >
            {{ work.status == -1 ? "已截止" : "进行中" }}
          </v-chip>
          {{ work.wname }}
          <v-spacer></v-spacer>
          <div v-show="$vuetify.breakpoint.lgAndUp">
            <v-chip
              v-if="finishGetStatus"
              small
              :color="scoreColor(work.id)"
              text-color="white"
              class="mr-2"
            >
              {{ getScore(work.id) }}
            </v-chip>
            <v-chip
              v-if="!finishGetStatus"
              small
              color="grey lighten-1"
              text-color="white"
              class="mr-2"
            >
              <v-progress-circular
                :size="15"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-chip>
            <span>|</span>
            <v-chip
              v-if="finishGetStatus"
              small
              class="ma-2"
              :color="statusColor(work.id)"
              text-color="white"
            >
              {{ status(work.id) }}
            </v-chip>
            <v-chip
              v-if="!finishGetStatus"
              small
              color="grey lighten-1"
              text-color="white"
              class="mr-2"
            >
              <v-progress-circular
                :size="15"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-chip>
          </div>
        </v-card-title>
        <v-card-subtitle
          >截止时间 |
          {{ work.deadline == null ? " - " : work.deadline }}</v-card-subtitle
        >
      </v-card>
      <div style="height: 5px"></div>
    </div>
    <v-dialog width="550px" v-model="dialog_stuAnsStu">
      <!-- 666 -->
      <stuAnsStu
        v-if="dialog_stuAnsStu"
        @closeSubmitCard="close($event)"
        :SUBMIT="submits"
        :qscores="qscores"
      />
    </v-dialog>
    <v-overlay v-if="loading">
      <v-progress-circular
        small
        indeterminate
        color="primary"
      ></v-progress-circular>
      <div class="mx-auto">{{ loadingText }}</div>
    </v-overlay>
    <v-snackbar
      v-model="snackbar"
      top
      color="error"
      dense="true"
      timeout="2000"
      rounded="pill"
    >
      {{ msg }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";
import stuAnsStu from "./stuAnsStu.vue";
import { fun_getWorkStatus, fun_getWorkContent } from "@/api/work";
import { fun_getSubmitByWorkId } from "@/api/submit";
const _axios = axios.create();
let token = window.localStorage.getItem("token");
export default {
  components: { stuAnsStu },
  props: ["works", "cid"],
  computed: {},
  methods: {
    _alert(msg) {
      this.$toasted.show(msg, {
        theme: "outline",
        position: "top-center",
        duration: 2000,
      });
    },
    close(val) {
      this.dialog_stuAnsStu = false;
    },
    doWork(work) {
      let _this = this;
      if (this.status(work.id) == null || this.status(work.id) == undefined) {
        this._alert("😥 作业状态异常!!");
        this.loading = false;
        return;
      } else {
        if (this.status(work.id) == "未提交") {
          if (work.status == -1) {
            this._alert("😣 这个作业已经超过提交时间啦！");
            return;
          }
          this.$router.push({
            name: "doWork",
            params: { wid: work.id, wname: work.wname, cid: _this.cid },
          });
        } else if (
          this.status(work.id) == "批改中" ||
          this.status(work.id) == "已批改"
        ) {
          this.loading = true;
          this.loadingText = "获取答题卡中 ... ";
          fun_getWorkContent(work.id)
            .then((res) => {
              let questions = res.data;
              _this.qs = eval(questions.questions);
              _this.qs.forEach((val, i) => {
                _this.qscores[i] = val.qscore;
              });
              fun_getSubmitByWorkId(work.id)
                .then((res) => {
                  _this.submits = JSON.parse(res.data);
                  console.log(_this.submits);
                  _this.dialog_stuAnsStu = true;
                  _this.loading = false;
                })
                .catch((err) => {
                  // TODO
                  _this.msg = "发生了错误" + err;
                  _this.loading = false;

                  _this.snackbar = true;
                });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    },
    closeSubmitCard() {},
    status(wid) {
      let ret = "";
      this.finish_status.forEach((val, i) => {
        if (val.wid == wid) {
          ret = val.status;
          if (val.status == -1) {
            ret = "未提交";
          } else if (val.status == 0) {
            ret = "批改中";
          } else if (val.status == 1) {
            ret = "已批改";
          }
        }
      });
      return ret;
    },
    statusColor(wid) {
      let ret = "";
      this.finish_status.forEach((val, i) => {
        if (val.wid == wid) {
          ret = val.status;
          if (val.status == -1) {
            ret = "error";
          } else if (val.status == 0) {
            ret = "warning";
          } else if (val.status == 1) {
            ret = "success";
          }
        }
      });
      return ret;
    },
    scoreColor(wid) {
      let ret = "";
      try {
        this.finish_status.forEach((val, i) => {
          if (val.wid == wid) {
            ret = val.status;
            if (ret == -1 || ret == 0) {
              ret = "grey";
            } else {
              if (Number(val.score) < 60) {
                ret = "error";
              } else if (Number(val.score) <= 80) {
                ret = "warning";
              } else if (Number(val.score) <= 100) {
                ret = "success";
              }
            }
          }
        });
      } catch {
        ret = "grey";
      }
      return ret;
    },
    getScore(wid) {
      let ret = "";
      this.finish_status.forEach((val, i) => {
        if (val.wid == wid) {
          if (val.status == -1) {
            ret = "-";
          } else if (val.status == 0) {
            ret = "-";
          } else if (val.status == 1) {
            ret = val.score;
          }
        }
      });
      return Number(ret).toFixed(1);
    },
    async getWorkStatus() {
      //
      // [{wid:, status: ,score:}]
      //
      let _this = this;
      fun_getWorkStatus(this.cid).then((res) => {
        let arr = eval(res.data);
        arr.forEach((val, i) => {
          _this.finish_status[i] = val;
        });
        _this.finish_status;
        _this.finishGetStatus = true;
      });
    },
  },
  data() {
    return {
      finish_status: [],
      finishGetStatus: false,
      msg: "",
      snackbar: "",
      dialog_stuAnsStu: false,
      qs: [],
      qscores: [],
      submits: [],
      wid: 0,
      loading: false,
      loadingText: "",
    };
  },
  mounted() {
    // unlimit();
    this.getWorkStatus();
  },
  created() {},
};
</script>

<style scoped></style>
