<template>
  <v-card class="font-weight-black">
    <v-dialog persistent v-model="dialog_ifSaveAsWorkBank" width="400px">
      <v-overlay v-if="overlay" absolute>
        <v-chip>
          <v-progress-circular indeterminate size="16" class="mr-3"></v-progress-circular>
          <v-spacer></v-spacer>
          <span>{{ overlay_msg }}</span>
        </v-chip>
      </v-overlay>
      <v-card>
        <v-card-title>保存到作业库</v-card-title>
        <v-text-field
          v-model="work_name"
          label="作业库名称"
          hint="作业库中的作业可以重复使用。若不想保存至作业库, 可不填"
          solo
        ></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="releaseWork(true)"
            >不保存, 直接发布</v-btn
          >
          <v-btn color="green darken-1" @click="releaseWork(false)" class="white--text"
            >保存</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="dialog_addChoicQue" width="600px">
      <add-choic-que
        v-if="dialog_addChoicQue"
        :defaultData="defaultData"
        :qNum="qNum"
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
    <v-dialog
      persistent
      v-if="dialog_addQueFromBank"
      v-model="dialog_addQueFromBank"
      width="900px"
    >
      <add-que-from-bank
        @closeQueFromBank="closeQueFromBank($event)"
        @addFormBank="returnWorkFronBank($event)"
      />
    </v-dialog>
    <v-card-title class="headline">
      <v-icon left>fa fa-paper-plane</v-icon>
      <span class="font-weight-black" style="color: #757575">
        发布作业 |
        <span class="font-weight-thin" v-if="tab == 0"> 作业信息</span>
        <span class="font-weight-thin" v-if="tab == 1"> 考试规则设置</span>
      </span>
      <v-spacer></v-spacer>
      <v-chip small color="grey" @click="close('minus')">
        <!-- <v-icon x-small center color="white">fa fa-minus</v-icon> -->
      </v-chip>
      <v-chip class="ml-2" small color="red" @click="close('close')">
        <!-- <v-icon x-small center color="white">fa fa-times</v-icon> -->
      </v-chip>
    </v-card-title>
    <v-tabs height="0px" v-model="tab" background-color="primary" dark></v-tabs>
    <v-tabs-items v-model="tab">
      <!-- 基础设置 -->
      <v-tab-item>
        <v-card-text class="px-7">
          <v-form>
            <v-row>
              <v-col cols="3">
                <v-text-field
                  required
                  clearable
                  color="#875438"
                  label="作业标题"
                  :rules="[rules.required]"
                  v-model="workTitle"
                ></v-text-field>
              </v-col>
              <v-col :cols="releaseWork_isExam ? 2 : 3">
                <v-text-field
                  required
                  clearable
                  color="#875438"
                  label="分数"
                  v-model="totalScore"
                  :rules="[rules.required, rules.mustNum]"
                ></v-text-field>
              </v-col>
              <v-col :cols="releaseWork_isExam ? 2 : 0" v-if="releaseWork_isExam">
                <v-text-field
                  required
                  clearable
                  color="#875438"
                  label="作答限时"
                  hint="单位为分钟"
                  v-model="timeLimit"
                  :rules="[rules.required, rules.mustNum]"
                ></v-text-field>
              </v-col>
              <v-col :cols="releaseWork_isExam ? 2 : 3">
                <v-menu
                  style="font-size: small"
                  v-model="TimeMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  min-width="290px"
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      clearable
                      color="#875438"
                      v-model="deadline"
                      readonly
                      label="作业截止时间"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    color="brown lighten-1"
                    locale="zh-cn"
                    :first-day-of-week="0"
                    v-model="deadline"
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="TimeMenu = false">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="3">
                <v-checkbox
                  v-model="releaseWork_isExam"
                  color="#875438"
                  label="设为考试"
                ></v-checkbox>
              </v-col>

              <v-col cols="12">
                作业内容:
                <v-radio-group mandatory dense row v-model="workContentRadio">
                  <v-radio
                    label="创建新作业"
                    color="#875438"
                    value="createNewWork"
                  ></v-radio>
                  <v-radio
                    label="从作业库中选取"
                    color="#875438"
                    value="searchFromBank"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12">
                <!-- 添加题目 -->
                <v-menu
                  close-on-click
                  close-on-content-click
                  offset-y
                  transition="slide-x-transition"
                  v-if="workContentRadio == 'createNewWork'"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip class="white--text" color="#875438" v-bind="attrs" v-on="on">
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
                <!-- 选择作业库 -->
                <v-chip
                  class="white--text"
                  color="brown"
                  v-if="workContentRadio == 'searchFromBank'"
                  @click="openWorkBank()"
                >
                  <v-icon small left>fa fa-folder-open</v-icon>
                  打开作业库
                </v-chip>
                <v-chip class="ml-5"> 总分 {{ totalScore }}分 </v-chip>
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
                <v-card v-if="workContentRadio == 'createNewWork'">
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
                      <v-chip small color="primary" class="mr-2" @click="editQue(item)"
                        >编辑</v-chip
                      >
                      <span color="grey">|</span>
                      <v-chip small color="error" class="ml-2" @click="deleteQue(item)"
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

                <!-- 从Bank中获取的 -->
                <v-card class="px-5 py-5" v-if="workContentRadio == 'searchFromBank'">
                  <!-- TODO: 点击后进行二次编辑 -->
                  <v-chip
                    label
                    dark
                    color="success"
                    class="mx-2 my-1"
                    close
                    v-for="(bk, i) in wb"
                    :key="bk.id"
                    @click:close="wb.splice(i, 1)"
                    >{{ bk.bn }}</v-chip
                  >
                </v-card>
                <v-row class="ml-0">
                  <v-checkbox
                    row
                    v-model="autoReadoverChoice"
                    color="#875438"
                    label="自动批改选择题"
                  ></v-checkbox>
                  <v-checkbox
                    class="ml-5"
                    v-model="autoReadoverFillIn"
                    color="#875438"
                    label="自动批改填空题"
                  ></v-checkbox>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-tab-item>
      <!-- 考试设置 -->
      <v-tab-item>
        <v-card-text class="px-6">
          <v-card>
            <v-card-title>进入考试前的验证</v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-checkbox
                      row
                      v-model="rule_pre_FACECHECK"
                      color="#875438"
                      label="人脸验证"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="rule_pre_TEXT" label="考前提醒信息"></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
          <v-card class="mt-2">
            <v-card-title>监考设置</v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="4">
                    <v-checkbox
                      row
                      v-model="rule_enter_TRACKIP"
                      color="#875438"
                      label="记录考试IP"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="4">
                    <v-checkbox
                      row
                      v-model="rule_enter_TAKEPHOTO"
                      color="#875438"
                      label="考试中随机拍照"
                    >
                    </v-checkbox>
                  </v-col>
                  <v-col cols="4"></v-col>
                  <v-col cols="4"></v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-tab-item>
    </v-tabs-items>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green darken-1" text @click="close()">算了</v-btn>
      <v-btn
        v-if="tab == 0 && releaseWork_isExam == true"
        text
        color="green darken-1"
        min-width="60px"
        class="white--text"
        @click="
          tab = 1;
          rule_pre_TEXT = '';
        "
        >下一步</v-btn
      >
      <v-btn
        v-if="tab == 1"
        text
        color="green darken-1"
        min-width="60px"
        class="white--text"
        @click="tab = 0"
        >返回上一步</v-btn
      >
      <v-btn
        v-if="tab == 1 || releaseWork_isExam == false"
        color="green darken-1"
        min-width="60px"
        class="white--text"
        @click="beforeReleaseWork()"
        >发布</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import addChoicQue from "./addQuestion/addChoicQue.vue";
