<template>
  <div class="alert-warning">
    <v-container id="scroll-target">
      <v-row no-gutters align="start" justify="center">
        <v-list width="100%">
          <v-list-item v-for="(item, i) in alerts" :key="i" class="px-3 pb-1">
            <alert-information :info="item"></alert-information>
          </v-list-item>
        </v-list>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import AlertInformation from "./AlertInformation";
import { rootGetters } from "../store/store-functions";

export default {
  name: "AlertWarning",
  components: { AlertInformation },
  computed: {
    alerts() {
      return this.$store.getters[rootGetters.ALERTS];
    }
  }
};
</script>
<style lang="scss"></style>
<style lang="scss" scoped>
.alert-warning {
  width: 100%;
  height: 100%;

  .theme--light.v-list {
    background-color: rgba(#ffffff, 0);
    padding: 0;
  }

  .v-list--two-line .v-list-item,
  .v-list-item--two-line {
    margin: 2px 0;
    background-color: rgba(#000000, 0.2);
  }

  .v-list--two-line .v-list-item.not-read,
  .v-list-item--two-line {
    margin: 2px 0;
    background-color: rgba(#0d47a1, 0.6);
  }

  .v-list-item .v-list-item__title {
    color: #ffffff;
    font-weight: bold;
  }

  .theme--light.v-list-item .v-list-item__subtitle {
    color: #ffffff;
    font-weight: normal;
  }

  .v-list-item__action-text {
    color: #ffffff;
    font-weight: bold;
  }

  .alert-title {
    color: white;
    > span {
      color: #fb8c00;
      font-size: 18px;
      margin: 0 5px;
    }
  }

  .scroll-container {
    height: 100%;
    overflow-y: auto;
  }
  #scroll-target {
    height: 100%;
    overflow-y: auto;
    overflow-x: inherit;
    padding: 5px 0;
  }
}
</style>
