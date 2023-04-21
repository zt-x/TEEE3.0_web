<template>
  <v-card>
    <v-dialog width="550px" v-model="show_pri" v-if="show_pri">
      <PrimaryQue @close="closePrimaryQue()" :wid="SUBMIT.wid" :qid="pri_qid" />
    </v-dialog>
    <v-card-title
      >{{ SUBMIT.uname }} {{ SUBMIT.score.toFixed(1) }}
      <v-spacer></v-spacer>
      <v-chip small @click="close()">
        <v-icon small>fas fa-close</v-icon>
      </v-chip>
    </v-card-title>
    <v-card-subtitle>
      已批改的题目以 <v-icon color="green">mdi-check</v-icon> 标记,
      未批改的题目以<v-icon color="warning" small>mdi-border-color</v-icon>
      标记。 下列各题得分均为题目的原始分数，总分为经过百分比计算后的得分
    </v-card-subtitle>
    <v-container>
      <v-card v-if="!finishGetAns">
        <v-container>
          <v-row class="text-center">
            <v-col cols="12">
              <v-progress-circular
                indeterminate
                :size="20"
                color="primary"
              ></v-progress-circular>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-expansion-panels class="mb-6" v-if="finishGetAns">
        <v-expansion-panel v-for="(item, i) in readover" :key="i">
          <v-expansion-panel-header
            expand-icon="mdi-menu-down"
            :style="{ color: item == readover_new[i] ? 'black' : '#2196f3' }"
          >
            <div style="width: 25px">
              <v-icon
                color="green"
                v-if="readover_new[i] != -1 && readover_new[i] == qscores[i]"
                small
                >mdi-check</v-icon
              >
              <v-icon
                color="error"
                v-if="readover_new[i] != -1 && readover_new[i] != qscores[i]"
                small
                >mdi-close</v-icon
              >
              <v-icon color="warning" v-if="readover_new[i] == -1" small
                >mdi-border-color</v-icon
              >
            </div>

            第{{ i + 1 }}题
            <v-spacer></v-spacer>
            得分：

            {{
              readover_new[i] == -1
                ? "未批改 / " + qscores[i]
                : readover_new[i] + " / " + qscores[i]
            }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            提交的答案：
            <div
              style="max-height: 300px; overflow: auto"
              v-html="parseContent(submitContent[i])"
            ></div>
            <div v-if="stuFiles[i] != 'noFile'">
              附件(点击下载)
              <br />
              <v-chip
                @click="downloadFile(fp)"
                v-for="(fp, i) in parseArr(stuFiles[i])"
                :key="i"
              >
                {{ getFileName(fp) }}
              </v-chip>
            </div>
            <div v-else>无附件</div>
            <div class="mt-5" style="float: right">
              <v-spacer></v-spacer>
              <v-chip small dark color="blue" @click="showPrimaryQue(i)"
                >查看原题</v-chip
              >
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue" dark text @click="close()">返回</v-btn>
    </v-card-actions>
    <v-overlay v-if="overlay">
      <v-chip>
        <v-progress-circular
          indeterminate
          size="16"
          class="mr-3"
        ></v-progress-circular>
        <v-spacer></v-spacer>
        <span>{{ overlay_msg }}</span>
      </v-chip>
    </v-overlay>
    <v-snackbar
      v-model="snackbar"
      top
      :color="snackbar_color"
      dense
      timeout="2000"
      rounded="pill"
    >
      {{ snackbar_msg }}
    </v-snackbar>
  </v-card>
</template>

<script>
import stuAnsSetScore from "./work/stuAnsSetScore.vue";
import PrimaryQue from "./work/primaryQue.vue";
import { fun_getSubmitBySId } from "@/api/submit";
import { _alert } from "@/plugins/myfun";
import { download } from "@/api/download";
export default {
  components: { stuAnsSetScore, PrimaryQue },
  props: ["SUBMIT", "qscores"],
  data() {
    return {
      submitContent: [],
      readover: [],
      readover_new: [],
      stuFiles: [],
      showChangeScore: false,
      ind_i: 0,
      ind_max: 0,
      overlay: false,
      overlay_msg: "",
      finishGetAns: false,
      snackbar: false,
      snackbar_color: "#be8464",
      snackbar_msg: "",
      pri_qid: -1,
      show_pri: false,
    };
  },
  mounted() {
    this.getSubmitContent();
  },
  methods: {
    closePrimaryQue() {
      this.pri_qid = -1;
      this.show_pri = false;
    },
    showPrimaryQue(i) {
      this.pri_qid = i + 1;
      this.show_pri = true;
    },
    myEval(data) {
      return eval(data);
    },
    parseArr(arrString) {
      return arrString.substr(1, arrString.length - 2).split(",");
    },
    getFileName(str) {
      let str2 = str.substr(str.indexOf("_") + 1);
      return str2.substr(str2.indexOf("_") + 1);
    },
    downloadFile(file) {
      _alert("拉取下载链接😀 ...");
      let form = new FormData();
      form.append("fileType", 1);
      form.append("fileName", file);
      download("/api/upload/getFile", form);
    },
    parseContent(val) {
      let _this = this;
      try {
        // TODO <wait for fixed>
        // 此处存在漏洞 若学生回答刚好能解析成数组， 则会被当做选择题
        let arr = eval(val);
        try {
          if (arr instanceof Array) {
            let str = "";
            for (let i = 0; i < arr.length; i++) {
              str += _this.map(arr[i]) + " ";
            }
            if (str == "") {
              return "无";
            }
            return str;
          } else {
            return val;
          }
        } catch {}
        return "无";
      } catch {
        return val.replaceAll("&quot;", '"');
      }
    },
    map(val) {
      if (val == 0) {
        return "A";
      } else if (val == 1) {
        return "B";
      } else if (val == 2) {
        return "C";
      } else if (val == 3) {
        return "D";
      } else if (val == 4) {
        return "E";
      } else if (val == 5) {
        return "F";
      }
    },

    close() {
      this.$emit("closeSubmitCard", false);
    },
    async getSubmitContent() {
      let _this = this;

      fun_getSubmitBySId(this.SUBMIT.sid)
        .then((res) => {
          let data = res.data;
          data = JSON.parse(
            data
              .replaceAll("\\r", "&[[换行r]]")
              .replaceAll("\\n", "&[[换行n]]")
              .replaceAll("\\t", "&[[table]]")
          );
          _this.readover = eval(data.readover);
          _this.stuFiles = eval(data.files);

          _this.readover.forEach((val, i) => {
            _this.readover_new[i] = val;
          });
          _this.submitContent = eval(
            "(" +
              data.submitContent
                .replaceAll("&[[换行r]]", "\\r")
                .replaceAll("&[[换行n]]", "\\n")
                .replaceAll("&[[table]]", "\\t")
                .replaceAll("&douhao;", ",") +
              ")"
          );
          _this.finishGetAns = true;
        })
        .catch((err) => {
          _alert("getSub" + err);
        });
    },
  },
};
</script>

<style scoped></style>
