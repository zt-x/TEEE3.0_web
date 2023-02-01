<template>
  <v-card>
    <v-card-title class="brown--text">添加选择题</v-card-title>
    <v-container>
      <v-row>
        <v-col cols="12" class="py-0">
          <v-textarea
            outlined
            label="输入题目内容"
            clearable
            no-resize
            rows="10"
            v-model="ans_text"
            color="brown"
            style="radius: 0"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" class="py-0">
          <v-text-field
            label="添加选项"
            dense
            append-icon="fas fa-plus"
            v-model="ans"
            hint="按下回车键或右侧加号添加"
            @keypress.enter="addAns()"
            @click:append="addAns()"
            color="brown"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="pt-0">
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="qans"
            item-key="key"
            hide-default-footer
            show-select
            class="elevation-1"
            no-data-text="请添加选项，并勾选正确的选项!"
          >
            <template v-slot:item.qtext="{ item }">
              {{ item.ans }}
            </template>
            <template v-slot:item.actions="{ item }">
              <v-chip small color="error" class="ml-2" @click="removeAns(item.key)"
                >删除</v-chip
              >
            </template>
          </v-data-table>
        </v-col>
        <!-- <v-col cols="6">
          <v-text-field
            label="添加正确答案"
            dense
            append-icon="fas fa-plus"
            v-model="a_ans"
            hint="按下回车键或右侧加号添加"
            @keypress.enter="addCorrAns()"
            @click:append="addCorrAns()"
            color="success"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            label="添加错误答案"
            dense
            append-icon="fas fa-plus"
            hint="按下回车键或右侧加号添加"
            v-model="a_err_ans"
            @click:append="addErrAns()"
            @keypress.enter="addErrAns()"
            color="error"
          ></v-text-field>
        </v-col> -->
      </v-row>
      <!-- <v-row align="center">
        <v-col cols="6" v-for="(ans, i) in qans" :key="i">
          <v-chip
            label
            close
            :color="ans.isCorr ? `success` : `error`"
            @click:close="removeAns(i)"
          >
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
              {{ ans.ans }}
            </span>
          </v-chip>
        </v-col>
      </v-row> -->
    </v-container>
    <v-card-actions>
      <div style="width: 100px">
        <v-text-field
          label="分值"
          dense
          hint="请输入一个整数或Float"
          v-model="ans_score"
        ></v-text-field>
      </div>
      <v-spacer></v-spacer>

      <span class="red--text">{{ this.msg }}</span>
      <v-spacer></v-spacer>

      <v-btn color="green darken-1" text @click="close()">算了</v-btn>
      <v-btn color="green darken-1" min-width="60px" class="white--text" @click="add()"
        >添加</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["defaultData", "qNum"],
  data() {
    return {
      qans: this.defaultData.qans,
      //   方式一
      a_ans: this.defaultData.a_ans,
      a_err_ans: this.defaultData.a_err_ans,
      //   方式二（V-data-Table）
      ans: this.defaultData.ans,
      selected: [],
      ans_score: this.defaultData.ans_score,
      ans_text: this.defaultData.ans_text,
      rules: {
        required: (value) => !!value || "不能为空！",
      },
      msg: "",
      headers: [
        {
          text: "选项内容",
          align: "center",
          sortable: false,
          value: "qtext",
          width: "70%",
        },
        {
          text: "actions",
          align: "center",
          sortable: false,
          value: "actions",
          width: "30%",
        },
      ],
    };
  },
  computed: {
    form() {
      return {
        qans: this.qans,
        a_ans: this.a_ans,
        a_err_ans: this.a_err_ans,
        ans: this.ans,
        ans_score: this.ans_score,
        ans_text: this.ans_text,
      };
    },
  },
  methods: {
    close() {
      this.qans = [];
      this.a_ans = "";
      this.a_err_ans = "";
      this.ans = "";
      this.ans_score = "";
      this.ans_text = "";
      this.msg = "";
      this.$emit("closeAddChoicQue", false);
    },
    add() {
      // 返回JSON
      //{qtype: 30010, qscore: 2.0,
      //qtext: "1111", qans: ["", "", "", ""], cans: [0]}
      console.log(this.selected);
      let _qans = [];
      let _cans = [];
      let newQue = {};
      /*   
	  				方式一
      for (let i = 0; i < this.qans.length; i++) {
        _qans.push(this.qans[i].ans);
        if (this.qans[i].isCorr == true) {
          _cans.push(i);
        }
      }
	  */

      //   			方式二
      for (let i = 0; i < this.qans.length; i++) {
        _qans.push(this.qans[i].ans);
      }
      for (let i = 0; i < this.selected.length; i++) {
        _cans.push(this.selected[i].key);
      }
      //   return;

      if (this.ans_score == "") {
        this.msg = "分值不能为空";
        return;
      } else if (this.ans_text == "") {
        this.msg = "题目内容不能为空";
        return;
      } else if (_qans.length == 0) {
        this.msg = "请添加选项!";
        return;
      } else if (_cans.length == 0) {
        this.msg = "请添加正确选项!";
        return;
      } else if (isNaN(this.ans_score)) {
        this.msg = "请输入一个正确的分数!";
        return;
      }

      newQue.qtype = 30010;
      newQue.qscore = this.ans_score;
      newQue.qtext = this.ans_text;
      newQue.qans = _qans;
      newQue.cans = _cans;
      newQue.primaryData = {
        qans: this.qans,
        a_ans: this.a_ans,
        a_err_ans: this.a_err_ans,
        ans_score: this.ans_score,
        ans_text: this.ans_text,
      };
      this.qans = [];
      this.a_ans = "";
      this.a_err_ans = "";
      this.ans_score = "";
      this.ans_text = "";
      this.msg = "";
      this.$emit("addChoicQue", {
        newQue: newQue,
        qNum: this.qNum,
      });
    },
    addCorrAns() {
      let data = {};
      data.ans = this.a_ans;
      data.isCorr = true;
      this.qans.push(data);
      this.a_ans = "";
    },
    addErrAns() {
      let data = {};
      data.ans = this.a_err_ans;
      data.isCorr = false;
      this.a_err_ans = "";
      this.qans.push(data);
    },
    addAns() {
      let data = {};
      data.ans = this.ans;
      data.key = this.qans.length;
      data.isCorr = false;
      this.ans = "";
      this.qans.push(data);
    },
    removeAns(i) {
      console.log(this.qans);
      this.qans.splice(i, 1);
      for (let j = i; j < this.qans.length; j++) {
        this.qans[j].key = j;
      }
    },
  },
};
</script>

<style scoped></style>
