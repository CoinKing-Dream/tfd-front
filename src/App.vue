<template>
  <v-app id="app">
    <v-snackbar v-model="snackbar" bottom :right="right">
      {{ systemMessage }}
      <v-btn color="pink" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-dialog v-model="dialog">
      <v-card color="blue-grey darken-1" dark>
        <v-card-title class="headline">{{
          this.dialogItem.title
        }}</v-card-title>

        <v-card-text>
          {{ this.dialogItem.text }}
        </v-card-text>

        <v-card-text v-html="this.dialogItem.comment"></v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">
            確認
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <alert-process v-if="userInfo"></alert-process>
    <router-view v-if="userInfo"></router-view>
  </v-app>
</template>

<script>
import AlertProcess from "./components/AlertProcess";
import { rootActions, rootGetters } from "./store/store-functions";
export default {
  name: "app",
  components: { AlertProcess },
  data() {
    return {
      systemMessage: "default",
      snackbar: false,
      right: false,
      dialogItem: {},
      dialog: false
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters[rootGetters.USER_INFO];
    }
  },
  created() {
    this.loadUserInfo();
  },
  mounted() {
    this.$root.$on("showSystemMessage", this.showSystemMessage);
    this.$root.$on("showAlertDialog", this.showAlertDialog);
  },
  methods: {
    showSystemMessage({ message, type }) {
      if (type === "risk") {
        this.right = true;
      } else {
        this.right = false;
      }

      this.systemMessage = message;
      this.snackbar = true;
    },
    showAlertDialog({ alert_info }) {
      this.dialogItem = alert_info;
      if (this.dialogItem.comment) {
        this.dialogItem.comment = this.dialogItem.comment.replace(
          /\n/g,
          "<br/>"
        );
      }
      this.dialog = true;
    },
    loadUserInfo() {
      this.$store.dispatch(rootActions.LOAD_USER_INFO);
    }
  }
};
</script>

<style>
html,
body {
  overflow: hidden;
}
::-webkit-scrollbar {
  display: none;
}

.v-snack.v-snack--active.v-snack--bottom {
  z-index: 5000;
}

.v-dialog__content.v-dialog__content--active {
  z-index: 5000 !important;
}

.v-overlay.v-overlay--active.theme--dark {
  z-index: 5000 !important;
}
</style>
