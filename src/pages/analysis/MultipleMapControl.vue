<template>
  <div class="multiple-map-control">
    <v-row no-gutters align="center">
      <template v-if="multiMapShow">
        <v-list dense>
          <v-list-item-group color="primary">
            <v-list-item>
              <v-btn text icon color="#2c7be5" @click="toggleShow">
                <v-icon>mdi-monitor</v-icon>
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn text icon color="primary" @click="toggleSync">
                <v-icon v-if="multiMapSync">mdi-lan-connect</v-icon>
                <v-icon v-else>mdi-lan-disconnect</v-icon>
              </v-btn>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </template>
      <template v-else>
        <v-btn text icon color="#2c7be5" @click="toggleShow">
          <v-icon>mdi-monitor-multiple</v-icon>
        </v-btn>
      </template>
    </v-row>
  </div>
</template>

<script>
import { rootGetters } from "../../store/store-functions";

export default {
  name: "MultipleMapControl",
  computed: {
    multiMapShow() {
      return this.$store.getters[rootGetters.MULTI_MAP_SHOW];
    },
    multiMapSync() {
      return this.$store.getters[rootGetters.MULTI_MAP_SYNC];
    }
  },
  methods: {
    toggleShow() {
      this.$emit("change-show");
    },
    toggleSync() {
      this.$emit("change-sync");
    }
  }
};
</script>

<style lang="scss" scoped>
.multiple-map-control {
  padding: 0 2px;
  height: 100%;
  box-shadow: 0 0 0 0 white, 0 0 0 0 white,
    5px 0 5px -4px rgba(31, 73, 125, 0.8),
    -5px 0 5px -4px rgba(31, 73, 125, 0.8);

  > div {
    height: 100%;
  }
}
.v-list-item {
  padding: 0;
}
</style>
