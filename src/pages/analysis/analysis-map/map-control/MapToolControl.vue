<template>
  <div class="map-tool-control">
    <v-row no-gutters justify="end">
      <!--      <v-col>-->
      <!--        <v-text-field-->
      <!--          label="住所検索"-->
      <!--          solo-->
      <!--          hide-details-->
      <!--          :append-icon="'mdi-magnify'"-->
      <!--          @click:append="search"-->
      <!--        ></v-text-field>-->
      <!--      </v-col>-->
      <v-col class="buttons-area" cols="auto">
        <v-btn-toggle v-model="toggleTool" multiple @change="onChangeTool">
          <v-btn>
            <v-icon color="white" small>mdi-map-marker-radius</v-icon>
          </v-btn>
          <!--          <v-btn>-->
          <!--            <v-icon color="white" small>mdi-ruler</v-icon>-->
          <!--          </v-btn>-->
          <!--          <v-btn>-->
          <!--            <v-icon color="white" small>mdi-target</v-icon>-->
          <!--          </v-btn>-->
        </v-btn-toggle>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { rootMutations } from "../../../../store/store-functions";

export default {
  name: "MapToolControl",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data() {
    return {
      toggleTool: []
    };
  },
  methods: {
    search() {},
    onChangeTool() {
      this.toggleTool.includes(0)
        ? this.updateAddressMarker(true)
        : this.updateAddressMarker(false);
      //this.toggleTool.includes(1)? this.updateAddressMarker() : this.updateAddressMarker()
      //this.toggleTool.includes(2)? this.updateAddressMarker() : this.updateAddressMarker()
    },
    updateAddressMarker(bool) {
      if (bool) {
        this.$root.$emit("showSystemMessage", {
          message: "地図をクリックすることで住所が確認できます。"
        });
      }
      this.$store.commit(rootMutations.UPDATE_MAP_TOOL, {
        storeId: this.analysisMapData.storeId,
        mapTool: {
          addressMarker: bool
        }
      });
    }
  }
};
</script>
<style lang="scss">
.map-tool-control {
  .v-text-field.v-text-field--solo .v-input__control {
    min-height: 30px;
  }

  .theme--light.v-btn-toggle:not(.v-btn-toggle--group) {
    background-color: #0d47a1;
  }

  .theme--light.v-btn-toggle:not(.v-btn-toggle--group) .v-btn.v-btn {
    background-color: rgba(0, 0, 0, 0);
  }

  .v-input input {
    height: 30px;
  }

  .theme--light.v-btn {
    color: white;
  }
}
</style>
<style lang="scss" scoped>
.map-tool-control {
  .buttons-area {
    -webkit-box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 01 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);

    .v-btn-toggle:not(.v-btn-toggle--dense) .v-btn.v-btn.v-size--default {
      height: 30px;
      min-height: 0;
      min-width: 30px;
    }
    .v-btn-toggle > .v-btn.v-btn {
      padding: 5px;
    }
  }
}
</style>
