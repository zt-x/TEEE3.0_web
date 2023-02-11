<template>
  <v-card class="font-weight-black">
    <v-dialog persistent v-model="dialog_addChoicQue" width="600px">
      <add-choic-que
        v-if="dialog_addChoicQue"
        :defaultData="defaultData"
        :qNum="qNum"
        :isEdit="isEdit"
        @closeAddChoicQue="closeAddChoicQue($event)"
        @addChoicQue="returnChoicQue($event)"
      />
    </v-dialog>
    <v-dialog persistent v-model="dialog_addFillInQue" width="600px">
      <add-fill-in-que
        v-if="dialog_addFillInQue"
        :defaultData="defaultData"
        :qNum="qNum"
        @closeAddFillInQue="closeAddFillInQue($event)"
        @addFillInQue="returnFillInQue($event)"
      />
    </v-dialog>
    <v-dialog persistent v-model="dialog_addTextQue" width="900px">
      <add-text-que
        v-if="dialog_addTextQue"
        :defaultData="defaultData"
        :qNum="qNum"
        @closeAddTextQue="closeAddTextQue($event)"
        @addTextQue="returnTextQue($event)"
      />
    </v-dialog>
    <v-card-title class="headline">
      <v-icon left>fa fa-paper-plane</v-icon>
      <span class="font-weight-black" style="color: #757575">
        作业库
        <span class="font-weight-thin"
          >| {{ bwname ? bwname : "创建新作业库" }}</span
        >
      </span>
      <v-spacer></v-spacer>
      <v-chip small color="grey" @click="close('minus')">
        <!-- <v-icon x-small center color="white">fa fa-minus</v-icon> -->
      </v-chip>
      <v-chip class="ml-2" small color="red" @click="close('close')">
        <!-- <v-icon x-small center color="white">fa fa-times</v-icon> -->
      </v-chip>
    </v-card-title>
    <v-card-text class="px-7 pt-5">
      <v-form :disabled="isEdit == 0">
        <v-row>
          <v-col cols="3">
            <v-text-field
              required
              clearable
              color="primary"
              label="库标题"
              outlined
              :rules="[rules.required]"
              v-model="bwname"
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="9" class="pt-0">
            <v-checkbox
              v-model="isPrivate"
              label="设为私有 (默认)"
              color="#be8464"
            ></v-checkbox>
          </v-col>
          <!-- TAGS -->
          <v-col cols="12">
            <v-combobox
              v-model="tags"
              label="给作业库添加几个标签吧~"
              multiple
              chips
            >
              <template v-slot:selection="data">
                <v-chip
                  small
                  label
                  :color="isEdit == 1 ? 'primary' : 'grey'"
                  outlined
                  :key="JSON.stringify(data.item)"
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  @click:close="data.parent.selectItem(data.item)"
                >
                  {{ data.item }}
                </v-chip>
              </template>
            </v-combobox>
          </v-col>
          <v-col cols="12">
            <!-- 添加题目 -->
            <v-menu
              close-on-click
              close-on-content-click
              offset-y
              transition="slide-x-transition"
              :disabled="isEdit == 0"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  class="white--text"
                  :color="isEdit == 1 ? 'primary' : 'grey'"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon small left>mdi-plus</v-icon>
                  添加题目
                </v-chip>
              </template>
              <v-list>
                <v-list-item @click="addChoicQue()">
                  <v-list-item-title> > 添加选择题</v-list-item-title>
                </v-list-item>
                <v-list-item @click="addFillInQue()">
                  <v-list-item-title> > 添加填空题</v-list-item-title>
                </v-list-item>
                <v-list-item @click="addTextQue()">
                  <v-list-item-title> > 添加简答题</v-list-item-title>
                </v-list-item>
                <v-list-item @click="addQueFromQBank()">
                  <v-list-item-title> > 从题库中选取</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-chip v-if="choiceQue != 0" class="ml-3">
              选择题 {{ choiceQue }} 题
            </v-chip>
            <v-chip v-if="FillInQue != 0" class="ml-3">
              填空题 {{ FillInQue }} 题
            </v-chip>
            <v-chip v-if="TextQue != 0" class="ml-3">
              简答题 {{ TextQue }} 题
            </v-chip>
          </v-col>
          <v-col cols="12">
            <!-- 添加新题目 -->
            <v-card>
              <v-data-table
                class="rounded-0"
                :headers="que_tab_headers"
                :items="questions"
                :items-per-page="6"
                :page.sync="pageOfQuestions"
                @page-count="pageCountOfQuestions = $event"
                hide-default-footer
              >
                <template v-slot:item.qid="{ item }">
                  {{ questions.indexOf(item) + 1 }}
                </template>
                <template v-slot:item.qtype="{ item }">
                  {{
                    item.qtype == "30010"
                      ? "选择题"
                      : item.qtype == "30011"
                      ? "填空题"
                      : "简答题"
                  }}
                </template>
                <template v-slot:item.qtext="{ item }">
                  <span v-if="item.qtype == '30012'" style="color: grey">
                    [简答题]
                  </span>
                  <span v-else> {{ item.qtext.substring(0, 25) }} ... </span>
                </template>
                <template v-slot:item.func="{ item }">
                  <v-chip
                    small
                    color="primary"
                    class="mr-2"
                    @click="editQue(item)"
                    >{{ isEdit == 1 ? "编辑" : "查看" }}</v-chip
                  >
                  <span color="grey">|</span>
                  <v-chip
                    v-if="isEdit == 1"
                    small
                    color="error"
                    class="ml-2"
                    @click="deleteQue(item)"
                    >删除</v-chip
                  >
                </template>
              </v-data-table>
              <div class="text-center pt-2">
                <v-pagination
                  v-model="pageOfQuestions"
                  :length="pageCountOfQuestions"
                ></v-pagination>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" text @click="close()">关闭</v-btn>
      <v-btn
        v-if="bwname != '' && isEdit == 1"
        color="primary"
        min-width="60px"
        class="white--text"
        @click="releaseWorkBank()"
        >{{ this_bid ? "保存修改" : "发布" }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import addChoicQue from "../CourseContentChildren/work/addQuestion/addChoicQue.vue";
import AddFillInQue from "../CourseContentChildren/work/addQuestion/addFillInQue.vue";
import AddTextQue from "../CourseContentChildren/work/addQuestion/addTextQue.vue";
import AddQueFromBank from "../CourseContentChildren/work/addQuestion/addQueFromBank.vue";
import {
  fun_addWorkBank,
  fun_getWorkBankQuestions,
  fun_updateWorkBank,
} from "@/api/bank";
export default {
  components: { addChoicQue, AddFillInQue, AddTextQue, AddQueFromBank },
  props: ["bid", "isEdit"],
  computed: {
    choiceQue() {
      let arr = this.questions.filter((val) => {
        return val.qtype == "30010";
      });
      let len = arr.length;
      return len == 0 ? "0" : len;
    },
    FillInQue() {
      let arr = this.questions.filter((val) => {
        return val.qtype == "30011";
      });
      let len = arr.length;
      return len == 0 ? "0" : len;
    },
    TextQue() {
      let arr = this.questions.filter((val) => {
        return val.qtype == "30012";
      });
      let len = arr.length;
      return len == 0 ? "0" : len;
    },
  },
  data() {
    return {
      this_bid: this.bid,
      isPrivate: true,
      overlay: false,
      overlay_msg: "",
      dialog_addChoicQue: false,
      dialog_addFillInQue: false,
      dialog_addTextQue: false,
      dialog_addQueFromBank: false,
      bwname: "",
      questions: [],
      owner: "",
      tags: [],
      files: [],
      rules: {
        required: (value) => !!value || "不能为空！",
        mustNum: (val) => !isNaN(val) || "不是有效数字!",
      },
      que_tab_headers: [
        {
          text: "题号",
          align: "center",
          value: "qid",
          width: "12.5%",
        },
        {
          text: "题形",
          align: "start",
          value: "qtype",
          width: "15%",
        },
        {
          text: "分数",
          align: "start",
          value: "qscore",
          width: "15%",
        },
        {
          text: "概览",
          align: "start",
          value: "qtext",
          width: "32.5%",
        },
        {
          text: "操作",
          align: "center",
          value: "func",
          sortable: false,
          width: "25%",
        },
      ],
      pageOfQuestions: 1,
      pageCountOfQuestions: null,
      //   编辑题目
      defaultData: {},
      qNum: -1,
    };
  },
  methods: {
    _alert(msg) {
      this.$toasted.show(msg, {
        theme: "outline",
        position: "top-center",
        duration: 2000,
      });
    },
    close(param) {
      this.overlay = false;

      if (param == "close") {
        this.questions = [];
        this.files = [];
      }
      this.$emit("close", true);
    },
    addChoicQue() {
      this.defaultData = {
        qans: [],
        a_ans: "",
        a_err_ans: "",
        ans_score: "",
        ans_text: "",
      };
      this.qNum = -1;
      this.dialog_addChoicQue = true;
    },
    addFillInQue() {
      this.defaultData = {};
      this.qNum = -1;
      this.dialog_addFillInQue = true;
    },
    addTextQue() {
      this.defaultData = {};
      this.qNum = -1;
      this.dialog_addTextQue = true;
    },
    addQueFromQBank() {},
    openWorkBank() {
      this.dialog_addQueFromBank = true;
    },
    closeAddChoicQue(val) {
      this.dialog_addChoicQue = val;
    },
    closeAddFillInQue(val) {
      this.dialog_addFillInQue = val;
    },
    closeAddTextQue(val) {
      this.dialog_addTextQue = val;
    },
    closeQueFromBank(val) {
      this.dialog_addQueFromBank = val;
    },
    editQue(item) {
      //题号
      this.qNum = this.questions.indexOf(item);
      //打开面板
      let qtype = item.qtype;
      if (qtype == "30010") {
        // 选择题
        this.defaultData = item.primaryData;
        this.dialog_addChoicQue = true;
      } else if (qtype == "30011") {
        // 填空题
        this.defaultData = item;
        this.dialog_addFillInQue = true;
      } else {
        this.defaultData = item.primaryData;
        this.dialog_addTextQue = true;
        // 简答题 或其他...
      }
    },
    returnChoicQue(ret) {
      if (ret.qNum != -1) {
        this.questions[ret.qNum] = ret.newQue;
      } else {
        this.questions.push(ret.newQue);
      }
      this.questions.push({});
      this.questions.pop();
      this.dialog_addChoicQue = false;
    },
    returnFillInQue(ret) {
      if (ret.qNum != -1) {
        this.questions[ret.qNum] = ret.newQue;
      } else {
        this.questions.push(ret.newQue);
      }
      this.questions.push({});
      this.questions.pop();
      this.dialog_addFillInQue = false;
    },
    returnTextQue(ret) {
      if (ret.qNum != -1) {
        this.questions[ret.qNum] = ret.newQue;
      } else {
        this.questions.push(ret.newQue);
      }
      this.questions.push({});
      this.questions.pop();
      this.dialog_addTextQue = false;
    },
    returnWorkFronBank(wb) {
      this.wb = [];
      this.wb.push(wb);
      this.dialog_addQueFromBank = false;
    },
    deleteQue(item) {
      this.questions = this.questions.filter((val) => {
        return val != item;
      });
    },
    initBank(bid) {
      fun_getWorkBankQuestions(bid).then((res) => {
        if (res.code > 0) {
          let data = res.data;
          console.log(data);

          this.bwname = data.bwname;
          this.isPrivate = data.isPrivate == 1 ? true : false;
          this.questions = JSON.parse(data.questions);
          this.tags = data.tags ? eval(data.tags) : [];
        } else {
          this._alert(res.msg);
        }
      });
    },
    releaseWorkBank() {
      let bankWork = {};
      bankWork.bwname = this.bwname;
      let questions_str = [];
      this.questions.forEach((item) => {
        // 不删除 primaryData 了 .... 太麻烦
        // delete item.primaryData;
        questions_str.push(JSON.stringify(item));
      });
      bankWork.questions = "[" + questions_str + "]";
      bankWork.isTemp = 0;
      bankWork.isPrivate = this.isPrivate == true ? 1 : 0;
      let tags_str = "[";
      if (this.tags.length > 0) {
        for (let i = 0; i < this.tags.length - 1; i++) {
          tags_str += '"' + this.tags[i] + '",';
        }
        tags_str += '"' + this.tags[this.tags.length - 1] + '"';
      }
      tags_str += "]";
      bankWork.tags = tags_str;
      let _this = this;
      this.overlay = true;
      this.overlay_msg = "发布中 ...";
      if (this.this_bid) {
        bankWork.bwid = this.this_bid;

        fun_updateWorkBank(bankWork).then((res) => {
          if (res.code > 0) {
            _this._alert(res.msg);
          }
          _this.close();
        });
      } else {
        fun_addWorkBank(bankWork).then((res) => {
          if (res.code > 0) {
            _this._alert(res.msg);
          }
          _this.close();
        });
      }
    },
  },
  mounted() {
    if (this.bid) {
      this.initBank(this.bid);
    }
  },
};
</script>
