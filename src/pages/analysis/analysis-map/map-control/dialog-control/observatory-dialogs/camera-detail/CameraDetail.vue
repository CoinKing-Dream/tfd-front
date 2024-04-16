<template>
  <div>
    <div class="pa-2">
      <v-card>
        <v-row no-gutters justify="center" class="pa-2 current-image-area">
          <div class="current-image">
            <v-carousel
              height="100%"
              hide-delimiters
              hide-delimiter-background
              v-model="currentImage"
            >
              <v-carousel-item
                v-for="(image, index) in selectedObservatory.imageInfo"
                :key="index"
              >
                <v-img :src="image.url"></v-img>
              </v-carousel-item>
            </v-carousel>
          </div>
        </v-row>
        <div>
          <div class="image-list">
            <div
              v-for="(image, index) in selectedObservatory.imageInfo"
              :key="index"
              :style="{
                width: 100 / selectedObservatory.imageInfo.length + '%'
              }"
              :class="{ 'current-image': index === currentImage }"
              class="image-list-item"
              @click="updateCurrentImage(index)"
            >
              <v-img width="100%" :src="image.url"></v-img>
              <div class="text">
                <div class="date">{{ getMMDDFormat(image.time) }}</div>
                <div class="time">{{ getHHmmFormat(image.time) }}</div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </div>
    <div class="px-2">
      <v-card>
        <v-list disabled nav>
          <v-list-item-group color="primary">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-home-modern</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  v-text="selectedObservatory.name"
                ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-map-marker</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  v-text="
                    `${selectedObservatory.lat},${selectedObservatory.lng}`
                  "
                ></v-list-item-title>
                <v-list-item-subtitle
                  v-text="selectedObservatory.address"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </div>
  </div>
</template>

<script>
import { rootGetters } from "../../../../../../../store/store-functions";
import moment from "moment";

export default {
  name: "CameraDetail",
  inject: {
    analysisMapData: {
      default: []
    }
  },
  data() {
    return {
      currentImage: 0
    };
  },
  computed: {
    selectedObservatory() {
      return this.$store.getters[rootGetters.SELECTED_OBSERVATORY](
        this.analysisMapData.storeId
      );
    }
  },
  mounted() {
    this.currentImage = this.selectedObservatory.imageInfo.length - 1;
  },
  methods: {
    updateCurrentImage(index) {
      this.currentImage = index;
    },
    getMMDDFormat(time) {
      return moment
        .utc(time, "YYYY/MM/DD HH:mm")
        .local()
        .format("MM/DD");
    },
    getHHmmFormat(time) {
      return moment
        .utc(time, "YYYY/MM/DD HH:mm")
        .local()
        .format("HH:mm");
    }
  }
};
</script>

<style lang="scss" scoped>
.current-image-area {
  background-color: black;
  .current-image {
    width: 85%;
  }
}

.image-list {
  white-space: nowrap;

  .image-list-item {
    border-right: 1px solid rgba(0, 0, 0, 0.3);
    cursor: pointer;
    background-color: white;
    display: inline-block;
    .text {
      text-align: center;
      padding: 5px 0;
      line-height: 1.1;
      .date {
        font-size: 10px;
      }
      .time {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .current-image {
    color: white;
    background-color: #0d47a1;
  }
}
.v-list-item__title {
  font-size: 20px !important;
}
</style>