import AddFillInQue from "./addQuestion/addFillInQue.vue";
import AddTextQue from "./addQuestion/addTextQue.vue";
import AddQueFromBank from "./addQuestion/addQueFromBank.vue";
import { fun_addWorkBank } from "@/api/bank";
import { fun_releaseWork, fun_setRule } from "@/api/work";
export default {
  components: { addChoicQue, AddFillInQue, AddTextQue, AddQueFromBank },
  props: ["cid"],
  computed: {
    choiceQue() {
      let arr = this.questions.filter((val) => {
        return val.qtype == "30010";
        // return JSON.parse(val).qtype == "30010";
      });
      let len = arr.length;
      return len == 0 ? "0" : len;
    },
    FillInQue() {
      let arr = this.questions.filter((val) => {
        return val.qtype == "30011";
        // return JSON.parse(val).qtype == "30011";
      });
      let len = arr.length;
      return len == 0 ? "0" : len;
    },
    TextQue() {
      let arr = this.questions.filter((val) => {
        return val.qtype == "30012";
        // return JSON.parse(val).qtype == "30012";
      });
      let len = arr.length;
      return len == 0 ? "0" : len;
    },
  },
  data() {
    return {
      tab: 0,
      overlay: false,
      overlay_msg: "",
      releaseWork_isExam: false,
      workTitle: "",
      workContentRadio: "",
      timeLimit: "",
      createNewWork: "",
      searchFromBank: "",
      totalScore: 100,
      Rate: 0.32,
      deadline: "",
      rule_pre_FACECHECK: false,
      rule_pre_TEXT: "请同学们认真作答!",
      rule_enter_TRACKIP: false,
      rule_enter_TAKEPHOTO: false,
      autoReadoverChoice: true,
      autoReadoverFillIn: true,
      dialog_addChoicQue: false,
      dialog_addFillInQue: false,
      dialog_addTextQue: false,
      dialog_addQueFromBank: false,
      dialog_ifSaveAsWorkBank: false,
      questions: [],
      wb: [],
      files: [],
      work_name: "",
      isTemp: false,
      rules: {
        required: (value) => !!value || "不能为空！",
        mustNum: (val) => !isNaN(val) || "不是有效数字!",
      },
      TimeMenu: "",
      valid: "",
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
      if (param == "close") {
        this.workTitle = "";
        this.totalScore = "";
        this.timeLimit = "";
        this.TimeMenu = "";
        this.deadline = "";
        this.releaseWork_isExam = false;
        this.workContentRadio = "";
        this.questions = [];
        this.wb = "";
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
    beforeReleaseWork() {
      if (this.workTitle == "") {
        this._alert("请输入作业标题");
        return;
      } else if (this.totalScore == "") {
        this._alert("请输入分数");
        return;
      }

      if (this.workContentRadio == "createNewWork") {
        if (this.questions.length <= 0) {
          this._alert("请不要发布空作业");
          return;
        } else {
          this.dialog_ifSaveAsWorkBank = true;
        }
      } else if (this.workContentRadio == "searchFromBank") {
        if (this.wb.length <= 0) {
          this._alert("请不要发布空作业");
          return;
        } else {
          this.releaseWorkWithBankID(this.wb[0].id);
        }
      }
    },
    releaseWorkWithBankID(bkid) {
      let aWork = {};
      aWork.cid = this.cid;
      aWork.deadline = this.deadline;
      aWork.totalScore = this.totalScore;
      aWork.wname = this.workTitle;
      aWork.autoReadoverChoice = this.autoReadoverChoice ? 1 : 0;
      aWork.autoReadoverFillIn = this.autoReadoverFillIn ? 1 : 0;
      aWork.bwid = bkid;
      aWork.timeLimit = this.timeLimit;
      aWork.isExam = this.releaseWork_isExam ? 1 : 0;
      let _this = this;
      this.overlay = true;
      this.overlay_msg = "发布中 ...";
      fun_releaseWork(aWork)
        .then((res2) => {
          let setRulesForm = {};
          setRulesForm.wid = res2.data;
          let rulePre = [];
          let ruleEnter = [];

          if (_this.rule_pre_FACECHECK == true) {
            rulePre.push("FACECHECK");
          }
          if (_this.rule_enter_TRACKIP == true) {
            ruleEnter.push("TRACKIP");
          }
          if (_this.rule_enter_TAKEPHOTO == true) {
            ruleEnter.push("TAKEPHOTO");
          }
          setRulesForm.rulePre = "[" + rulePre.toString() + "]";
          setRulesForm.ruleText = _this.rule_pre_TEXT;
          setRulesForm.ruleEnter = "[" + ruleEnter.toString() + "]";
          fun_setRule(setRulesForm)
            .then((res3) => {
              _this.overlay = false;
              _this.$dialog({
                title: "Msg",
                content: res2.msg,
                btns: [
                  {
                    label: "返回课程页面",
                    color: "red",
                    ghost: true,
                    callback: () => {
                      _this.close();
                    },
                  },
                ],
              });
            })
            .catch((err) => {
              _this.overlay = false;
              this._alert(err);
              console.error(err);
            });
        })
        .catch((err) => {
          _this.overlay = false;
          this._alert(err);
          console.error(err);
        });
    },
    releaseWork(isTemp) {
      if (isTemp == false) {
        //保存到作业库
        if (this.work_name == "") {
          this._alert("请为本次作业在作业库中命一个名哦!🥺");
          return;
        }
      }

      let aWork = {};
      let work = {};
      aWork.cid = this.cid;
      aWork.deadline = this.deadline;
      aWork.totalScore = this.totalScore;
      aWork.wname = this.workTitle;
      aWork.autoReadoverChoice = this.autoReadoverChoice ? 1 : 0;
      aWork.autoReadoverFillIn = this.autoReadoverFillIn ? 1 : 0;
      aWork.bwid = 0;
      aWork.timeLimit = this.timeLimit;
      aWork.isExam = this.releaseWork_isExam ? 1 : 0;
      work.bwname = this.work_name;
      let questions_str = [];
      this.questions.forEach((item) => {
        // 不删除 primaryData 了 .... 太麻烦
        // delete item.primaryData;
        questions_str.push(JSON.stringify(item));
      });
      // TODO
      //   return;
      work.questions = "[" + questions_str + "]";
      work.isTemp = isTemp ? 1 : 0;

      let _this = this;
      this.overlay = true;
      this.overlay_msg = "发布中 ...";
      fun_addWorkBank(work).then((res) => {
        aWork.bwid = res.data;
        fun_releaseWork(aWork)
          .then((res2) => {
            let setRulesForm = {};
            setRulesForm.wid = res2.data;
            let rulePre = [];
            let ruleEnter = [];

            if (_this.rule_pre_FACECHECK == true) {
              rulePre.push("FACECHECK");
            }
            if (_this.rule_enter_TRACKIP == true) {
              ruleEnter.push("TRACKIP");
            }
            if (_this.rule_enter_TAKEPHOTO == true) {
              ruleEnter.push("TAKEPHOTO");
            }
            setRulesForm.rulePre = "[" + rulePre.toString() + "]";
            setRulesForm.ruleText = _this.rule_pre_TEXT;
            setRulesForm.ruleEnter = "[" + ruleEnter.toString() + "]";
            fun_setRule(setRulesForm)
              .then((res3) => {
                _this.overlay = false;
                _this.$dialog({
                  title: "Msg",
                  content: res2.msg,
                  btns: [
                    {
                      label: "返回课程页面",
                      color: "red",
                      ghost: true,
                      callback: () => {
                        _this.close();
                      },
                    },
                  ],
                });
              })
              .catch((err) => {
                this._alert(err);
                console.error(err);
              });
          })
          .catch((err) => {
            this._alert(err);
            console.error(err);
          });
      });
    },
    closeFunc(val) {
      this.dialog_ifSaveAsWorkBank = val;
      this.close();
    },
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 1px;
  height: 1px;
  background-color: #f5f5f5;
}
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #a36645;
}
</style>
