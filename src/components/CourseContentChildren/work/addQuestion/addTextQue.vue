<template>
  <v-card>
    <v-snackbar
      v-model="snackbar"
      v-if="snackbar"
      top
      :color="snackbar_color"
      dense="true"
      timeout="2000"
    >
      {{ snackbar_msg }}
    </v-snackbar>
    <v-card-title>添加简答题</v-card-title>
    <v-container>
      <v-row>
        <v-col
          class="text-center primary--text"
          cols="12"
          v-if="loading_ckeditor"
        >
          首次加载富文本编辑框资源较慢，请耐心等待一会儿哦 ..
        </v-col>
        <v-col class="text-center" cols="12" v-if="loading_ckeditor">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-col>
        <v-col cols="12">
          <ckeditor
            v-model="ans_text"
            :config="editorConfig"
            editor-url="/ckeditor/ckeditor.js"
            @ready="onEditorReady()"
          ></ckeditor>
        </v-col>
        <!-- 添加附件 -->
        <v-col cols="12">
          <v-file-input
            dense
            v-model="files"
            color="#be8464"
            multiple
            placeholder="点击选择添加附件"
            prepend-icon="mdi-paperclip"
            outlined
            @change="sout(files)"
          >
            <template v-slot:selection="{ index, text }">
              <v-chip
                close
                v-if="index < 3"
                color="#be8464"
                dark
                label
                small
                @click:close="files.splice(index, 1)"
              >
                {{ text }}
              </v-chip>

              <span
                v-else-if="index === 3"
                class="overline grey--text text--darken-3 mx-2"
              >
                +{{ files.length - 3 }} File(s)
              </span>
            </template>
          </v-file-input>
        </v-col>
      </v-row>
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

      <v-btn color="#b97a57" text @click="close()">算了</v-btn>
      <v-btn
        :loading="loading_upload"
        color="#b97a57"
        min-width="60px"
        class="white--text"
        @click="add()"
        >添加</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
import CKEditor from "ckeditor4-vue";
let token = window.localStorage.getItem("token");
export default {
  props: ["defaultData", "qNum"],

  components: { ckeditor: CKEditor.component },

  data() {
    return {
      snackbar: false,
      snackbar_color: "primary",
      snackbar_msg: "",
      loading_upload: false,
      files: this.defaultData.files,
      filesRealPath: [],
      ans_score: this.defaultData.ans_score,
      ans_text: this.defaultData.ans_text,
      editorConfig: {
        removePlugins: "image,easyimage,cloudservices,exportpdf",
        extraPlugins: "image2,uploadimage",
        uploadUrl: "/api/upload/works",
        filebrowserImageBrowseUrl: "/api/upload/works",
        filebrowserImageUploadUrl: "/api/upload/works",
        removeButtons:
          "Save,NewPage,ExportPdf,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Scayt,SelectAll,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CopyFormatting,RemoveFormat,Outdent,Indent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Table,PageBreak,Iframe,ShowBlocks,About,Source",
        toolbarGroups: [
          { name: "document", groups: ["mode", "document", "doctools"] },
          { name: "clipboard", groups: ["clipboard", "undo"] },
          {
            name: "editing",
            groups: ["find", "selection", "spellchecker", "editing"],
          },
          { name: "forms", groups: ["forms"] },
          { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
          "/",
          {
            name: "paragraph",
            groups: ["list", "indent", "blocks", "align", "bidi", "paragraph"],
          },
          { name: "links", groups: ["links"] },
          { name: "insert", groups: ["insert"] },
          { name: "styles", groups: ["styles"] },
          { name: "colors", groups: ["colors"] },
          { name: "tools", groups: ["tools"] },
          { name: "others", groups: ["others"] },
          { name: "about", groups: ["about"] },
        ],
      },
      loading_ckeditor: true,
      rules: {
        required: (value) => !!value || "不能为空！",
      },
      msg: "",
    };
  },
  methods: {
    onEditorReady() {
      this.loading_ckeditor = false;
    },
    _alert(msg) {
      this.$toasted.show(msg, {
        theme: "outline",
        position: "top-center",
        duration: 2000,
      });
    },
    sout(val) {
      console.log(val);
    },
    close() {
      this.ans_score = "";
      this.ans_text = "";
      this.files = [];
      this.msg = "";
      this.$emit("closeAddTextQue", false);
    },
    add() {
      let _this = this;
      if (this.ans_score == "") {
        this.msg = "分值不能为空";
        return;
      } else if (this.ans_text == "") {
        this.msg = "题目内容不能为空";
        return;
      } else if (isNaN(this.ans_score)) {
        this.msg = "请输入一个正确的分数!";
        return;
      }
      if (!this.files) {
        this.files = [];
      }
      //   console.log(this.ans_score, this.ans_text, this.files);
      //   return;
      if (this.files.length != 0) {
        token = window.localStorage.getItem("token");
        let param = new FormData();
        for (let i in this.files) {
          param.append("file", this.files[i]);
        }
        this.loading_upload = true;
        let config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        };
        axios
          .post("/api/upload/file", param, config)
          .then((res) => {
            if (res.data.code < 0) {
              // 上传失败
              _this._alert(res.data.msg);
              return;
            } else {
              _this._alert(res.data.msg);
              //   解析 获得 FileRealPath
              // 返回JSON
              // {qtype: 30012, qscore: 2.0,
              // qtext: "1111", cans: "",files:""}

              let newQue = {};
              newQue.qtype = 30012;
              newQue.qscore = this.ans_score;
              newQue.qtext = this.ans_text;
              newQue.qfiles = eval(res.data.data);
              //上传附件

              //

              newQue.primaryData = {
                ans_score: this.ans_score,
                ans_text: this.ans_text,
                files: this.files,
              };
              this.ans_score = "";
              this.ans_text = "";
              this.files = [];
              this.msg = "";
              this.$emit("addTextQue", {
                newQue: newQue,
                qNum: this.qNum,
              });
              _this.loading_upload = false;
            }
          })
          .catch((err) => {
            _this.snackbar_color = "error";
            _this.snackbar_msg = err;
            _this.loading_upload = false;
          });
        // return;
      } else {
        let newQue = {};
        newQue.qtype = 30012;
        newQue.qscore = this.ans_score;
        newQue.qtext = this.ans_text;
        newQue.qfiles = "";
        //上传附件

        //

        newQue.primaryData = {
          ans_score: this.ans_score,
          ans_text: this.ans_text,
          files: this.files,
        };
        this.ans_score = "";
        this.ans_text = "";
        this.msg = "";
        this.$emit("addTextQue", {
          newQue: newQue,
          qNum: this.qNum,
        });
      }
    },
  },
};
</script>

<style scoped></style>
