<template>
  <div class="expansion-panels">
    <v-expansion-panels v-model="displayedPanelList" focusable accordion>
      <v-expansion-panel
        v-for="(itemGroup, groupIndex) in data"
        :key="groupIndex"
      >
        <template v-if="multipleSelect">
          <v-expansion-panel-header
            disable-icon-rotate
            :style="{ backgroundColor: backgroundColor }"
          >
            {{ itemGroup.label }}
            <template v-slot:actions v-if="itemGroup.selectedItems.length > 0">
              <v-avatar size="20" color="red">
                <span class="white--text"
                  >{{ itemGroup.selectedItems.length }}
                </span>
              </v-avatar>
            </template>
          </v-expansion-panel-header>
        </template>
        <template v-else>
          <v-expansion-panel-header
            disable-icon-rotate
            :style="{ backgroundColor: backgroundColor }"
          >
            <div class="mx-1">
              {{ itemGroup.selectedItem.label }}
            </div>
            <template v-slot:actions>
              <v-icon :color="itemGroup.iconColor">{{ itemGroup.icon }}</v-icon>
            </template>
          </v-expansion-panel-header>
        </template>

        <v-expansion-panel-content>
          <div
            v-for="(item, itemIndex) in itemGroup.items"
            :key="itemIndex"
            class="item"
            :class="{
              visible:
                (itemGroup.selectedItems &&
                  itemGroup.selectedItems.includes(item)) ||
                itemGroup.selectedItem === item
            }"
            @click="updateItem(itemGroup, item)"
          >
            {{ item.label }}
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  name: "ExpansionPanels",
  props: {
    data: {
      type: Array,
      require: true,
      default: () => [
        {
          label: "",
          icon: "",
          iconColor: "primary",
          selectedItems: [],
          items: [{ label: "", visible: false }]
        }
      ]
    },
    multipleSelect: {
      type: Boolean,
      require: true,
      default: false
    },
    backgroundColor: {
      type: String,
      require: false,
      default: "#ffffff"
    },
    defaultOpen: {
      type: Number,
      require: false
    },
    multipleSelectInitData: {
      require: false,
      default: null
    }
  },
  data() {
    return {
      displayedPanelList: [],
      changed: null
    };
  },
  created() {
    this.displayedPanelList =
      typeof this.defaultOpen === "undefined" ? [] : this.defaultOpen;
  },
  mounted() {
    if (this.multipleSelect === false) {
      this.data.forEach(itemGroup => {
        if (itemGroup.selectedItem == null) {
          itemGroup.selectedItem = itemGroup.items[0];
        }
        this.$emit("change", itemGroup.selectedItem);
      });
    } else {
      if (this.multipleSelectInitData) {
        const itemGroup = _.find(this.data, {label: this.multipleSelectInitData.group});
        const item = _.find(itemGroup.items, {value: this.multipleSelectInitData});
        this.updateMultipleItem(itemGroup, item);
        this.$emit("change", this.changed);
      }
    }
  },
  methods: {
    updateItem(itemGroup, item) {
      if (this.multipleSelect === false) {
        this.updateSingleItem(itemGroup, item);
      } else {
        this.updateMultipleItem(itemGroup, item);
      }
      this.$emit("change", this.changed);
    },
    updateSingleItem(itemGroup, item) {
      itemGroup.selectedItem = item;
      this.changed = itemGroup.selectedItem;
    },
    updateMultipleItem(itemGroup, item) {
      if (itemGroup.selectedItems.includes(item)) {
        itemGroup.selectedItems.forEach((selectedItem, index) => {
          if (item === selectedItem) {
            itemGroup.selectedItems.splice(index, 1);
          }
        });
      } else {
        itemGroup.selectedItems.push(item);
      }

      let changed = [];
      this.changed = this.data.forEach(itemGroup => {
        changed = changed.concat(itemGroup.selectedItems);
      });
      this.changed = changed;
    }
  }
};
</script>

<style lang="scss">
@import "../common";

.expansion-panels {
  .theme--light.v-expansion-panels .v-expansion-panel {
    margin: 1px 0;
    border-radius: 5px;
  }

  .v-expansion-panel--active .v-expansion-panel-header {
    min-height: 30px;
  }

  .v-expansion-panel-header {
    padding: 5px 10px;
    min-height: 30px;
  }

  .v-expansion-panel-content__wrap {
    padding: 10px;
  }

  .v-expansion-panel-header {
    font-size: 13px;
  }
}
</style>
<style lang="scss" scoped>
@import "../common";

.expansion-panels {
  width: 100%;
}

.item {
  margin: 1px 0;
  font-size: 11px;
  padding: 5px;
  cursor: pointer;
  min-height: 22px;
  line-height: 1;
}

.item.visible {
  background-color: $point-color-1;
  color: #ffffff;
  border-radius: 5px;
}
</style>
